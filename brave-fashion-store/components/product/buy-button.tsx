"use client";

import { useState } from "react";
import { Loader2, Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import {
  coresDisponiveis,
  maximoPorCompra,
  shippingSummary,
  tamanhosDisponiveis,
  variantesComStock,
  type Variante,
} from "@/lib/shop";

type BuyButtonProps = {
  /** Slug da peça. O preço é lido no servidor, nunca enviado daqui. */
  handle: string;
  /**
   * Cores e tamanhos da peça. Vazio quando a peça é única — e aí não há nada
   * a escolher, o botão compra a peça e pronto.
   */
  variantes?: Variante[];
};

/** Com uma só opção não há escolha a fazer: deixa-se escolhida. */
function unica(opcoes: string[]) {
  return opcoes.length === 1 ? opcoes[0] : "";
}

function Opcoes({
  titulo,
  opcoes,
  escolhida,
  onEscolher,
}: {
  titulo: string;
  opcoes: string[];
  escolhida: string;
  onEscolher: (valor: string) => void;
}) {
  return (
    <fieldset className="mb-6">
      <legend className="text-[15px] font-medium text-neutral-900">
        {titulo}
        {escolhida && <span className="font-normal text-neutral-500">: {escolhida}</span>}
      </legend>

      <div className="mt-3 flex flex-wrap gap-2.5">
        {opcoes.map((opcao) => {
          const selecionada = opcao === escolhida;

          return (
            <button
              key={opcao}
              type="button"
              aria-pressed={selecionada}
              onClick={() => onEscolher(opcao)}
              className={`min-w-[52px] rounded-[6px] border px-4 py-3 text-[16px] transition ${
                selecionada
                  ? "border-[#B76E2B] bg-[#B76E2B] text-white"
                  : "border-[#e7d9cf] bg-white text-neutral-800 hover:border-[#B76E2B]"
              }`}
            >
              {opcao}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function BuyButton({ handle, variantes = [] }: BuyButtonProps) {
  const disponiveis = variantesComStock(variantes);
  const temOpcoes = disponiveis.length > 0;

  const cores = coresDisponiveis(variantes);
  const [cor, setCor] = useState(unica(cores));

  // Os tamanhos dependem da cor: o M pode existir em azul e não em preto.
  const tamanhos = tamanhosDisponiveis(variantes, cores.length > 0 ? cor : null);
  const [tamanho, setTamanho] = useState(unica(tamanhosDisponiveis(variantes, unica(cores) || null)));

  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const precisaDeCor = cores.length > 0;
  const precisaDeTamanho = tamanhosDisponiveis(variantes).length > 0;

  const escolhida = temOpcoes
    ? (disponiveis.find(
        (variante) =>
          (!precisaDeCor || variante.cor === cor) &&
          (!precisaDeTamanho || variante.tamanho === tamanho)
      ) ?? null)
    : null;

  // Peça única: só há uma. Com variante escolhida: até ao stock dela.
  const maximo = !temOpcoes ? 1 : escolhida ? maximoPorCompra(escolhida.stock) : 1;
  const quantidadeValida = Math.min(quantidade, maximo);

  function escolherCor(novaCor: string) {
    setCor(novaCor);
    setErro("");
    // Se o tamanho escolhido não existir na nova cor, larga-se — ou, se só
    // houver um tamanho nessa cor, escolhe-se esse.
    const tamanhosDaCor = tamanhosDisponiveis(variantes, novaCor);
    if (!tamanhosDaCor.includes(tamanho)) setTamanho(unica(tamanhosDaCor));
  }

  async function comprar() {
    if (temOpcoes && !escolhida) {
      setErro(
        precisaDeCor && !cor
          ? "Escolha a cor para continuar."
          : "Escolha o tamanho para continuar."
      );
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
          quantidade: quantidadeValida,
          ...(escolhida ? { variante: escolhida.key } : {}),
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
      {precisaDeCor && (
        <Opcoes titulo="Cor" opcoes={cores} escolhida={cor} onEscolher={escolherCor} />
      )}

      {precisaDeTamanho && (!precisaDeCor || cor) && (
        <Opcoes
          titulo="Tamanho"
          opcoes={tamanhos}
          escolhida={tamanho}
          onEscolher={(novo) => {
            setTamanho(novo);
            setErro("");
          }}
        />
      )}

      {temOpcoes && (
        <div className="mb-6">
          <p className="text-[15px] font-medium text-neutral-900">Quantidade</p>

          <div className="mt-3 flex items-center gap-4">
            <div className="inline-flex items-center rounded-[6px] border border-[#e7d9cf] bg-white">
              <button
                type="button"
                aria-label="Menos uma unidade"
                disabled={quantidadeValida <= 1}
                onClick={() => setQuantidade(Math.max(1, quantidadeValida - 1))}
                className="flex h-12 w-12 items-center justify-center text-neutral-800 transition hover:text-[#B76E2B] disabled:opacity-30"
              >
                <Minus size={18} />
              </button>
              <span aria-live="polite" className="w-10 text-center text-[17px] tabular-nums">
                {quantidadeValida}
              </span>
              <button
                type="button"
                aria-label="Mais uma unidade"
                disabled={!escolhida || quantidadeValida >= maximo}
                onClick={() => setQuantidade(Math.min(maximo, quantidadeValida + 1))}
                className="flex h-12 w-12 items-center justify-center text-neutral-800 transition hover:text-[#B76E2B] disabled:opacity-30"
              >
                <Plus size={18} />
              </button>
            </div>

            {escolhida && escolhida.stock <= 3 && (
              <p className="text-sm text-[#B76E2B]">
                {escolhida.stock === 1
                  ? "Última unidade."
                  : `Só restam ${escolhida.stock} unidades.`}
              </p>
            )}
          </div>
        </div>
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
