export type CartItem = {
  id: string;
  variantId: string;
  handle: string;
  title: string;
  variantTitle: string;
  price: string;
  currencyCode: string;
  image?: {
    url: string;
    altText: string | null;
  } | null;
  quantity: number;
};

