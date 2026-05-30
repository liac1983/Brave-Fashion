import ProductCard from "./product-card";

type Product = {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          handle={product.handle}
          image={product.featuredImage}
          price={`€${Number(product.priceRange.minVariantPrice.amount).toFixed(2)}`}
        />
      ))}
    </div>
  );
}

