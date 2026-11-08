import Stripe from "stripe";
import { getStripeSecretKey } from "@/lib/stripe";
import { descerStock } from "@/lib/stock";
import { extrairNif as extractNif, formatarMorada as formatAddress } from "@/lib/vendas";

/**
 * Recebe os pagamentos do Stripe e avisa a loja por email.
 *
 * A encomenda em si vive no Stripe — é lá que ficam a morada, o NIF e o
 * comprovativo. Este email existe só para a Paula não ter de ir ao painel:
 * traz os dados pela ordem em que se escrevem na fatura do Sage.
 */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function eur(cents: number | null | undefined) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format((cents ?? 0) / 100);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const chave = getStripeSecretKey();

  if ("erro" in chave) {
    console.error("[stripe]", chave.erro);
    return new Response("Stripe não configurado.", { status: 500 });
  }

  if (!webhookSecret) {
    console.error("[stripe] STRIPE_WEBHOOK_SECRET em falta");
    return new Response("Stripe não configurado.", { status: 500 });
  }

  const stripe = new Stripe(chave.key);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Assinatura em falta.", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // O corpo tem de ser lido em bruto: qualquer reformatação invalida a assinatura.
    const body = await request.text();
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    console.error("[stripe] assinatura inválida:", message);
    return new Response(`Webhook error: ${message}`, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("Ignorado.", { status: 200 });
  }

  const session = event.data.object;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bravefashionbypaulavalente.com";

  // Pagamentos diferidos (Multibanco) só contam quando o dinheiro entra.
  if (session.payment_status !== "paid") {
    return new Response("Pagamento ainda não concluído.", { status: 200 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const to = process.env.BOOKING_EMAIL_TO;
  const from = process.env.BOOKING_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.error("[stripe] envio de email não configurado");
    return new Response("Email não configurado.", { status: 500 });
  }

  // O stock desce antes do email, porque é pior vender duas vezes a mesma peça
  // do que ficar sem aviso de uma venda. O que aconteceu ao stock vai depois no
  // email, para a Paula não ter de ir confirmar ao Studio.
  const meta = session.metadata ?? {};
  const productId = meta.productId;
  const quantidade = Number.parseInt(meta.quantidade ?? "1", 10) || 1;
  const varianteComprada = meta.variante ?? "";

  let notaDoStock = "";

  if (productId) {
    const resultado = await descerStock({
      productId,
      varianteKey: meta.varianteKey || undefined,
      cor: meta.cor || undefined,
      tamanho: meta.tamanho || undefined,
      quantidade,
      referencia: session.id,
    });

    notaDoStock =
      resultado.estado === "repetido"
        ? "aviso repetido pelo Stripe — o stock já tinha sido descontado, nada mudou agora"
        : resultado.estado === "falhou"
          ? `ATENÇÃO: ${resultado.resumo}`
          : resultado.resumo;

    console.info("[stripe] stock:", resultado.estado, notaDoStock);
  }

  let artigos: string[] = [];

  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 50,
    });
    artigos = lineItems.data.map(
      (item) =>
        `${item.quantity ?? 1} × ${item.description ?? "(sem descrição)"} — ${eur(item.amount_total)}`
    );
  } catch (error) {
    // Sem os artigos o email continua a valer a pena: o total e o cliente chegam.
    console.error("[stripe] não foi possível listar os artigos:", error);
    artigos = ["(não foi possível obter os artigos — ver o painel do Stripe)"];
  }

  const details = session.customer_details;

  const campos: [string, string][] = [
    ["Cliente", details?.name ?? ""],
    ["NIF", String(extractNif(session))],
    ["Email", details?.email ?? ""],
    ["Telefone", details?.phone ?? ""],
    ["Morada", formatAddress(session.collected_information?.shipping_details?.address ?? details?.address)],
    ["Artigos", artigos.join("\n")],
    ["Cor / tamanho", varianteComprada],
    ["Quantidade", quantidade > 1 ? String(quantidade) : ""],
    ["Portes", eur(session.total_details?.amount_shipping)],
    ["Total pago", eur(session.amount_total)],
    ["Referência Stripe", session.id],
    ["Peça no site", notaDoStock],
  ];

  const preenchidos = campos.filter(([, valor]) => valor);

  const textContent = [
    "Nova venda no site.",
    "",
    ...preenchidos.map(([rotulo, valor]) => `${rotulo}: ${valor}`),
    "",
    "Passar a fatura no Sage 50c com estes dados.",
    `Lista de todas as vendas: ${siteUrl}/vendas`,
  ].join("\n");

  const htmlContent = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#1f1f1f;line-height:1.6">
      <h2 style="font-size:20px;color:#B76E2B;margin:0 0 16px">Nova venda no site</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        ${preenchidos
          .map(
            ([rotulo, valor]) => `
          <tr>
            <td style="padding:6px 16px 6px 0;vertical-align:top;color:#6b6b6b;white-space:nowrap">${escapeHtml(rotulo)}</td>
            <td style="padding:6px 0;vertical-align:top">${escapeHtml(valor).replace(/\n/g, "<br>")}</td>
          </tr>`
          )
          .join("")}
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:#8a8a8a">
        Passar a fatura no Sage 50c com estes dados. O comprovativo do pagamento está no painel do Stripe.
        Todas as vendas, e quais já têm fatura, estão em <a href="${siteUrl}/vendas" style="color:#B76E2B">${siteUrl.replace(/^https?:\/\//, "")}/vendas</a>.
      </p>
    </div>
  `;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "Brave Fashion – Vendas", email: from },
      to: [{ email: to }],
      replyTo: details?.email
        ? { email: details.email, name: details.name ?? undefined }
        : undefined,
      subject: `Venda — ${details?.name ?? "cliente"} — ${eur(session.amount_total)}`,
      htmlContent,
      textContent,
    }),
  });

  if (!response.ok) {
    // Devolver erro faz o Stripe tentar de novo. Um email repetido é bem menos
    // mau do que uma venda que ninguém viu.
    console.error("[stripe] falha ao enviar o email da venda:", await response.text());
    return new Response("Falha ao notificar a loja.", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
