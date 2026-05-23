"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites/favorites-provider";

export default function FavoritesButton() {
  const { count } = useFavorites();

  return (
    <Link
      href="/favoritos"
      aria-label="Ver favoritos"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-black/5"
    >
      <Heart size={22} strokeWidth={1.8} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#B76E2B] text-[11px] font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
