import { eAdmin, listarVendas, normalizarMes, vendasEmCsv } from "@/lib/vendas";

/** Descarrega as vendas do mês numa folha para o Excel ou para o Sage. */
export async function GET(request: Request) {
  const acesso = await eAdmin();
  if (acesso.estado !== "admin") {
    return new Response("Sem acesso.", { status: 403 });
  }

  const mes = normalizarMes(new URL(request.url).searchParams.get("mes"));

  try {
    const vendas = await listarVendas(mes);
    return new Response(vendasEmCsv(vendas), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="vendas-${mes}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[vendas] falha a gerar a folha:", error);
    return new Response("Não foi possível ler as vendas do Stripe.", { status: 502 });
  }
}
