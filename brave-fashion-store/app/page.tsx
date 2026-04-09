import Link from "next/link";
import Image from "next/image";
import { getCollections, getProducts } from "@/lib/shopify";
import NewsletterForm from "@/components/newsletter-form";
import HeroSection from "@/components/home/hero-section";

export default async function HomePage() {
  const products = await getProducts(4);
  const collections = await getCollections(6);

  const instagramPosts = [
    {
      id: "1",
      image: "/instagram/insta-1.jpg",
      link: "https://www.instagram.com/p/DW0txvwDLmt/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    },
    {
      id: "2",
      image: "/instagram/insta-2.jpg",
      link: "https://www.instagram.com/p/DWzk7ydjLjr/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    },
    {
      id: "3",
      image: "/instagram/insta-3.jpg",
      link: "https://www.instagram.com/p/DWbDmQCD48g/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    },
  ];

  const featuredCollections = collections
    .filter((collection) => collection.handle !== "pagina-inicial")
    .slice(0, 3);

  return (
    <>

      <HeroSection />

      <div className="bg-[#f7f2ec]">
        <div className="mx-auto max-w-7xl space-y-24 px-4 pb-24 pt-20">
          <section>
            <div className="text-center pb-20">
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

            <div className="mt-16 flex justify-center ">
              <Link
                href="/produtos"
                className="flex items-center justify-center gap-4 text-[18px] font-medium no-underline "
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


          <section className="mt-20 bg-[#f3ece7] py-16">

            <div className="mb-20 text-center">
              <h2 className="font-serif text-4xl font-medium tracking-tight text-neutral-900 md:text-6xl">
                Coleções
              </h2>
            </div>

            <div className="mt-20 grid gap-8 md:grid-cols-3"> 

              {featuredCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/colecao/${collection.handle}`}
                  className="group block"
                >
                  <div
                    className="relative overflow-hidden rounded-[6px] bg-[#d9cec2]"
                    style={{ height: "420px", minHeight: "420px" }}
                  >
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

                  <div
                    className="absolute inset-0 z-10 transition duration-500"
                    style={{ backgroundColor: "rgba(166, 90, 42, 0.28)" }}
                  />

                  <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
                    <h3
                      className="font-serif text-4xl text-white md:text-5xl"
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.18)" }}
                    >
                      {collection.title}
                    </h3>
                  </div>

                  </div>


                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-10 mt-20 text-center">
              <h2 className="font-serif text-4xl font-medium tracking-tight text-neutral-900 md:text-6xl">
                Segue a Brave Fashion
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-500 md:text-2xl">
                Inspiração, novidades e looks nas redes sociais.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {instagramPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  {/* Mobile */}
                  <div className="overflow-hidden rounded-[6px] bg-white md:hidden">
                    <Image
                      src={post.image}
                      alt="Publicação da Brave Fashion"
                      width={500}
                      height={700}
                      sizes="100vw"
                      className="w-full h-auto transition duration-500"
                    />
                  </div>

                  {/* Desktop */}
                  <div className="hidden overflow-hidden rounded-[6px] bg-white md:block md:h-[500px]">
                    <Image
                      src={post.image}
                      alt="Publicação da Brave Fashion"
                      width={800}
                      height={1000}
                      sizes="33vw"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </a>
              ))}
            </div>


            <div className="mt-12 flex justify-center">
              <a
                href="https://www.instagram.com/bravefashionbypaulavalente/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-4 text-[18px] font-medium no-underline"
                style={{
                  minWidth: "320px",
                  border: "2px solid #B76E2B",
                  color: "#B76E2B",
                  padding: "20px 48px",
                }}
              >
                <span className="font-serif">Ver Mais</span>
                <span
                  aria-hidden="true"
                  style={{ fontSize: "24px", lineHeight: 1 }}
                >
                  →
                </span>
              </a>
            </div>
          </section>

          <section className="bg-[#f7f2ec] py-20">
            <div className="mx-auto max-w-4xl px-4 text-center">
              <h2 className="font-serif text-4xl text-neutral-900 md:text-6xl">
                Fique a Par
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg text-neutral-500 md:text-2xl">
                Subscreva para receber novidades sobre as nossas coleções e ofertas exclusivas.
              </p>

              <NewsletterForm />

              <p className="mt-4 text-sm text-neutral-500">
                Receba 10% de desconto na primeira compra ao subscrever a newsletter.
              </p>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

