"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

type FavoriteItem = {
  id: string;
  handle: string;
  title: string;
  image: { url: string; altText: string | null } | null;
};

type FavoritesState = {
  items: FavoriteItem[];
  toggle: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
  count: number;
};

const FavoritesContext = createContext<FavoritesState | null>(null);
const STORAGE_KEY = "brave_fashion_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const { isSignedIn, isLoaded, userId } = useAuth();

  // Carrega favoritos — do Sanity se autenticada, senão do localStorage
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      fetch("/api/favorites")
        .then((r) => r.json())
        .then((data) => {
          const products: FavoriteItem[] = (data.products ?? []).map((p: any) => ({
            id: p._id,
            handle: p.handle,
            title: p.title,
            image: p.image ?? null,
          }));
          setItems(products);
        })
        .catch(() => {});
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored));
      } catch {}
    }
  }, [isLoaded, isSignedIn, userId]);

  function toggle(item: FavoriteItem) {
    const exists = items.some((i) => i.id === item.id);
    const next = exists
      ? items.filter((i) => i.id !== item.id)
      : [...items, item];

    setItems(next);

    if (isSignedIn) {
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.id,
          action: exists ? "remove" : "add",
        }),
      }).catch(() => {});
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }

  function isFavorite(id: string) {
    return items.some((i) => i.id === id);
  }

  return (
    <FavoritesContext.Provider value={{ items, toggle, isFavorite, count: items.length }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites deve ser usado dentro de FavoritesProvider");
  return ctx;
}
