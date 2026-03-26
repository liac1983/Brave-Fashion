import { getProducts } from "@/lib/shopify";
import ProductGrid from "@/components/product/product-grid";

export default async function ProdutosPage() {
  const products = await getProducts(12);

  return (
    <section className="py-12">
      <h1 className="mb-8 text-3xl font-semibold">Produtos</h1>
      <ProductGrid products={products} />
    </section>
  );
}

