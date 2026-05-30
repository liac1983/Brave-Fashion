import BookingForm from "@/components/marcacoes/booking-form";
import { Calendar } from "lucide-react";

export const metadata = {
  title: "Marcações | Brave Fashion by Paula Valente",
  description: "Marque uma visita à Brave Fashion e receba ajuda personalizada para escolher o seu outfit.",
};

export default function MarcacoesPage() {
  return (
    <section className="bg-[#f7f2ec] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">

        <div className="grid gap-16 lg:grid-cols-[1fr_520px]">

          <div>
            <div className="mb-10">
              <h1 className="font-serif text-5xl leading-tight text-neutral-900 md:text-7xl">
                Marcar Visita
              </h1>
              <p className="mt-4 text-xl text-neutral-500 md:text-2xl">
                Venha à loja e receba ajuda personalizada para encontrar o outfit perfeito.
              </p>
            </div>

            <BookingForm />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">

              <div className="rounded-[6px] border border-[#e7d9cf] bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar size={22} className="text-[#B76E2B]" strokeWidth={1.8} />
                  <h2 className="font-serif text-2xl text-neutral-900">Como funciona</h2>
                </div>
                <ol className="space-y-5 text-[17px] text-neutral-600">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B76E2B] text-sm text-white font-medium">1</span>
                    <span>Preencha o formulário com os seus dados e preferências</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B76E2B] text-sm text-white font-medium">2</span>
                    <span>É redirecionada para o WhatsApp com a mensagem já preparada</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B76E2B] text-sm text-white font-medium">3</span>
                    <span>A Paula confirma a data e hora e conversa consigo sobre o que precisa</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B76E2B] text-sm text-white font-medium">4</span>
                    <span>Venha à loja e encontre o outfit perfeito com ajuda personalizada</span>
                  </li>
                </ol>
              </div>

              <div className="rounded-[6px] border border-[#e7d9cf] bg-white p-8">
                <h2 className="font-serif text-2xl text-neutral-900 mb-4">Localização</h2>
                <address className="not-italic space-y-1 text-[17px] text-neutral-600">
                  <p>Rua D. João IV nº23 R/CH</p>
                  <p>4590-578 Paços de Ferreira</p>
                </address>
                <div className="mt-5 border-t border-[#e7d9cf] pt-5">
                  <h3 className="font-medium text-neutral-800 mb-2">Horário</h3>
                  <p className="text-[17px] text-neutral-600">Segunda a Sexta: 10h00 – 18h00</p>
                  <p className="text-[17px] text-neutral-600">Sábado: 10h00 – 13h00</p>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}
