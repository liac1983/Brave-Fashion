import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductByHandle, getProducts } from "@/lib/shopify";
import ProductDetails from "@/components/product/product-details";
import RelatedProducts from "@/components/product/related-products";

type ProductPageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const variants = product.variants?.edges.map((edge) => edge.node) ?? [];

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

        <ProductDetails product={product} variants={variants} />

        <RelatedProducts
          title="Também pode gostar"
          products={relatedProducts}
        />
      </div>
    </section>
  );
}

