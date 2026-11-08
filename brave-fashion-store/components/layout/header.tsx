"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./logo";
import MainNav from "./main-nav";
import FavoritesButton from "./favorites-button";
import { Menu } from "lucide-react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useTomDoHero } from "@/lib/hero-tom";

const mobileLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre-nos", label: "Sobre Nós" },
  { href: "/produtos", label: "Produtos" },
  { href: "/novidades", label: "Novidades" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/marcacoes", label: "Marcar Visita" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tomDoHero = useTomDoHero();

  // Transparente só na homepage e enquanto o menu mobile está fechado
  const overHero = isHome && !scrolled && !isOpen;
  // Letras brancas só por cima de fotografia. No slide do logótipo, de fundo
  // claro, o menu continua transparente mas com as letras escuras de sempre.
  const transparent = overHero && tomDoHero === "escuro";

  return (
    <header
      className={`top-0 z-50 transition-colors duration-300 ${
        isHome ? "fixed inset-x-0" : "sticky"
      } ${
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[#e9dfd3] bg-[#f7f2ec]/95 backdrop-blur"
      }`}
    >
      {/*
        Véu que desce do topo e se dissolve. Sem ele, os links brancos caem
        em cima do letreiro iluminado da loja — a zona mais clara da
        fotografia — e deixam de se ler. Escurece só a faixa do menu; o
        centro da imagem, onde está o título, fica como estava.
      */}
      {transparent && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/25 to-transparent"
        />
      )}

      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="block md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                transparent
                  ? "text-white hover:bg-white/10"
                  : "text-neutral-800 hover:bg-black/5"
              }`}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              <Menu className="h-6 w-6" strokeWidth={1.8} />
            </button>
          </div>

          <Logo light={transparent} />
        </div>

        <div className="hidden md:block">
          <MainNav light={transparent} />
        </div>

        <div className="flex items-center gap-3">
          <FavoritesButton light={transparent} />
          {isLoaded && (
            isSignedIn ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="As minhas listas"
                    labelIcon={<span>📁</span>}
                    href="/perfil"
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <SignInButton mode="modal">
                <button
                  className={`rounded-[6px] border px-4 py-2 text-sm font-medium transition ${
                    transparent
                      ? "border-white/70 text-white hover:border-white hover:bg-white/10"
                      : "border-[#e7d9cf] text-neutral-700 hover:border-[#B76E2B] hover:text-[#B76E2B]"
                  }`}
                >
                  Entrar
                </button>
              </SignInButton>
            )
          )}
        </div>
      </div>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
          />

          <div className="fixed left-0 top-20 z-50 h-[calc(100vh-5rem)] w-[82%] max-w-sm border-r border-[#e9dfd3] bg-[#f7f2ec] p-6 shadow-xl md:hidden">
            <nav className="flex flex-col gap-1">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3 py-3 text-base text-neutral-800 transition hover:bg-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
