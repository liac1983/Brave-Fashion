import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/shopify";
import ProductGrid from "@/components/product/product-grid";

type CollectionPageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const { handle } = await params;

  const collection = await getCollectionByHandle(handle, 24);

  if (!collection) {
    notFound();
  }

  const products = collection.products?.edges.map((edge) => edge.node) ?? [];

  return (
    <section className="py-12">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Coleção
        </p>

        <h1 className="mt-3 text-4xl font-semibold">{collection.title}</h1>

        {collection.description ? (
          <p className="mt-4 max-w-2xl text-neutral-600">
            {collection.description}
          </p>
        ) : null}
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-neutral-500">
          Esta coleção ainda não tem produtos disponíveis.
        </p>
      )}
    </section>
  );
}


