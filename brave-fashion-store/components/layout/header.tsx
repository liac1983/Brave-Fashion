"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./logo";
import MainNav from "./main-nav";
import CartButton from "./cart-button";
import { Menu } from "lucide-react";

const mobileLinks = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Loja" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9dfd3] bg-[#f7f2ec]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="block md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-black/5"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              <Menu className="h-6 w-6" strokeWidth={1.8} />
            </button>
          </div>

          <Logo />
        </div>

        <div className="hidden md:block">
          <MainNav />
        </div>

        <CartButton />
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

