"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";

type AddToCartButtonProps = {
  item: {
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
  };
};

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(item);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-full px-6 py-3 text-sm text-white transition w-full
        ${
          added
            ? "bg-green-600"
            : "bg-black hover:opacity-90"
        }
      `}
    >
      {added ? "✓ Adicionado" : "Adicionar ao carrinho"}
    </button>
  );
}

