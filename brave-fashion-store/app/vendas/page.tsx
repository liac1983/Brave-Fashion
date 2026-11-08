import Link from "next/link";
import { notFound } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { formatEur } from "@/lib/shop";
import { eAdmin, listarVendas, mesVizinho, normalizarMes, type Venda } from "@/lib/vendas";
import { alternarFatura } from "./actions";

export const metadata = {
  title: "Vendas do site",
  robots: { index: false, follow: false },
};

type VendasPageProps = {
  searchParams?: Promise<{ mes?: string; mostrar?: string }>;
};

function nomeDoMes(mes: string) {
  const [ano, m] = mes.split("-").map(Number);
  const texto = new Intl.DateTimeFormat("pt-PT", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(ano, m - 1, 1)));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function dataHora(iso: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  if (!valor) return null;
  return (
    <div>
      <dt className="text-[13px] uppercase tracking-wide text-neutral-400">{rotulo}</dt>
      <dd className="mt-0.5 whitespace-pre-line text-[16px] text-neutral-800">{valor}</dd>
    </div>
  );
}

function CartaoVenda({ venda }: { venda: Venda }) {
  const passada = Boolean(venda.faturaPassada);

  return (
    <article
      className={`rounded-[6px] border bg-white p-6 ${
        passada ? "border-[#e7d9cf] opacity-75" : "border-[#B76E2B]/40"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">{dataHora(venda.quando)}</p>
          <h2 className="mt-1 font-serif text-2xl text-neutral-900">
            {venda.cliente || "Cliente sem nome"}
          </h2>
        </div>
        <p className="text-2xl font-semibold text-neutral-900">{formatEur(venda.total)}</p>
      </div>

      <ul className="mt-5 space-y-1 border-y border-[#efe4d8] py-4 text-[17px] text-neutral-800">
        {venda.artigos.length > 0 ? (
          venda.artigos.map((artigo, indice) => (
            <li key={indice} className="flex justify-between gap-4">
              <span>
                {artigo.quantidade} × {artigo.descricao}
              </span>
              <span className="shrink-0 text-neutral-500">{formatEur(artigo.total)}</span>
            </li>
          ))
        ) : (
          <li className="text-neutral-500">Artigos não disponíveis — ver no Stripe.</li>
        )}
        {venda.portes > 0 && (
          <li className="flex justify-between gap-4 text-neutral-500">
            <span>Portes</span>
            <span>{formatEur(venda.portes)}</span>
          </li>
        )}
      </ul>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <Campo rotulo="NIF" valor={venda.nif || "não indicado"} />
        <Campo rotulo="Telefone" valor={venda.telefone} />
        <Campo rotulo="Email" valor={venda.email} />
        <Campo rotulo="Morada" valor={venda.morada} />
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="break-all text-xs text-neutral-400">Ref. Stripe: {venda.id}</p>

        <form action={alternarFatura}>
          <input type="hidden" name="id" value={venda.id} />
          <input type="hidden" name="passada" value={passada ? "0" : "1"} />
          {passada ? (
            <button
              type="submit"
              className="rounded-[6px] border border-[#e7d9cf] px-5 py-3 text-[15px] text-neutral-600 transition hover:border-[#B76E2B] hover:text-[#B76E2B]"
            >
              ✓ Fatura passada a {venda.faturaPassada} · desfazer
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-[6px] bg-[#B76E2B] px-5 py-3 text-[15px] font-medium text-white transition hover:bg-[#9d5e24]"
            >
              Marcar fatura como passada
            </button>
          )}
        </form>
      </div>
    </article>
  );
}

/**
 * Lista das vendas do site, para a Paula passar as faturas no Sage.
 *
 * Os dados vêm do Stripe no momento (ver lib/vendas.ts); a página só existe
 * para quem está na lista ADMIN_EMAILS.
 */
export default async function VendasPage({ searchParams }: VendasPageProps) {
  const acesso = await eAdmin();

  if (acesso.estado === "anonimo") {
    return (
      <section className="bg-[#f7f2ec] py-24">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h1 className="font-serif text-4xl text-neutral-900">Vendas do site</h1>
          <p className="mt-4 text-lg text-neutral-600">Entre com a sua conta para ver as vendas.</p>
          <SignInButton mode="modal">
            <button className="mt-8 rounded-[6px] bg-[#B76E2B] px-8 py-4 text-lg text-white transition hover:bg-[#9d5e24]">
              Entrar
            </button>
          </SignInButton>
        </div>
      </section>
    );
  }

  // Para quem não é da loja, a página simplesmente não existe.
  if (acesso.estado !== "admin") notFound();

  const params = (await searchParams) ?? {};
  const mes = normalizarMes(params.mes);
  const soPorFaturar = params.mostrar === "por-faturar";

  let vendas: Venda[] = [];
  let erro = "";

  try {
    vendas = await listarVendas(mes);
  } catch (error) {
    console.error("[vendas] falha a ler o Stripe:", error);
    erro = "Não foi possível ler as vendas do Stripe. Tente daqui a pouco.";
  }

  const porFaturar = vendas.filter((venda) => !venda.faturaPassada);
  const mostradas = soPorFaturar ? porFaturar : vendas;
  const totalDoMes = vendas.reduce((soma, venda) => soma + venda.total, 0);
  const ligacao = (novo: { mes?: string; mostrar?: string }) => {
    const query = new URLSearchParams({ mes: novo.mes ?? mes });
    const mostrar = novo.mostrar ?? (soPorFaturar ? "por-faturar" : "");
    if (mostrar) query.set("mostrar", mostrar);
    return `/vendas?${query}`;
  };

  return (
    <section className="bg-[#f7f2ec] py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="font-serif text-5xl text-neutral-900 md:text-6xl">Vendas do site</h1>
        <p className="mt-3 text-lg text-neutral-500">
          Pagamentos recebidos pelo Stripe, com os dados para a fatura.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href={ligacao({ mes: mesVizinho(mes, -1) })}
              aria-label="Mês anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e7d9cf] bg-white hover:border-[#B76E2B]"
            >
              <ChevronLeft size={20} />
            </Link>
            <p className="min-w-[180px] text-center font-serif text-2xl text-neutral-900">
              {nomeDoMes(mes)}
            </p>
            <Link
              href={ligacao({ mes: mesVizinho(mes, 1) })}
              aria-label="Mês seguinte"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e7d9cf] bg-white hover:border-[#B76E2B]"
            >
              <ChevronRight size={20} />
            </Link>
          </div>

          <a
            href={`/vendas/csv?mes=${mes}`}
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#B76E2B] bg-white px-5 py-3 text-[15px] text-[#B76E2B] transition hover:bg-[#f3e7dc]"
          >
            <Download size={18} />
            Descarregar folha do mês
          </a>
        </div>

        {!erro && (
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-[#e7d9cf] py-5 text-[16px] text-neutral-700">
            <p>
              <strong className="text-neutral-900">{vendas.length}</strong>{" "}
              {vendas.length === 1 ? "venda" : "vendas"} · {formatEur(totalDoMes)}
            </p>
            <p>
              <strong className="text-[#B76E2B]">{porFaturar.length}</strong> por faturar
            </p>
            <div className="ml-auto flex gap-2 text-[15px]">
              <Link
                href={ligacao({ mostrar: "" })}
                className={`rounded-full px-4 py-2 ${!soPorFaturar ? "bg-[#B76E2B] text-white" : "bg-white text-neutral-700"}`}
              >
                Todas
              </Link>
              <Link
                href={ligacao({ mostrar: "por-faturar" })}
                className={`rounded-full px-4 py-2 ${soPorFaturar ? "bg-[#B76E2B] text-white" : "bg-white text-neutral-700"}`}
              >
                Só por faturar
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {erro ? (
            <p className="rounded-[6px] border border-red-200 bg-white p-6 text-red-700">{erro}</p>
          ) : mostradas.length > 0 ? (
            mostradas.map((venda) => <CartaoVenda key={venda.id} venda={venda} />)
          ) : (
            <p className="rounded-[6px] border border-[#e7d9cf] bg-white p-6 text-lg text-neutral-600">
              {soPorFaturar ? "Todas as faturas deste mês estão passadas." : "Não houve vendas neste mês."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
