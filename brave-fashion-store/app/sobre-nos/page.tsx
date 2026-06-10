import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/fade-in";

export const metadata = {
  title: "Sobre Nós | Brave Fashion by Paula Valente",
  description: "Conheça a história da Brave Fashion e a sua fundadora, Paula Valente.",
};

export default function SobreNosPage() {
  return (
    <div className="bg-[#f7f2ec]">

      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/ChatGPT Image 30_05_2026, 16_22_21.png"
          alt="Brave Fashion"
          fill
          priority
          className="object-cover object-[center_25%] scale-[1]"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">
              A nossa história
            </p>
            <h1 className="mt-4 font-serif text-5xl text-white md:text-7xl">
              Sobre Nós
            </h1>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          <FadeIn direction="left">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#e7d9cf]">
              <Image
                src="/686276458_1561885312610982_1043098090701336202_n.jpg"
                alt="Paula Valente"
                fill
                className="object-cover object-top"
              />
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B76E2B]">
                Paula Valente
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-neutral-900 md:text-5xl">
                Uma paixão pela moda que se tornou uma missão
              </h2>
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-neutral-500">
                <p>
                  A Brave Fashion nasceu do desejo de criar um espaço onde cada mulher
                  se sente especial, ouvida e bem vestida — independentemente da ocasião.
                </p>
                <p>
                  Ao longo dos anos, a Paula construiu uma relação de confiança com as
                  suas clientes. Conhece o seu estilo, os seus gostos, as suas medidas
                  e os momentos importantes da sua vida. Quando chega uma peça nova que
                  sabe que vai resultar, não hesita em dar um toque.
                </p>
                <p>
                  Não é uma loja de fast fashion. É um espaço de moda com um toque
                  humano — onde o atendimento personalizado faz toda a diferença.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="mb-16 text-center">
              <h2 className="font-serif text-4xl text-neutral-900 md:text-5xl">
                O que nos define
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Atendimento Personalizado",
                desc: "Cada cliente é única. Dedicamos o tempo necessário para perceber o que procura e encontrar exactamente o que precisa.",
                delay: 0,
              },
              {
                title: "Qualidade e Estilo",
                desc: "Peças seleccionadas com atenção ao corte, ao caimento e à qualidade — moda elegante que dura mais do que uma temporada.",
                delay: 0.1,
              },
              {
                title: "Uma Relação de Confiança",
                desc: "Muitas das nossas clientes voltam há anos. Porque aqui não compram só roupa — encontram alguém que as acompanha.",
                delay: 0.2,
              },
            ].map((item) => (
              <FadeIn key={item.title} delay={item.delay}>
                <div className="border-t-2 border-[#B76E2B] pt-8">
                  <h3 className="font-serif text-2xl text-neutral-900">{item.title}</h3>
                  <p className="mt-4 text-[17px] leading-7 text-neutral-500">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <FadeIn>
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="font-serif text-4xl text-neutral-900 md:text-5xl">
              Venha conhecer-nos
            </h2>
            <p className="mx-auto mt-6 text-lg text-neutral-500">
              Marque uma visita e venha experimentar o atendimento personalizado
              da Brave Fashion. Temos a certeza de que vai adorar.
            </p>
            <Link
              href="/marcacoes"
              className="mt-10 inline-flex items-center gap-3 rounded-[6px] bg-[#B76E2B] px-8 py-4 font-serif text-lg text-white transition hover:bg-[#9d5e24]"
            >
              Marcar uma visita
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </FadeIn>

    </div>
  );
}
