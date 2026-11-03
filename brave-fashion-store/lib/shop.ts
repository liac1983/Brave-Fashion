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
 * Um tamanho de uma peça e quantas unidades existem dele.
 *
 * `key` é a chave que o Sanity dá a cada linha do campo "Tamanhos e
 * quantidades". É por ela que o site identifica o tamanho de uma ponta à
 * outra — do botão de comprar até ao desconto do stock — porque o nome pode
 * ser corrigido no Studio a qualquer momento e a chave não muda.
 */
export type Tamanho = {
  key: string;
  label: string;
  stock: number;
};

/** Só os tamanhos que a cliente pode escolher. */
export function tamanhosComStock(tamanhos: Tamanho[] | undefined | null) {
  return (tamanhos ?? []).filter((tamanho) => tamanho.stock > 0);
}

/**
 * Uma peça "tem tamanhos" quando a Paula preencheu a lista no Studio.
 *
 * Lista vazia é o caso normal da loja: peça de unidade única, sem tamanho a
 * escolher. Toda a lógica de stock olha primeiro para isto.
 */
export function temTamanhos(tamanhos: Tamanho[] | undefined | null) {
  return (tamanhos ?? []).length > 0;
}

/** Unidades ainda por vender, somando todos os tamanhos. */
export function stockTotal(tamanhos: Tamanho[] | undefined | null) {
  return (tamanhos ?? []).reduce(
    (total, tamanho) => total + Math.max(0, tamanho.stock),
    0
  );
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
