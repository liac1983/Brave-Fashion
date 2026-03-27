"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

type CartLineItem = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      url: string;
      altText: string | null;
    } | null;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage?: {
        url: string;
        altText: string | null;
      } | null;
    };
  };
};

type CartState = {
  cartId: string | null;
  checkoutUrl: string | null;
  items: CartLineItem[];
  totalItems: number;
  subtotal: number;
  currencyCode: string;
  isLoading: boolean;
  addToCart: (item: {
    variantId: string;
    quantity?: number;
  }) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartState | null>(null);

const CART_STORAGE_KEY = "shopify_cart_id";

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Erro no carrinho.");
  }

  return res.json();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("EUR");

  const syncCart = (cart: any) => {
    setCartId(cart.id);
    setCheckoutUrl(cart.checkoutUrl);
    setItems(cart.lines?.edges?.map((edge: any) => edge.node) ?? []);
    setCurrencyCode(cart.cost?.subtotalAmount?.currencyCode ?? "EUR");
    localStorage.setItem(CART_STORAGE_KEY, cart.id);
  };

  useEffect(() => {
    const storedCartId = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCartId) return;

    setIsLoading(true);

    fetch(`/api/cart?id=${encodeURIComponent(storedCartId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) {
          syncCart(data.cart);
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const addToCart = async ({
    variantId,
    quantity = 1,
  }: {
    variantId: string;
    quantity?: number;
  }) => {
    setIsLoading(true);

    try {
      if (!cartId) {
        const data = await postJson("/api/cart/create", {
          variantId,
          quantity,
        });
        syncCart(data.cart);
        return;
      }

      const data = await postJson("/api/cart/lines/add", {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      });
      syncCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cartId) return;

    setIsLoading(true);

    try {
      if (quantity <= 0) {
        const data = await postJson("/api/cart/lines/remove", {
          cartId,
          lineIds: [lineId],
        });
        syncCart(data.cart);
        return;
      }

      const data = await postJson("/api/cart/lines/update", {
        cartId,
        lines: [{ id: lineId, quantity }],
      });
      syncCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (lineId: string) => {
    if (!cartId) return;

    setIsLoading(true);
    try {
      const data = await postJson("/api/cart/lines/remove", {
        cartId,
        lineIds: [lineId],
      });
      syncCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cartId || items.length === 0) return;

    setIsLoading(true);
    try {
      const data = await postJson("/api/cart/lines/remove", {
        cartId,
        lineIds: items.map((item) => item.id),
      });
      syncCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + Number(item.merchandise.price.amount) * item.quantity;
    }, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        cartId,
        checkoutUrl,
        items,
        totalItems,
        subtotal,
        currencyCode,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return context;
}

