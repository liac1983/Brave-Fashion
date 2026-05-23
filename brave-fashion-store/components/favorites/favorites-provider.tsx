"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type FavoriteItem = {
  id: string;
  handle: string;
  title: string;
  price: string;
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  function toggle(item: FavoriteItem) {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      const next = exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
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
