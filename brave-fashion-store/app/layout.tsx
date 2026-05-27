import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { FavoritesProvider } from "@/components/favorites/favorites-provider";

export const metadata: Metadata = {
  title: "Brave Fashion by Paula Valente",
  description: "Loja online Brave Fashion by Paula Valente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-white text-black">
        <FavoritesProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}

