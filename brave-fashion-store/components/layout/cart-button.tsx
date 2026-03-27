"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { ShoppingBag } from "lucide-react";

export default function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrinho"
      className="relative flex items-center justify-center text-neutral-800 transition hover:opacity-70"
      aria-label="Carrinho"
    >
      <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />

      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-xs text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}