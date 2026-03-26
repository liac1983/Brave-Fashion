export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  image?: ShopifyImage | null;
  price: Money;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ShopifyImage | null;
  images?: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants?: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  priceRange: {
    minVariantPrice: Money;
  };
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products?: {
    edges: Array<{
      node: Product;
    }>;
  };
};

export type ProductsQueryResponse = {
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
};

export type ProductByHandleQueryResponse = {
  product: Product | null;
};

export type CollectionsQueryResponse = {
  collections: {
    edges: Array<{
      node: Collection;
    }>;
  };
};

export type CollectionByHandleQueryResponse = {
  collection: Collection | null;
};



