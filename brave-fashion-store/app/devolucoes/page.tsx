import LegalPageView from "@/components/legal/legal-page-view";

// Texto legal muda sem deploy: tem de ser lido a cada pedido.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Devoluções e Trocas | Brave Fashion by Paula Valente",
  description: "Como devolver ou trocar uma peça comprada em bravefashionbypaulavalente.com.",
};

export default function Page() {
  return <LegalPageView slug="devolucoes" />;
}
