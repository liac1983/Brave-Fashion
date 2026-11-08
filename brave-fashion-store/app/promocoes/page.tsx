import Link from "next/link";
import ProductCard from "@/components/product/product-card";
import { getPromotions } from "@/lib/sanity";

export const metadata = {
  title: "Promoções",
  description:
    "Peças selecionadas com preço reduzido na Brave Fashion by Paula Valente. Stock limitado — cada peça é única.",
};


function getDiscountPercentage(price: number, originalPrice: number) {
  if (originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default async function PromocoesPage() {
  const discountedProducts = await getPromotions();

  return (
    <section className="bg-[#f7f2ec] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14">
          <h1 className="font-serif text-5xl leading-tight text-neutral-900 md:text-7xl">
            Promoções
          </h1>
          <p className="mt-4 text-2xl text-neutral-500">
            {discountedProducts.length} produtos em promoção
          </p>
        </div>

        {discountedProducts.length > 0 ? (
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {discountedProducts.map((product) => {
              const price = Number(product.priceRange.minVariantPrice.amount);
              const originalPrice = product.originalPrice!;
              const discountPercentage = getDiscountPercentage(price, originalPrice);

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  handle={product.handle}
                  image={product.featuredImage}
                  price={`€${price.toFixed(2)}`}
                  compareAtPrice={`€${originalPrice.toFixed(2)}`}
                  badge={discountPercentage ? `-${discountPercentage}%` : "Promoção"}
                  buyable={Boolean(product.venderOnline)}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-[6px] border border-[#e7d9cf] bg-white p-10">
            <p className="text-xl text-neutral-600">
              Neste momento não há peças em promoção.
            </p>
            <p className="mt-3 text-[17px] text-neutral-500">
              As promoções mudam ao longo da estação. Entretanto, veja a coleção completa
              ou fale connosco para saber o que está a chegar.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/produtos"
                className="flex items-center justify-center rounded-[6px] bg-[#B76E2B] px-8 py-4 text-[18px] font-medium text-white transition hover:bg-[#9d5e24]"
              >
                Ver todas as peças
              </Link>
              <Link
                href="/novidades"
                className="flex items-center justify-center rounded-[6px] border border-[#B76E2B] bg-white px-8 py-4 text-[18px] font-medium text-[#B76E2B] transition hover:bg-[#f3e7dc]"
              >
                Novidades
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
