import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductByHandle, getProducts } from "@/lib/sanity";
import { metadataDaPagina } from "@/lib/seo";
import ProductDetails from "@/components/product/product-details";
import RelatedProducts from "@/components/product/related-products";

type ProductPageProps = {
  params: Promise<{
    handle: string;
  }>;
};

// Os metadados e a página pedem a mesma peça: um só pedido ao Sanity.
const getProduct = cache(getProductByHandle);

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return {};

  return metadataDaPagina({
    title: product.title,
    description: product.description,
    descricaoAlternativa: `${product.title.trim()} na Brave Fashion by Paula Valente, moda feminina em Paços de Ferreira.`,
    path: `/produtos/${product.handle}`,
    image: product.featuredImage,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts(8);
  const relatedProducts = allProducts
    .filter((item) => item.handle !== product.handle)
    .slice(0, 3);

  return (
    <section className="bg-[#f7f2ec] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <Link
          href="/produtos"
          className="mb-10 inline-flex items-center gap-3 text-lg text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={22} />
          <span>Voltar à loja</span>
        </Link>

        <ProductDetails product={product} />

        <RelatedProducts
          title="Também pode gostar"
          products={relatedProducts}
        />
      </div>
    </section>
  );
}

