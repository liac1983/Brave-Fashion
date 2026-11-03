import Stripe from "stripe";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { SHIPPING, type Tamanho, stockTotal, temTamanhos } from "@/lib/shop";
import { getStripeSecretKey } from "@/lib/stripe";

/**
 * Cria a sessão de pagamento no momento em que a cliente clica em Comprar.
 *
 * O preço vem sempre do Sanity, nunca do browser: assim não há forma de a
 * cliente alterar o valor, e nunca há um preço antigo guardado no Stripe à
 * espera de ser cobrado por engano. O mesmo vale para o tamanho — do browser
 * vem apenas a chave da linha, e é aqui que se confirma que essa linha existe
 * e que ainda tem unidades.
 */

const PRODUTO_QUERY = groq`
  *[_type == "product" && slug.current == $handle][0] {
    _id,
    title,
    price,
    venderOnline,
    available,
    "tamanhos": tamanhos[] {
      "key": _key,
      "label": tamanho,
      stock
    },
    "imagem": images[0].asset->url
  }
`;

type Produto = {
  _id: string;
  title: string;
  price: number;
  venderOnline: boolean;
  available: boolean;
  tamanhos: Tamanho[] | null;
  imagem: string | null;
};

/**
 * O stock é lido fora da CDN e sempre na versão publicada.
 *
 * A CDN do Sanity serve respostas guardadas até um minuto. Para a descrição de
 * uma peça isso é irrelevante; para saber se o último M ainda existe, um minuto
 * é tempo que sobra para vender duas vezes a mesma unidade.
 *
 * A perspetiva fica escrita à mão porque o que ela vale por omissão depende da
 * versão da API do Sanity: um rascunho meio preenchido no Studio não pode
 * decidir o que se vende.
 */
const liveClient = client.withConfig({ useCdn: false, perspective: "published" });

function eurosParaCentimos(valor: number) {
  return Math.round(valor * 100);
}

/** Portes oferecidos no checkout. Os valores vivem em lib/shop.ts. */
function opcoesDeEnvio(precoPeca: number): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const portesGratis = precoPeca >= SHIPPING.freeFrom;

  const taxa = (
    nome: string,
    centimos: number,
    diasMin: number,
    diasMax: number
  ): Stripe.Checkout.SessionCreateParams.ShippingOption => ({
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: nome,
      fixed_amount: { amount: centimos, currency: "eur" },
      delivery_estimate: {
        minimum: { unit: "business_day", value: diasMin },
        maximum: { unit: "business_day", value: diasMax },
      },
    },
  });

  const opcoes = [
    taxa(
      portesGratis ? "Portugal Continental (grátis)" : "Portugal Continental",
      portesGratis ? 0 : eurosParaCentimos(SHIPPING.cost),
      2,
      3
    ),
    // Os portes gratuitos acima de 100 € são só do continente: para as ilhas
    // os CTT cobram sempre, e oferecê-los comeria a margem da peça.
    taxa("Açores e Madeira", eurosParaCentimos(SHIPPING.islands), 3, 5),
    taxa("União Europeia", eurosParaCentimos(SHIPPING.europe), 5, 10),
  ];

  if (SHIPPING.pickupAvailable) {
    opcoes.push(taxa("Levantamento na loja, em Paços de Ferreira", 0, 1, 2));
  }

  return opcoes;
}

export async function POST(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const chave = getStripeSecretKey();

  if ("erro" in chave) {
    console.error("[checkout]", chave.erro);
    return Response.json({ error: "Pagamentos não estão configurados." }, { status: 500 });
  }

  const secretKey = chave.key;

  let handle: string;
  let tamanhoPedido: string | null = null;

  try {
    const body = (await request.json()) as { handle?: unknown; tamanho?: unknown };
    if (typeof body.handle !== "string" || !body.handle) {
      return Response.json({ error: "Produto não indicado." }, { status: 400 });
    }
    handle = body.handle;
    if (typeof body.tamanho === "string" && body.tamanho) {
      tamanhoPedido = body.tamanho;
    }
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const produto: Produto | null = await liveClient.fetch(PRODUTO_QUERY, { handle });

  if (!produto) {
    return Response.json({ error: "Peça não encontrada." }, { status: 404 });
  }

  // Duas portas: a peça tem de estar à venda online e ainda disponível. A
  // segunda fecha-se sozinha quando a peça é vendida, pelo webhook.
  if (!produto.venderOnline || !produto.available) {
    return Response.json(
      { error: "Esta peça já não está disponível para compra online." },
      { status: 409 }
    );
  }

  if (!produto.price || produto.price <= 0) {
    console.error("[checkout] preço inválido em", produto._id);
    return Response.json({ error: "Peça sem preço definido." }, { status: 409 });
  }

  const tamanhos = produto.tamanhos ?? [];
  let tamanhoEscolhido: Tamanho | null = null;

  if (temTamanhos(tamanhos)) {
    if (stockTotal(tamanhos) <= 0) {
      return Response.json(
        { error: "Esta peça está esgotada em todos os tamanhos." },
        { status: 409 }
      );
    }

    if (!tamanhoPedido) {
      return Response.json({ error: "Escolha o tamanho antes de comprar." }, { status: 400 });
    }

    const encontrado = tamanhos.find((tamanho) => tamanho.key === tamanhoPedido);

    // A lista pode ter mudado no Studio desde que a página foi carregada: o
    // tamanho pode já não existir, ou já não ter unidades.
    if (!encontrado) {
      return Response.json(
        { error: "Esse tamanho já não existe nesta peça. Recarregue a página." },
        { status: 409 }
      );
    }

    if (encontrado.stock <= 0) {
      return Response.json(
        { error: `O tamanho ${encontrado.label} está esgotado.` },
        { status: 409 }
      );
    }

    tamanhoEscolhido = encontrado;
  }

  const stripe = new Stripe(secretKey);
  const nomeNoStripe = tamanhoEscolhido
    ? `${produto.title} — Tamanho ${tamanhoEscolhido.label}`
    : produto.title;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: eurosParaCentimos(produto.price),
            product_data: {
              name: nomeNoStripe,
              images: produto.imagem ? [produto.imagem] : undefined,
            },
          },
        },
      ],
      shipping_address_collection: {
        allowed_countries: [
          "PT", "ES", "FR", "DE", "IT", "NL", "BE", "LU", "IE", "AT",
          "DK", "FI", "SE", "PL", "CZ", "SK", "SI", "HR", "HU", "RO",
          "BG", "GR", "EE", "LV", "LT", "CY", "MT",
        ],
      },
      shipping_options: opcoesDeEnvio(produto.price),
      phone_number_collection: { enabled: true },
      custom_fields: [
        {
          key: "nif",
          label: { type: "custom", custom: "NIF (para a fatura)" },
          type: "text",
          optional: true,
        },
      ],
      // O webhook usa isto para descer o stock do tamanho certo — ou, se a
      // peça for única, para a retirar do site.
      metadata: {
        productId: produto._id,
        handle,
        ...(tamanhoEscolhido
          ? { tamanhoKey: tamanhoEscolhido.key, tamanho: tamanhoEscolhido.label }
          : {}),
      },
      locale: "pt",
      success_url: `${siteUrl}/compra/obrigada`,
      cancel_url: `${siteUrl}/produtos/${handle}`,
    });

    if (!session.url) {
      console.error("[checkout] sessão criada sem url", session.id);
      return Response.json({ error: "Não foi possível abrir o pagamento." }, { status: 502 });
    }

    return Response.json({ url: session.url });
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "erro desconhecido";
    console.error("[checkout] falha a criar a sessão:", mensagem);
    return Response.json({ error: "Não foi possível abrir o pagamento." }, { status: 502 });
  }
}
