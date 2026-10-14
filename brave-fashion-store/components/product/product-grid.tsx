import ProductCard from "./product-card";

type ProductImage = {
  url: string;
  altText: string | null;
};

type Product = {
  id: string;
  handle: string;
  title: string;
  featuredImage: ProductImage | null;
  images?: {
    edges: Array<{ node: ProductImage }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  linkPagamento?: string | null;
};

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const gallery = product.images?.edges?.map((e) => e.node) ?? [];
        const hoverImage =
          gallery.find((img) => img.url !== product.featuredImage?.url) ?? null;
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            handle={product.handle}
            image={product.featuredImage}
            hoverImage={hoverImage}
            price={`€${Number(product.priceRange.minVariantPrice.amount).toFixed(2)}`}
            buyable={Boolean(product.linkPagamento)}
          />
        );
      })}
    </div>
  );
}

