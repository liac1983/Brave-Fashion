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


export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: Money;
    image?: ShopifyImage | null;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage?: ShopifyImage | null;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
};

export type CartQueryResponse = {
  cart: Cart | null;
};

export type CartCreateResponse = {
  cartCreate: {
    cart: Cart | null;
    userErrors: Array<{
      field?: string[];
      message: string;
    }>;
    warnings?: Array<{
      code?: string;
      message: string;
    }>;
  };
};

export type CartLinesAddResponse = {
  cartLinesAdd: {
    cart: Cart | null;
    userErrors: Array<{
      field?: string[];
      message: string;
    }>;
    warnings?: Array<{
      code?: string;
      message: string;
    }>;
  };
};

export type CartLinesUpdateResponse = {
  cartLinesUpdate: {
    cart: Cart | null;
    userErrors: Array<{
      field?: string[];
      message: string;
    }>;
    warnings?: Array<{
      code?: string;
      message: string;
    }>;
  };
};

export type CartLinesRemoveResponse = {
  cartLinesRemove: {
    cart: Cart | null;
    userErrors: Array<{
      field?: string[];
      message: string;
    }>;
    warnings?: Array<{
      code?: string;
      message: string;
    }>;
  };
};




