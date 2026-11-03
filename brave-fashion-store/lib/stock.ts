import { createHash } from "node:crypto";
import { groq } from "next-sanity";
import { writeClient } from "@/sanity/lib/writeClient";
import { stockTotal, temTamanhos, type Tamanho } from "@/lib/shop";

/**
 * O que acontece ao stock quando um pagamento entra.
 *
 * Há dois tipos de peça na loja e eles comportam-se de maneira diferente:
 *
 * - **Peça única** (sem tamanhos preenchidos): assim que é paga sai do site.
 *   Marcar uma peça como vendida é uma operação que se pode repetir sem mal
 *   nenhum, por isso este caminho não precisa de proteção especial.
 *
 * - **Peça com tamanhos**: desce uma unidade do tamanho comprado, e só sai do
 *   site quando o último tamanho esgota. Descer stock *não* se pode repetir —
 *   daí a marca de venda, explicada em `vendaProcessada`.
 */

const PRODUTO_QUERY = groq`
  *[_type == "product" && _id == $id][0] {
    _id,
    title,
    "tamanhos": tamanhos[] {
      "key": _key,
      "label": tamanho,
      stock
    }
  }
`;

/** Ver o comentário nas leituras: a perspetiva não fica ao critério da API. */
const PUBLICADO = { perspective: "published" } as const;

type ProdutoStock = {
  _id: string;
  title: string | null;
  tamanhos: Tamanho[] | null;
};

export type ResultadoStock =
  /** Correu bem. `resumo` é a linha que vai no email para a Paula. */
  | { estado: "feito"; resumo: string }
  /** Este pagamento já tinha sido contabilizado — não se mexeu em nada. */
  | { estado: "repetido" }
  /** Não se conseguiu mexer no stock. `resumo` diz à Paula o que confirmar. */
  | { estado: "falhou"; resumo: string };

type Pedido = {
  productId: string;
  /** Chave da linha de tamanho, como veio nos metadados do pagamento. */
  tamanhoKey?: string;
  /** Nome do tamanho, para o caso de a chave já não existir. */
  tamanhoLabel?: string;
  /** Referência do pagamento. Só sai daqui em forma de impressão digital. */
  referencia: string;
};

/**
 * Identificador da marca de venda.
 *
 * A referência do Stripe não é segredo, mas também não tem de ficar num
 * conjunto de dados de leitura pública: o que precisamos é de saber se já
 * vimos este pagamento, e para isso uma impressão digital serve igual.
 */
function marcaDaVenda(referencia: string) {
  return `venda.${createHash("sha256").update(referencia).digest("hex").slice(0, 40)}`;
}

function eConflito(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as { statusCode?: number }).statusCode === 409
  );
}

/** Caminho de patch para o stock de uma linha, identificada pela chave. */
function caminhoDoStock(key: string) {
  return `tamanhos[_key=="${key}"].stock`;
}

function unidades(quantidade: number) {
  return `${quantidade} ${quantidade === 1 ? "unidade" : "unidades"}`;
}

/** "fica 1 unidade" / "ficam 3 unidades" — o verbo tem de concordar. */
function restam(quantidade: number) {
  return quantidade === 1 ? "fica 1 unidade" : `ficam ${quantidade} unidades`;
}

/** Retira a peça do site. Repetir isto não faz diferença nenhuma. */
async function fecharPeca(productId: string) {
  await writeClient.patch(productId).set({ available: false, venderOnline: false }).commit();
}

export async function descerStock(pedido: Pedido): Promise<ResultadoStock> {
  let produto: ProdutoStock | null;

  try {
    // Sempre a versão publicada: é a que o site vende e a que levamos o patch
    // a alterar. Um rascunho aberto no Studio não conta.
    produto = await writeClient.fetch(PRODUTO_QUERY, { id: pedido.productId }, PUBLICADO);
  } catch (error) {
    console.error("[stock] não foi possível ler a peça:", error);
    return { estado: "falhou", resumo: "não foi possível ler a peça — confirmar o stock no Studio" };
  }

  if (!produto) {
    console.error("[stock] peça não encontrada:", pedido.productId);
    return { estado: "falhou", resumo: "peça não encontrada no Studio — confirmar à mão" };
  }

  const tamanhos = produto.tamanhos ?? [];

  // Peça única: sai do site e acabou.
  if (!temTamanhos(tamanhos)) {
    try {
      await fecharPeca(pedido.productId);
      return { estado: "feito", resumo: "peça única — marcada como vendida e retirada do site" };
    } catch (error) {
      console.error("[stock] não foi possível marcar a peça como vendida:", error);
      return {
        estado: "falhou",
        resumo: "não foi possível retirar a peça do site — desligar «À venda online» no Studio",
      };
    }
  }

  // A partir daqui mexe-se em quantidades, e isso só pode acontecer uma vez
  // por pagamento. Quem conseguir criar a marca é o primeiro a chegar.
  try {
    await writeClient.create({
      _id: marcaDaVenda(pedido.referencia),
      _type: "vendaProcessada",
      quando: new Date().toISOString(),
      produto: produto.title ?? pedido.productId,
      tamanho: pedido.tamanhoLabel ?? "",
    });
  } catch (error) {
    if (eConflito(error)) {
      console.info("[stock] pagamento já contabilizado:", pedido.productId);
      return { estado: "repetido" };
    }

    // Não se sabe se já foi contabilizado. Continua-se: uma unidade descontada
    // a dobrar esconde uma peça que existe, mas uma unidade não descontada
    // vende uma peça que já não existe — e isso dá uma devolução e um pedido
    // de desculpa à cliente.
    console.error("[stock] não foi possível registar a marca da venda:", error);
  }

  const linha =
    tamanhos.find((tamanho) => tamanho.key === pedido.tamanhoKey) ??
    // A chave pode ter desaparecido se a linha foi apagada e reposta no
    // Studio entretanto. O nome do tamanho é a segunda melhor pista.
    tamanhos.find((tamanho) => tamanho.label === pedido.tamanhoLabel);

  if (!linha) {
    console.error("[stock] tamanho não encontrado:", pedido.tamanhoKey, pedido.tamanhoLabel);
    return {
      estado: "falhou",
      resumo: `tamanho ${pedido.tamanhoLabel ?? "?"} já não existe na peça — descer a quantidade à mão`,
    };
  }

  try {
    await writeClient
      .patch(pedido.productId)
      .dec({ [caminhoDoStock(linha.key)]: 1 })
      .commit();
  } catch (error) {
    console.error("[stock] não foi possível descer a quantidade:", error);
    return {
      estado: "falhou",
      resumo: `não foi possível descer o tamanho ${linha.label} — fazer isso no Studio`,
    };
  }

  // Lê-se de novo em vez de calcular: se duas clientes pagarem ao mesmo tempo,
  // só o estado que ficou gravado diz a verdade sobre o que resta.
  let depois: ProdutoStock | null = null;

  try {
    depois = await writeClient.fetch(PRODUTO_QUERY, { id: pedido.productId }, PUBLICADO);
  } catch (error) {
    console.error("[stock] não foi possível reler a peça:", error);
  }

  const tamanhosDepois = depois?.tamanhos ?? [];

  // Duas vendas em cima da última unidade podem levar a quantidade a negativo.
  // Isso não é stock — é uma peça a menos para entregar, e a Paula fica a saber
  // pelo email. No Studio fica a zero, que é o que ela consegue interpretar.
  const negativos = tamanhosDepois.filter((tamanho) => tamanho.stock < 0);

  if (negativos.length > 0) {
    try {
      const patch = writeClient.patch(pedido.productId);
      for (const tamanho of negativos) {
        patch.set({ [caminhoDoStock(tamanho.key)]: 0 });
      }
      await patch.commit();
      console.error("[stock] quantidade negativa corrigida para zero:", pedido.productId);
    } catch (error) {
      console.error("[stock] não foi possível corrigir a quantidade negativa:", error);
    }
  }

  const restantes = tamanhosDepois.find((tamanho) => tamanho.key === linha.key);
  const sobramUnidades = stockTotal(tamanhosDepois);

  if (sobramUnidades <= 0) {
    try {
      await fecharPeca(pedido.productId);
      return {
        estado: "feito",
        resumo: `tamanho ${linha.label} vendido — era o último, a peça saiu do site`,
      };
    } catch (error) {
      console.error("[stock] não foi possível retirar a peça do site:", error);
      return {
        estado: "falhou",
        resumo: `tamanho ${linha.label} vendido e esgotado, mas a peça continua no site — desligar «À venda online» no Studio`,
      };
    }
  }

  const sobramNesteTamanho = Math.max(0, restantes?.stock ?? 0);

  return {
    estado: "feito",
    resumo:
      sobramNesteTamanho > 0
        ? `tamanho ${linha.label} — ${restam(sobramNesteTamanho)} deste tamanho, ${unidades(sobramUnidades)} na peça no total`
        : `tamanho ${linha.label} esgotado — ${restam(sobramUnidades)} noutros tamanhos`,
  };
}
