import { getCollections } from "@/lib/shopify";
import Link from "next/link";

export default async function ColecoesPage() {
  const collections = await getCollections(12);

  return (
    <section className="py-12">
      <h1 className="mb-8 text-3xl font-semibold">Coleções</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/colecao/${collection.handle}`}
            className="rounded-3xl bg-neutral-100 p-6 transition hover:bg-neutral-200"
          >
            <h2 className="text-xl font-medium">{collection.title}</h2>
          </Link>
        ))}
      </div>
    </section>
  );
}

