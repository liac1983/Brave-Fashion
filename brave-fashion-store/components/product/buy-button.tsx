"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, ShoppingBag } from "lucide-react";
import { shippingSummary, tamanhosComStock, type Tamanho } from "@/lib/shop";

type BuyButtonProps = {
  /** Slug da peça. O preço é lido no servidor, nunca enviado daqui. */
  handle: string;
  /**
   * Tamanhos da peça. Vazio quando a peça é única — e aí não há nada a
   * escolher, o botão compra a peça e pronto.
   */
  tamanhos?: Tamanho[];
};

export default function BuyButton({ handle, tamanhos = [] }: BuyButtonProps) {
  const disponiveis = tamanhosComStock(tamanhos);
  const precisaDeTamanho = disponiveis.length > 0;

  // Com um tamanho só não há escolha a fazer: deixa-se escolhido.
  const [tamanhoKey, setTamanhoKey] = useState(
    disponiveis.length === 1 ? disponiveis[0].key : ""
  );
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const escolhido = disponiveis.find((tamanho) => tamanho.key === tamanhoKey) ?? null;

  async function comprar() {
    if (precisaDeTamanho && !escolhido) {
      setErro("Escolha o tamanho para continuar.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const resposta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle,
          ...(escolhido ? { tamanho: escolhido.key } : {}),
        }),
      });

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok || !dados?.url) {
        setErro(dados?.error || "Não foi possível abrir o pagamento. Tente novamente.");
        setLoading(false);
        return;
      }

      // Não desligamos o loading: a página vai mudar para o Stripe.
      window.location.assign(dados.url);
    } catch {
      setErro("Não foi possível abrir o pagamento. Verifique a ligação à internet.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      {precisaDeTamanho && (
        <fieldset className="mb-6">
          <legend className="text-[15px] font-medium text-neutral-900">Tamanho</legend>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {disponiveis.map((tamanho) => {
              const selecionado = tamanho.key === tamanhoKey;

              return (
                <button
                  key={tamanho.key}
                  type="button"
                  aria-pressed={selecionado}
                  onClick={() => {
                    setTamanhoKey(tamanho.key);
                    setErro("");
                  }}
                  className={`min-w-[52px] rounded-[6px] border px-4 py-3 text-[16px] transition ${
                    selecionado
                      ? "border-[#B76E2B] bg-[#B76E2B] text-white"
                      : "border-[#e7d9cf] bg-white text-neutral-800 hover:border-[#B76E2B]"
                  }`}
                >
                  {tamanho.label}
                </button>
              );
            })}
          </div>

          {escolhido?.stock === 1 && (
            <p className="mt-3 text-sm text-[#B76E2B]">Última unidade neste tamanho.</p>
          )}
        </fieldset>
      )}

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
