/**
 * Regras comerciais da venda online.
 *
 * Os portes mostrados aqui são os mesmos que o checkout cobra: o
 * `app/api/checkout/route.ts` constrói as opções de envio a partir destes
 * valores, por isso mudar um número neste ficheiro muda o que a cliente vê na
 * página da peça e o que paga no Stripe.
 */

export const SHIPPING = {
  /** Portes para Portugal Continental, em euros. */
  cost: 4.5,
  /** Açores e Madeira. Os CTT cobram 5,69–6,97 € mais taxa de energia. */
  islands: 9.9,
  /** Restantes países da União Europeia. */
  europe: 19.9,
  /**
   * Acima deste valor os portes são grátis — mas **só no continente**.
   * Oferecer portes para as ilhas comeria a margem da peça.
   */
  freeFrom: 100,
  /** Levantamento na loja, em Paços de Ferreira. */
  pickupAvailable: true,
} as const;

/**
 * Uma combinação de cor e tamanho de uma peça, e quantas unidades há dela.
 *
 * Cada linha do campo "Cores, tamanhos e quantidades" no Studio é uma
 * variante: "Azul · M · 3 unidades". A cor e o tamanho são ambos opcionais —
 * uma écharpe pode ter só cores, umas calças só tamanhos, e uma peça com
 * várias unidades iguais só a quantidade.
 *
 * `key` é a chave que o Sanity dá à linha. É por ela que o site identifica a
 * variante de uma ponta à outra — do botão de comprar até ao desconto do
 * stock — porque a cor e o tamanho podem ser corrigidos no Studio a qualquer
 * momento e a chave não muda.
 */
export type Variante = {
  key: string;
  cor: string | null;
  tamanho: string | null;
  stock: number;
};

/** Nunca se vendem mais do que estas unidades numa só compra. */
export const MAX_POR_COMPRA = 10;

/** "Azul · M", "Azul", "M" — ou vazio, numa linha que só tem quantidade. */
export function descreverVariante(variante: Pick<Variante, "cor" | "tamanho"> | null | undefined) {
  if (!variante) return "";
  return [variante.cor, variante.tamanho].filter(Boolean).join(" · ");
}

/** Só as variantes que a cliente pode escolher. */
export function variantesComStock(variantes: Variante[] | undefined | null) {
  return (variantes ?? []).filter((variante) => variante.stock > 0);
}

/**
 * Uma peça "tem variantes" quando a Paula preencheu a lista no Studio.
 *
 * Lista vazia é o caso normal da loja: peça de unidade única, sem nada a
 * escolher. Toda a lógica de stock olha primeiro para isto.
 */
export function temVariantes(variantes: Variante[] | undefined | null) {
  return (variantes ?? []).length > 0;
}

/** Unidades ainda por vender, somando todas as variantes. */
export function stockTotal(variantes: Variante[] | undefined | null) {
  return (variantes ?? []).reduce(
    (total, variante) => total + Math.max(0, variante.stock),
    0
  );
}

/** Valores distintos de um campo, pela ordem em que aparecem no Studio. */
function distintos(variantes: Variante[], campo: "cor" | "tamanho") {
  const vistos: string[] = [];
  for (const variante of variantes) {
    const valor = variante[campo];
    if (valor && !vistos.includes(valor)) vistos.push(valor);
  }
  return vistos;
}

/** Cores com pelo menos uma unidade. */
export function coresDisponiveis(variantes: Variante[] | undefined | null) {
  return distintos(variantesComStock(variantes), "cor");
}

/** Tamanhos com pelo menos uma unidade (na cor indicada, se houver). */
export function tamanhosDisponiveis(
  variantes: Variante[] | undefined | null,
  cor?: string | null
) {
  const comStock = variantesComStock(variantes).filter(
    (variante) => !cor || variante.cor === cor
  );
  return distintos(comStock, "tamanho");
}

/** Quantas unidades a cliente pode pôr numa compra desta variante. */
export function maximoPorCompra(stock: number) {
  return Math.max(0, Math.min(stock, MAX_POR_COMPRA));
}

export function formatEur(amount: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/** Linha resumida dos portes, para mostrar junto ao botão de compra. */
export function shippingSummary() {
  const parts = [
    `Portes ${formatEur(SHIPPING.cost)} no continente`,
    `grátis acima de ${formatEur(SHIPPING.freeFrom)}`,
    `ilhas ${formatEur(SHIPPING.islands)}`,
  ];

  if (SHIPPING.pickupAvailable) {
    parts.push("levantamento na loja grátis");
  }

  return parts.join(" · ");
}
