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
    <section className="mt-28">
      <h2 className="font-serif text-4xl text-neutral-900 md:text-6xl">
        {title}
      </h2>

      <div className="mt-12">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

