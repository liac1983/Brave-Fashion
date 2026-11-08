import type { Variante } from "@/lib/shop";

export type SanityImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  /** Referência ao ficheiro e o ponto focal definido no Studio. */
  asset?: { _ref?: string; _type?: string } | null;
  hotspot?: { x: number; y: number; height: number; width: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string | null;
  isNew: boolean;
  available: boolean;
  originalPrice: number | null;
  venderOnline: boolean;
  /**
   * Combinações de cor e tamanho com a quantidade de cada. Vazio quando a
   * peça é de unidade única, que é o caso da maioria das peças da loja.
   */
  variantes: Variante[];
  featuredImage: SanityImage | null;
  images: {
    edges: Array<{ node: SanityImage }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: never[];
  };
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: SanityImage | null;
  products?: {
    edges: Array<{ node: Product }>;
  };
};

/** Um slide do carrossel do topo da homepage. */
export type HeroSlide =
  | {
      key: string;
      tipo: "logo";
      fundo: "bege" | "branco";
      /** Vazio quando se usa o logótipo da loja. */
      logo: SanityImage | null;
    }
  | {
      key: string;
      tipo: "imagem";
      imagem: SanityImage | null;
      titulo: string | null;
      subtitulo: string | null;
      mostrarBotao: boolean;
    };

export type Homepage = {
  slides: HeroSlide[];
};

export type LegalPage = {
  title: string;
  intro: string | null;
  /** Portable Text do Sanity. */
  content: unknown[];
  lastUpdated: string | null;
  reviewed: boolean;
};
