import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/shopify";
import ProductDetails from "@/components/product/product-details";

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

  return (
    <section className="py-12">
      <ProductDetails product={product} variants={variants} />

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">Combina com</h2>
        <p className="mt-3 text-neutral-600">
          Em breve vais poder ver sugestões de peças no mesmo padrão e looks
          completos para combinar com este artigo.
        </p>
      </section>
    </section>
  );
}