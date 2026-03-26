import Image from "next/image";
import { getProducts } from "@/lib/shopify";

export default async function TestProductsPage() {
  const products = await getProducts(6);

  return (
    <section className="py-12">
      <h1 className="text-3xl font-semibold">Teste de Produtos</h1>

      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-xl border p-4">
            {product.featuredImage ? (
              <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="mb-4 flex aspect-[3/4] items-center justify-center rounded-lg bg-neutral-100 text-sm text-neutral-400">
                Sem imagem
              </div>
            )}

            <h2 className="text-lg font-medium">{product.title}</h2>

            <p className="text-sm text-neutral-500">{product.handle}</p>

            <p className="mt-2 text-sm">
              {product.priceRange.minVariantPrice.amount}{" "}
              {product.priceRange.minVariantPrice.currencyCode}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}