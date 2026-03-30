import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/shopify";

export default async function HomePage() {
  const products = await getProducts(4);

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

      <div className="bg-[#f7f2ec]">
        <div className="mx-auto max-w-7xl space-y-20 px-4 pb-20 pt-20">
          <section>
            <div className="pb-16 text-center md:pb-20">
              <h2 className="font-serif text-4xl font-medium tracking-tight text-neutral-900 md:text-6xl">
                Produtos em Destaque
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-500 md:text-2xl">
                Seleção especial das nossas peças mais icónicas da temporada
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/produtos/${product.handle}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-400">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <h3 className="font-serif text-2xl text-neutral-900">
                      {product.title}
                    </h3>
                    <p className="mt-3 text-2xl text-neutral-500">
                      €{Number(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <Link
                href="/produtos"
                className="flex items-center justify-center gap-4 text-[18px] font-medium no-underline"
                style={{
                  minWidth: "360px",
                  border: "2px solid #B76E2B",
                  color: "#B76E2B",
                  padding: "20px 48px",
                }}
              >
                <span className="font-serif">Ver Todos os Produtos</span>
                <span
                  aria-hidden="true"
                  style={{ fontSize: "24px", lineHeight: 1 }}
                >
                  →
                </span>
              </Link>
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
                  className="aspect-square rounded-3xl bg-white"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

