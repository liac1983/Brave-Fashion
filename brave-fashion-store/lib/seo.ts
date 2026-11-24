import type { Metadata } from "next";
import type { SanityImage } from "@/lib/sanity/types";
import { cropped } from "@/lib/sanity/image";

/** O Google corta a descrição por volta dos 160 caracteres. */
const MAX_DESCRICAO = 160;

function resumir(texto: string): string {
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (limpo.length <= MAX_DESCRICAO) return limpo;

  const corte = limpo.slice(0, MAX_DESCRICAO - 1);
  const espaco = corte.lastIndexOf(" ");
  return `${(espaco > 0 ? corte.slice(0, espaco) : corte).replace(/[\s,;:.–—-]+$/, "")}…`;
}

type PaginaSeo = {
  title: string;
  description: string;
  /** Usada quando a Paula ainda não escreveu descrição no Studio. */
  descricaoAlternativa: string;
  path: string;
  image: SanityImage | null;
};

/**
 * Título, descrição, canonical e imagem de partilha de uma peça ou coleção.
 *
 * O Next não junta o openGraph e o twitter da página com os do layout:
 * substitui-os. Por isso vão aqui completos.
 */
export function metadataDaPagina(pagina: PaginaSeo): Metadata {
  const title = pagina.title.trim();
  const description = resumir(pagina.description) || pagina.descricaoAlternativa;
  const url = cropped(pagina.image, 900, 1200);
  const images = [
    url
      ? { url, alt: pagina.image?.altText || title }
      : { url: "/logo.jpg", alt: "Brave Fashion by Paula Valente" },
  ];
  const tituloPartilha = `${title} | Brave Fashion`;

  return {
    title,
    description,
    alternates: { canonical: pagina.path },
    openGraph: {
      type: "website",
      locale: "pt_PT",
      siteName: "Brave Fashion",
      url: pagina.path,
      title: tituloPartilha,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: tituloPartilha,
      description,
      images,
    },
  };
}
