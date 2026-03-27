"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";

type AddToCartButtonProps = {
  item: {
    variantId: string;
  };
};

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = async () => {
    await addToCart({
      variantId: item.variantId,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full rounded-full px-6 py-3 text-sm text-white transition ${
        added ? "bg-green-600" : "bg-black hover:opacity-90"
      } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {added ? "✓ Adicionado" : "Adicionar ao carrinho"}
    </button>
  );
}

