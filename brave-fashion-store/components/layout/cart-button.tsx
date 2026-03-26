"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";

export default function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrinho"
      className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-black hover:text-white transition"
    >
      <span>🛒</span>
      <span className="hidden md:inline">Carrinho</span>
      <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
        {totalItems}
      </span>
    </Link>
  );
}

