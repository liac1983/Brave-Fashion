import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { FavoritesProvider } from "@/components/favorites/favorites-provider";
import SiteShell from "@/components/layout/site-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bravefashionbypaulavalente.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
          <FavoritesProvider>
            <SiteShell>{children}</SiteShell>
          </FavoritesProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

