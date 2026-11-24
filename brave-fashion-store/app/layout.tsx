import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { FavoritesProvider } from "@/components/favorites/favorites-provider";
import SiteShell from "@/components/layout/site-shell";
import { Analytics } from "@vercel/analytics/next";
import FichaDaLoja from "@/components/seo/ficha-da-loja";

// Letras guardadas no projeto: o build não depende do Google Fonts
// (falhou a descarregá-las a 8/11 e a 19/11).
const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const cormorant = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  weight: "300 700",
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bravefashionbypaulavalente.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Relativo ao endereço de cada página, sem parâmetros (filtros, utm…).
  // Herdado por todas; as peças e coleções definem o seu.
  alternates: { canonical: "./" },
  title: {
    default: "Brave Fashion by Paula Valente",
    template: "%s | Brave Fashion",
  },
  description:
    "Moda elegante e sofisticada para mulheres que apreciam qualidade e estilo. Brave Fashion by Paula Valente — Paços de Ferreira.",
  keywords: [
    "Brave Fashion",
    "Paula Valente",
    "moda feminina",
    "roupa de mulher",
    "Paços de Ferreira",
  ],
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: siteUrl,
    siteName: "Brave Fashion",
    title: "Brave Fashion by Paula Valente",
    description:
      "Moda elegante e sofisticada para mulheres que apreciam qualidade e estilo.",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Brave Fashion by Paula Valente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brave Fashion by Paula Valente",
    description:
      "Moda elegante e sofisticada para mulheres que apreciam qualidade e estilo.",
    images: ["/logo.jpg"],
  },
  // Prova ao Google Search Console que o site é da loja (propriedade
  // "Prefixo do URL", conta bagasvaidosas@gmail.com). Não é segredo: é
  // publicado na página. Apagar isto faz o Search Console perder o acesso.
  verification: {
    google: "35sXjxuQKc4-CLA1UydaBqY1HT9EBjvlYwTypsiCVYw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt" className={`${inter.variable} ${cormorant.variable}`}>
        <body className="min-h-screen bg-white font-sans text-black">
          <FichaDaLoja />
          <FavoritesProvider>
            <SiteShell>{children}</SiteShell>
            {/*
              Medição de audiência sem cookies e sem identificar quem visita.
              Está descrita no ponto 6 da Política de Privacidade — se um dia
              for substituída por outra ferramenta, esse texto tem de mudar.
            */}
            <Analytics />
          </FavoritesProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

