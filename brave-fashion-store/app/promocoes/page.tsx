import ProductCard from "@/components/product/product-card";
import { getProducts } from "@/lib/sanity";

function getDiscountPercentage(price: number, originalPrice: number) {
  if (originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default async function PromocoesPage() {
  const products = await getProducts(24);

  const discountedProducts = products.filter(
    (p) => p.originalPrice != null && p.originalPrice > Number(p.priceRange.minVariantPrice.amount)
  );

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
                />
              );
            })}
          </div>
        ) : (
          <p className="text-xl text-neutral-500">
            Neste momento não existem produtos em promoção.
          </p>
        )}
      </div>
    </section>
  );
}
