import { createHash } from "node:crypto";
import { groq } from "next-sanity";
import { writeClient } from "@/sanity/lib/writeClient";
import { descreverVariante, stockTotal, temVariantes } from "@/lib/shop";
import { mapVariantes } from "@/lib/sanity";

/**
 * O que acontece ao stock quando um pagamento entra.
 *
 * Há dois tipos de peça na loja e eles comportam-se de maneira diferente:
 *
 * - **Peça única** (sem cores nem tamanhos preenchidos): assim que é paga sai do site.
 *   Marcar uma peça como vendida é uma operação que se pode repetir sem mal
 *   nenhum, por isso este caminho não precisa de proteção especial.
 *
 * - **Peça com variantes** (cor, tamanho ou só quantidade): desce as unidades
 *   compradas da variante escolhida, e só sai do site quando a última
 *   variante esgota. Descer stock *não* se pode repetir —
 *   daí a marca de venda, explicada em `vendaProcessada`.
 */

const PRODUTO_QUERY = groq`
  *[_type == "product" && _id == $id][0] {
    _id,
    title,
    "variantes": variantes[] {
      "key": _key,
      cor,
      tamanho,
      stock
    }
  }
`;

/** Ver o comentário nas leituras: a perspetiva não fica ao critério da API. */
const PUBLICADO = { perspective: "published" } as const;

type ProdutoStock = {
  _id: string;
  title: string | null;
  variantes: unknown;
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
  /** Chave da linha da variante, como veio nos metadados do pagamento. */
  varianteKey?: string;
  /** Cor e tamanho, para o caso de a chave já não existir. */
  cor?: string;
  tamanho?: string;
  /** Unidades compradas. */
  quantidade: number;
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
  return `variantes[_key=="${key}"].stock`;
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

  const variantes = mapVariantes(produto.variantes);
  const quantidade = Math.max(1, Math.floor(pedido.quantidade || 1));
  const pedidoLabel = descreverVariante({ cor: pedido.cor || null, tamanho: pedido.tamanho || null });

  // Peça única: sai do site e acabou.
  if (!temVariantes(variantes)) {
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
      tamanho: [pedidoLabel, quantidade > 1 ? `× ${quantidade}` : ""].filter(Boolean).join(" "),
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
    variantes.find((variante) => variante.key === pedido.varianteKey) ??
    // A chave pode ter desaparecido se a linha foi apagada e reposta no
    // Studio entretanto. A cor e o tamanho são a segunda melhor pista.
    (pedidoLabel
      ? variantes.find((variante) => descreverVariante(variante) === pedidoLabel)
      : undefined) ??
    // Peça com uma só linha (só quantidade): não há outra onde descontar.
    (variantes.length === 1 ? variantes[0] : undefined);

  if (!linha) {
    console.error("[stock] variante não encontrada:", pedido.varianteKey, pedidoLabel);
    return {
      estado: "falhou",
      resumo: `${pedidoLabel || "a opção comprada"} já não existe na peça — descer ${unidades(quantidade)} à mão`,
    };
  }

  const nome = descreverVariante(linha) || "peça";

  try {
    await writeClient
      .patch(pedido.productId)
      .dec({ [caminhoDoStock(linha.key)]: quantidade })
      .commit();
  } catch (error) {
    console.error("[stock] não foi possível descer a quantidade:", error);
    return {
      estado: "falhou",
      resumo: `não foi possível descer ${unidades(quantidade)} de ${nome} — fazer isso no Studio`,
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

  const variantesDepois = mapVariantes(depois?.variantes);

  // Duas vendas em cima das últimas unidades podem levar a quantidade a negativo.
  // Isso não é stock — é uma peça a menos para entregar, e a Paula fica a saber
  // pelo email. No Studio fica a zero, que é o que ela consegue interpretar.
  const negativos = variantesDepois.filter((variante) => variante.stock < 0);

  if (negativos.length > 0) {
    try {
      const patch = writeClient.patch(pedido.productId);
      for (const variante of negativos) {
        patch.set({ [caminhoDoStock(variante.key)]: 0 });
      }
      await patch.commit();
      console.error("[stock] quantidade negativa corrigida para zero:", pedido.productId);
    } catch (error) {
      console.error("[stock] não foi possível corrigir a quantidade negativa:", error);
    }
  }

  const faltaram = negativos.find((variante) => variante.key === linha.key);
  const avisoFalta = faltaram
    ? ` ATENÇÃO: faltaram ${unidades(-faltaram.stock)} para esta venda`
    : "";

  const restantes = variantesDepois.find((variante) => variante.key === linha.key);
  const sobramUnidades = stockTotal(variantesDepois);
  const vendidas = quantidade > 1 ? `${quantidade} × ${nome}` : nome;

  if (sobramUnidades <= 0) {
    try {
      await fecharPeca(pedido.productId);
      return {
        estado: "feito",
        resumo: `${vendidas} vendido — era o que restava, a peça saiu do site.${avisoFalta}`,
      };
    } catch (error) {
      console.error("[stock] não foi possível retirar a peça do site:", error);
      return {
        estado: "falhou",
        resumo: `${vendidas} vendido e esgotado, mas a peça continua no site — desligar «À venda online» no Studio`,
      };
    }
  }

  const sobramNestaVariante = Math.max(0, restantes?.stock ?? 0);

  return {
    estado: "feito",
    resumo:
      (sobramNestaVariante > 0
        ? `${vendidas} — ${restam(sobramNestaVariante)} desta opção, ${unidades(sobramUnidades)} na peça no total`
        : `${vendidas} — esta opção esgotou, ${restam(sobramUnidades)} noutras opções`) + avisoFalta,
  };
}
