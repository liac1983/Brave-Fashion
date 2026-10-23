export type SanityImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
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

export type Homepage = {
  heroImage: SanityImage | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
};

export type LegalPage = {
  title: string;
  intro: string | null;
  /** Portable Text do Sanity. */
  content: unknown[];
  lastUpdated: string | null;
  reviewed: boolean;
};
