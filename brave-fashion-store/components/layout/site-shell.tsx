"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScroll from "@/components/smooth-scroll";

/**
 * Decide o que envolve cada página.
 *
 * O Studio do Sanity traz o seu próprio cabeçalho e, sobretudo, a sua própria
 * barra de scroll. Envolvê-lo no cromado do site punha dois scrolls a competir
 * — o suave do Lenis, que controla a página inteira, e o interno do Studio —
 * e descer num formulário longo tornava-se um exercício de paciência.
 *
 * Por isso o /studio sai de tudo isso e fica com o ecrã só para ele.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <Header />
      <main>{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
