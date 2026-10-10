import LegalPageView from "@/components/legal/legal-page-view";

// Texto legal muda sem deploy: tem de ser lido a cada pedido.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Política de Privacidade | Brave Fashion by Paula Valente",
  description: "Como a Brave Fashion trata os dados pessoais das suas clientes.",
};

export default function Page() {
  return <LegalPageView slug="privacidade" />;
}
