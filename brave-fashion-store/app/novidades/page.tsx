import { getNewProducts } from "@/lib/sanity";
import ProductCard from "@/components/product/product-card";

export const metadata = {
  title: "Novidades",
  description:
    "As últimas peças a chegar à Brave Fashion. Moda feminina elegante, escolhida peça a peça em Paços de Ferreira.",
};


export default async function NovidadesPage() {
  const products = await getNewProducts();

  return (
    <section className="bg-[#f7f2ec] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14">
          <h1 className="font-serif text-5xl leading-tight text-neutral-900 md:text-7xl">
            Novidades
          </h1>
          <p className="mt-4 text-2xl text-neutral-500">
            {products.length} {products.length === 1 ? "nova peça" : "novas peças"}
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-xl text-neutral-500">
            Não há novidades de momento. Volta em breve!
          </p>
        ) : (
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                handle={product.handle}
                image={product.featuredImage}
                price={`€${Number(product.priceRange.minVariantPrice.amount).toFixed(2)}`}
                buyable={Boolean(product.venderOnline)}
                badge="Novidade"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
