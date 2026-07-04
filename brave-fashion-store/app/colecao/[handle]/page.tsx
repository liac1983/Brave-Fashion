import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/sanity";
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

  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  const products = collection.products?.edges.map((edge) => edge.node) ?? [];

  return (
    <section className="bg-[#f7f2ec] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Coleção
          </p>

          <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-6xl">
            {collection.title}
          </h1>

          {collection.description ? (
            <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
              {collection.description}
            </p>
          ) : null}
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-center text-neutral-500">
            Esta coleção ainda não tem produtos disponíveis.
          </p>
        )}
      </div>
    </section>
  );
}

