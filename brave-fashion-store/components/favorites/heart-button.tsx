"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "./favorites-provider";

type HeartButtonProps = {
  product: {
    id: string;
    handle: string;
    title: string;
    price: string;
    image: { url: string; altText: string | null } | null;
  };
  size?: "sm" | "lg";
};

export default function HeartButton({ product, size = "sm" }: HeartButtonProps) {
  const { toggle, isFavorite } = useFavorites();
  const active = isFavorite(product.id);
  const iconSize = size === "lg" ? 26 : 22;

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className="flex items-center justify-center rounded-full transition hover:scale-110"
    >
      <Heart
        size={iconSize}
        strokeWidth={1.8}
        className={active ? "fill-[#B76E2B] stroke-[#B76E2B]" : "stroke-neutral-500"}
      />
    </button>
  );
}
