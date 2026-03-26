import type { Product } from "@/lib/shopify/types";
import ProductGrid from "./product-grid";

type RelatedProductsProps = {
  title: string;
  products: Product[];
};

export default function RelatedProducts({
  title,
  products,
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

