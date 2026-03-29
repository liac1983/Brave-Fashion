import Link from "next/link";
import Image from "next/image";
import { getCollections, getProducts } from "@/lib/shopify";

export default async function HomePage() {
  const collections = await getCollections(6);
  const products = await getProducts(4);

  const featuredCollections = collections
    .filter((collection) => collection.handle !== "pagina-inicial")
    .slice(0, 3);

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Nova coleção Brave Fashion"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_25%]"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-4xl">
            <h1 className="font-serif text-5xl font-medium tracking-tight text-white md:text-7xl">
              Nova Coleção
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white md:text-2xl">
              O estilo é criar a própria moda — a diferença está nos pormenores.
            </p>

            <div className="mt-10">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-3 bg-[#B9712C] px-8 py-4 text-base font-medium text-white transition hover:bg-[#a86424]"
              >
                Explorar Loja
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 pb-20 pt-20">
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Categorias em destaque</h2>
            <p className="mt-2 text-neutral-600">
              Descobre algumas das áreas principais da coleção.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/colecao/${collection.handle}`}
                className="rounded-3xl bg-neutral-100 p-8 transition hover:bg-neutral-200"
              >
                <h3 className="text-xl font-medium">{collection.title}</h3>
                {collection.description ? (
                  <p className="mt-2 text-sm text-neutral-600">
                    {collection.description}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Novidades</h2>
              <p className="mt-2 text-neutral-600">
                Algumas das peças mais recentes da loja.
              </p>
            </div>

            <Link
              href="/produtos"
              className="text-sm underline underline-offset-4"
            >
              Ver todos
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/produtos/${product.handle}`}
                className="block"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-neutral-100">
                  {product.featuredImage ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-400">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-medium">{product.title}</h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {product.priceRange.minVariantPrice.amount}{" "}
                    {product.priceRange.minVariantPrice.currencyCode}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="overflow-hidden rounded-3xl bg-neutral-100">
            <div className="flex min-h-[420px] items-center justify-center text-neutral-400">
              Imagem look completo
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Looks completos
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Conjuntos pensados ao detalhe
            </h2>
            <p className="mt-4 max-w-xl text-neutral-600">
              Descobre combinações elegantes e femininas para o dia a dia ou para
              momentos especiais, sempre com atenção ao corte, ao caimento e ao
              detalhe.
            </p>

            <Link
              href="/colecoes"
              className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm text-white"
            >
              Explorar looks
            </Link>
          </div>
        </section>

        <section>
          <div className="rounded-3xl bg-neutral-50 px-6 py-12 md:px-10">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Arranjos
            </p>

            <h2 className="mt-4 text-3xl font-semibold">
              Ajustes e arranjos para um resultado perfeito
            </h2>

            <p className="mt-4 max-w-2xl text-neutral-600">
              Porque a diferença está nos pormenores, disponibilizamos apoio em
              arranjos e ajustes para que cada peça assente da melhor forma.
            </p>

            <div className="mt-8">
              <Link
                href="/contactos"
                className="rounded-full border border-neutral-300 px-6 py-3 text-sm transition hover:bg-white"
              >
                Marcar arranjo
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Segue a Brave Fashion</h2>
            <p className="mt-2 text-neutral-600">
              Inspiração, novidades e looks no Instagram.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-square rounded-3xl bg-neutral-100"
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

