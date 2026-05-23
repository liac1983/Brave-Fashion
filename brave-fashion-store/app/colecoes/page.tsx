import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/lib/sanity";

export default async function ColecoesPage() {
  const collections = await getCollections(12);

  return (
    <section className="bg-[#f7f2ec] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl text-neutral-900 md:text-6xl">
            Coleções
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/colecao/${collection.handle}`}
              className="group block"
            >
              <div className="relative h-[420px] overflow-hidden rounded-[6px] bg-[#d9cec2]">
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-500">
                    Sem imagem
                  </div>
                )}

                <div className="absolute inset-0 bg-[#8d6a4d]/30 transition duration-500 group-hover:bg-[#8d6a4d]/40" />

                <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                  <h2 className="font-serif text-4xl text-white md:text-5xl">
                    {collection.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
