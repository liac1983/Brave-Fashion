"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, ShoppingBag } from "lucide-react";
import { shippingSummary } from "@/lib/shop";

type BuyButtonProps = {
  /** Slug da peça. O preço é lido no servidor, nunca enviado daqui. */
  handle: string;
};

export default function BuyButton({ handle }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function comprar() {
    setLoading(true);
    setErro("");

    try {
      const resposta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok || !dados?.url) {
        setErro(dados?.error || "Não foi possível abrir o pagamento. Tente novamente.");
        setLoading(false);
        return;
      }

      // Não desligamos o loading: a página vai mudar para o Stripe.
      window.location.href = dados.url;
    } catch {
      setErro("Não foi possível abrir o pagamento. Verifique a ligação à internet.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={comprar}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-[6px] bg-[#B76E2B] px-6 py-5 text-lg font-medium text-white transition hover:bg-[#9d5e24] disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? (
          <Loader2 size={22} className="animate-spin" />
        ) : (
          <ShoppingBag size={22} />
        )}
        <span className="font-serif">{loading ? "A abrir pagamento..." : "Comprar"}</span>
      </button>

      {erro ? (
        <p className="mt-3 text-[16px] text-red-600">{erro}</p>
      ) : (
        <p className="mt-3 text-sm text-neutral-500">{shippingSummary()}</p>
      )}

      <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
        <ShieldCheck size={16} className="shrink-0 text-[#B76E2B]" strokeWidth={1.8} />
        Pagamento seguro por cartão ou MB WAY
      </p>
    </div>
  );
}
