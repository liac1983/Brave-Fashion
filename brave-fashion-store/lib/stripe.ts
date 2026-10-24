/**
 * Acesso à chave do Stripe, com uma salvaguarda.
 *
 * Uma chave de teste em produção é a falha mais perigosa deste sistema porque
 * não parece uma falha: o site funciona, a cliente percorre o checkout até ao
 * fim e vê a página de agradecimento — mas nenhum dinheiro é cobrado e o
 * webhook de produção nunca dispara. Ninguém dá por nada durante dias.
 *
 * Por isso recusamos arrancar em vez de aceitar. Falhar alto é melhor do que
 * aceitar encomendas que não existem.
 */

type Resultado = { key: string } | { erro: string };

/** Em produção na Vercel, VERCEL_ENV é "production"; em preview e dev, não. */
function emProducao() {
  return process.env.VERCEL_ENV === "production";
}

function eChaveDeTeste(key: string) {
  return key.startsWith("sk_test_") || key.startsWith("rk_test_");
}

export function getStripeSecretKey(): Resultado {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    return { erro: "STRIPE_SECRET_KEY em falta." };
  }

  if (emProducao() && eChaveDeTeste(key)) {
    return {
      erro:
        "Chave de TESTE configurada em produção. As clientes concluiriam a compra " +
        "sem pagar. Substituir por uma chave sk_live_ ou rk_live_ nas variáveis de ambiente.",
    };
  }

  return { key };
}
