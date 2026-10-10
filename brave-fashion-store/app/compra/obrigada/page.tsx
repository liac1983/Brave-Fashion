import Link from "next/link";
import { CheckCircle2, Mail, Package } from "lucide-react";
import { SHIPPING, formatEur } from "@/lib/shop";

export const metadata = {
  title: "Compra concluída | Brave Fashion by Paula Valente",
  description: "Obrigada pela sua compra na Brave Fashion.",
  robots: { index: false },
};

const STEPS = [
  {
    icon: Mail,
    title: "Vai receber um email",
    body: "A confirmação da compra e a fatura chegam ao email que indicou no pagamento.",
  },
  {
    icon: Package,
    title: "A Paula prepara a sua peça",
    body: `A encomenda segue por CTT. Se escolheu levantamento na loja, avisamos assim que estiver pronta.`,
  },
  {
    icon: CheckCircle2,
    title: "Mudou de ideias?",
    body: "Tem 14 dias a contar da receção para devolver, sem precisar de justificar.",
  },
];

export default function CompraObrigadaPage() {
  return (
    <section className="bg-[#f7f2ec] py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B76E2B]">
          <CheckCircle2 size={34} className="text-white" strokeWidth={1.8} />
        </div>

        <h1 className="mt-8 font-serif text-4xl leading-tight text-neutral-900 md:text-6xl">
          Obrigada pela sua compra
        </h1>

        <p className="mt-4 max-w-xl text-xl text-neutral-500">
          O pagamento foi concluído com sucesso. A partir daqui tratamos nós de tudo.
        </p>

        <ol className="mt-12 space-y-6">
          {STEPS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4 rounded-[6px] border border-[#e7d9cf] bg-white p-6">
              <Icon size={22} className="mt-1 shrink-0 text-[#B76E2B]" strokeWidth={1.8} />
              <div>
                <h2 className="font-medium text-neutral-800">{title}</h2>
                <p className="mt-1 text-[17px] leading-7 text-neutral-600">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-[17px] leading-8 text-neutral-600">
          Alguma dúvida? Fale connosco pelo{" "}
          <a
            href="https://wa.me/351918699920"
            target="_blank"
            rel="noreferrer"
            className="text-[#B76E2B] underline underline-offset-2"
          >
            WhatsApp
          </a>{" "}
          ou passe pela loja, na Rua D. João IV n.º 23, em Paços de Ferreira.
          {SHIPPING.pickupAvailable
            ? ` O levantamento na loja é gratuito e os portes são grátis acima de ${formatEur(SHIPPING.freeFrom)}.`
            : null}
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/produtos"
            className="flex items-center justify-center rounded-[6px] bg-[#B76E2B] px-8 py-4 text-[18px] font-medium text-white transition hover:bg-[#9d5e24]"
          >
            Continuar a ver peças
          </Link>
          <Link
            href="/devolucoes"
            className="flex items-center justify-center rounded-[6px] border border-[#B76E2B] bg-white px-8 py-4 text-[18px] font-medium text-[#B76E2B] transition hover:bg-[#f3e7dc]"
          >
            Condições de devolução
          </Link>
        </div>
      </div>
    </section>
  );
}
