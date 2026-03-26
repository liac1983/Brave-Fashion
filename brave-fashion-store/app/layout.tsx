import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-provider";

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
        <CartProvider>
          <Header />
          <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-8">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

