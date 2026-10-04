/**
 * Regras comerciais da venda online.
 *
 * Estes valores são apenas o que o site MOSTRA à cliente. O que ela paga de
 * facto é definido no Payment Link do Stripe — manter os dois em sintonia é
 * manual enquanto a fase 1 durar.
 */

export const SHIPPING = {
  /** Portes para Portugal Continental, em euros. */
  cost: 4.5,
  /** Acima deste valor de encomenda, os portes são grátis. */
  freeFrom: 100,
  /** Levantamento na loja, em Paços de Ferreira. */
  pickupAvailable: true,
} as const;

export function formatEur(amount: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/** Linha resumida dos portes, para mostrar junto ao botão de compra. */
export function shippingSummary() {
  const parts = [
    `Portes ${formatEur(SHIPPING.cost)}`,
    `grátis acima de ${formatEur(SHIPPING.freeFrom)}`,
  ];

  if (SHIPPING.pickupAvailable) {
    parts.push("levantamento na loja grátis");
  }

  return parts.join(" · ");
}
