import ProductCard from "@/components/product/product-card";
import { getProducts } from "@/lib/shopify";

function getDiscountPercentage(price: number, compareAtPrice: number) {
  if (compareAtPrice <= price) return null;

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export default async function PromocoesPage() {
  const products = await getProducts(24);

  const discountedProducts = products.filter((product) => {
    const firstVariant = product.variants?.edges?.[0]?.node;

    if (!firstVariant?.compareAtPrice) return false;

    return (
      Number(firstVariant.compareAtPrice.amount) >
      Number(firstVariant.price.amount)
    );
  });

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
              const firstVariant = product.variants?.edges?.[0]?.node;

              const price = Number(firstVariant?.price.amount || 0);
              const compareAtPrice = Number(
                firstVariant?.compareAtPrice?.amount || 0
              );

              const discountPercentage = getDiscountPercentage(
                price,
                compareAtPrice
              );

              return (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  handle={product.handle}
                  image={product.featuredImage}
                  price={`€${price.toFixed(2)}`}
                  compareAtPrice={
                    firstVariant?.compareAtPrice
                      ? `€${compareAtPrice.toFixed(2)}`
                      : undefined
                  }
                  badge={
                    discountPercentage ? `-${discountPercentage}%` : "Promoção"
                  }
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

