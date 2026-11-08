"use client";

import { useSyncExternalStore } from "react";

/**
 * Tom do slide que está à vista no topo da homepage.
 *
 * Na homepage o menu fica por cima do carrossel, em branco. Num slide de
 * fotografia é isso que se lê; no slide do logótipo, de fundo claro, o branco
 * desaparece. O carrossel avisa aqui qual é o tom e o cabeçalho adapta-se.
 */
export type TomDoHero = "escuro" | "claro";

let tom: TomDoHero = "escuro";
const ouvintes = new Set<() => void>();

export function definirTomDoHero(novo: TomDoHero) {
  if (novo === tom) return;
  tom = novo;
  ouvintes.forEach((ouvinte) => ouvinte());
}

function subscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function useTomDoHero() {
  return useSyncExternalStore(subscrever, () => tom, () => "escuro" as TomDoHero);
}
