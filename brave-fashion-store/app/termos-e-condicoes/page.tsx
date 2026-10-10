import LegalPageView from "@/components/legal/legal-page-view";

// Texto legal muda sem deploy: tem de ser lido a cada pedido.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Termos e Condições | Brave Fashion by Paula Valente",
  description: "Condições de venda da loja online da Brave Fashion.",
};

export default function Page() {
  return <LegalPageView slug="termos-e-condicoes" />;
}
