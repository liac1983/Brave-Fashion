"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";

type AddToCartButtonProps = {
  item: {
    variantId: string;
  };
  className?: string;
};

export default function AddToCartButton({
  item,
  className = "",
}: AddToCartButtonProps) {
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

  const defaultClassName =
    "w-full rounded-full px-6 py-3 text-sm font-medium text-white transition";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`${defaultClassName} ${
        className ||
        `${added ? "bg-green-600" : "bg-black hover:opacity-90"}`
      } ${isLoading ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {added ? "✓ Adicionado" : "Adicionar ao carrinho"}
    </button>
  );
}

