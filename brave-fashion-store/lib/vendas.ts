import Stripe from "stripe";
import { connection } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getStripeSecretKey } from "@/lib/stripe";

/**
 * As vendas do site, lidas do Stripe, para a Paula passar as faturas no Sage.
 *
 * Porque não se guardam no Sanity: o conjunto de dados do Sanity é de leitura
 * pública, e uma venda traz nome, NIF, morada e telefone da cliente. O Stripe
 * já guarda tudo isso, em privado, e é a fonte de verdade do pagamento — por
 * isso a página lê de lá, e a marca "fatura passada" também fica lá, nos
 * metadados do próprio pagamento.
 */

export type Venda = {
  id: string;
  /** Momento do pagamento, em ISO. */
  quando: string;
  cliente: string;
  nif: string;
  email: string;
  telefone: string;
  morada: string;
  artigos: { descricao: string; quantidade: number; total: number }[];
  portes: number;
  total: number;
  /** Data (AAAA-MM-DD) em que a Paula marcou a fatura como passada. */
  faturaPassada: string | null;
};

/** O NIF chega num campo personalizado do checkout. */
export function extrairNif(session: Stripe.Checkout.Session) {
  const field = (session.custom_fields ?? []).find((f) =>
    /nif|contribuinte|fiscal/i.test(`${f.key} ${f.label?.custom ?? ""}`)
  );
  return field?.text?.value || field?.numeric?.value || "";
}

export function formatarMorada(address: Stripe.Address | null | undefined) {
  if (!address) return "";
  return [
    address.line1,
    address.line2,
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.country,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Só quem está na lista ADMIN_EMAILS (separada por vírgulas, nas variáveis
 * de ambiente) vê as vendas. Conta apenas um email confirmado no Clerk: um
 * email por confirmar qualquer pessoa o pode escrever.
 */
export async function eAdmin() {
  // Decide-se a cada pedido, nunca no build: uma página pré-gerada com a
  // resposta de quem fez o build seria igual para toda a gente.
  await connection();

  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (admins.length === 0) return { estado: "sem-lista" as const };

  const user = await currentUser();
  if (!user) return { estado: "anonimo" as const };

  const confirmados = user.emailAddresses
    .filter((email) => email.verification?.status === "verified")
    .map((email) => email.emailAddress.toLowerCase());

  return confirmados.some((email) => admins.includes(email))
    ? { estado: "admin" as const }
    : { estado: "recusado" as const };
}

function stripe() {
  const chave = getStripeSecretKey();
  if ("erro" in chave) throw new Error(chave.erro);
  return new Stripe(chave.key);
}

/** "2026-11" válido, ou o mês corrente em Lisboa. */
export function normalizarMes(mes: string | undefined | null) {
  if (mes && /^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) return mes;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
}

export function mesVizinho(mes: string, delta: number) {
  const [ano, m] = mes.split("-").map(Number);
  const data = new Date(Date.UTC(ano, m - 1 + delta, 1));
  return `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, "0")}`;
}

/**
 * Meia-noite do dia 1 do mês, em Lisboa, em segundos Unix.
 *
 * Lisboa está em UTC no inverno e em UTC+1 no verão: uma venda às 00:30 de
 * 1 de julho tem de contar em julho, não em junho.
 */
function inicioDoMes(mes: string) {
  const [ano, m] = mes.split("-").map(Number);
  const utc = Date.UTC(ano, m - 1, 1);
  const horaEmLisboa = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date(utc))
  );
  return Math.floor((utc - horaEmLisboa * 3600 * 1000) / 1000);
}

function emEuros(centimos: number | null | undefined) {
  return (centimos ?? 0) / 100;
}

function paraVenda(session: Stripe.Checkout.Session): Venda {
  const details = session.customer_details;
  const linhas = session.line_items?.data ?? [];

  return {
    id: session.id,
    quando: new Date(session.created * 1000).toISOString(),
    cliente: details?.name ?? "",
    nif: String(extrairNif(session)),
    email: details?.email ?? "",
    telefone: details?.phone ?? "",
    morada: formatarMorada(
      session.collected_information?.shipping_details?.address ?? details?.address
    ),
    artigos: linhas.map((item) => ({
      descricao: item.description ?? "(sem descrição)",
      quantidade: item.quantity ?? 1,
      total: emEuros(item.amount_total),
    })),
    portes: emEuros(session.total_details?.amount_shipping),
    total: emEuros(session.amount_total),
    faturaPassada: session.metadata?.faturaPassada || null,
  };
}

/** Vendas pagas num mês, da mais recente para a mais antiga. */
export async function listarVendas(mes: string): Promise<Venda[]> {
  const sessoes = await stripe()
    .checkout.sessions.list({
      status: "complete",
      created: { gte: inicioDoMes(mes), lt: inicioDoMes(mesVizinho(mes, 1)) },
      limit: 100,
      expand: ["data.line_items"],
    })
    .autoPagingToArray({ limit: 1000 });

  // "complete" inclui Multibanco ainda por pagar: esses não se faturam.
  return sessoes.filter((session) => session.payment_status === "paid").map(paraVenda);
}

/** Marca (ou desmarca) a fatura de uma venda como passada. */
export async function marcarFatura(id: string, passada: boolean) {
  const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon" }).format(new Date());
  // Os metadados do Stripe juntam-se chave a chave: isto não apaga o resto.
  await stripe().checkout.sessions.update(id, {
    metadata: { faturaPassada: passada ? hoje : "" },
  });
}

/** Folha para abrir no Excel português: ponto e vírgula e BOM em UTF-8. */
export function vendasEmCsv(vendas: Venda[]) {
  const celula = (valor: string | number) => {
    const texto =
      typeof valor === "number" ? valor.toFixed(2).replace(".", ",") : valor.replace(/\n/g, ", ");
    return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
  };

  const cabecalho = [
    "Data",
    "Cliente",
    "NIF",
    "Email",
    "Telefone",
    "Morada",
    "Artigos",
    "Portes (€)",
    "Total pago (€)",
    "Referência Stripe",
    "Fatura passada",
  ];

  const linhas = vendas.map((venda) => [
    new Intl.DateTimeFormat("pt-PT", {
      timeZone: "Europe/Lisbon",
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(venda.quando)),
    venda.cliente,
    venda.nif,
    venda.email,
    venda.telefone,
    venda.morada,
    venda.artigos.map((artigo) => `${artigo.quantidade} × ${artigo.descricao}`).join(" | "),
    venda.portes,
    venda.total,
    venda.id,
    venda.faturaPassada ?? "",
  ]);

  return "﻿" + [cabecalho, ...linhas].map((linha) => linha.map(celula).join(";")).join("\r\n");
}
