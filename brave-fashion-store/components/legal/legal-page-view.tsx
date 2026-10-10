import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { AlertTriangle } from "lucide-react";
import { getLegalPage } from "@/lib/sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-[17px] leading-8 text-neutral-600 md:text-[18px]">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 font-serif text-3xl text-neutral-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-lg font-medium text-neutral-800">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-6 text-[17px] leading-8 text-neutral-600 md:text-[18px]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-6 text-[17px] leading-8 text-neutral-600 md:text-[18px]">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = String(value?.href ?? "");
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="text-[#B76E2B] underline underline-offset-2"
        >
          {children}
        </a>
      );
    },
  },
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "long" }).format(date);
}

export default async function LegalPageView({ slug }: { slug: string }) {
  const page = await getLegalPage(slug);

  // Sem documento no Sanity, mostramos um estado de espera em vez de 404: a
  // página existe, o texto é que ainda não foi lá colocado.
  if (!page) {
    return (
      <section className="bg-[#f7f2ec] py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-4xl leading-tight text-neutral-900 md:text-5xl">
            Em preparação
          </h1>
          <p className="mt-4 text-xl text-neutral-500">
            Este texto está a ser finalizado. Para qualquer esclarecimento entretanto,
            fale connosco pelo WhatsApp ou passe pela loja.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-[17px] text-[#B76E2B] transition hover:text-[#9d5e24]"
          >
            ← Voltar ao início
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f7f2ec] py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-serif text-4xl leading-tight text-neutral-900 md:text-6xl">
          {page.title}
        </h1>

        {page.intro ? (
          <p className="mt-4 text-xl text-neutral-500">{page.intro}</p>
        ) : null}

        {!page.reviewed ? (
          <div className="mt-8 flex gap-3 rounded-[6px] border border-[#d8a48a] bg-[#f9e8e1] p-5">
            <AlertTriangle size={20} className="mt-1 shrink-0 text-[#9c3520]" strokeWidth={1.8} />
            <p className="text-[16px] leading-7 text-[#7d2d1a]">
              <strong>Rascunho por validar.</strong> Este texto ainda não foi revisto por um
              profissional e não deve ser considerado definitivo.
            </p>
          </div>
        ) : null}

        <div className="mt-10">
          <PortableText value={page.content as never} components={components} />
        </div>

        {page.lastUpdated ? (
          <p className="mt-14 border-t border-[#e7d9cf] pt-6 text-sm text-neutral-500">
            Última atualização: {formatDate(page.lastUpdated)}
          </p>
        ) : null}

        <Link
          href="/"
          className="mt-8 inline-block text-[17px] text-[#B76E2B] transition hover:text-[#9d5e24]"
        >
          ← Voltar ao início
        </Link>
      </div>
    </section>
  );
}
