import Link from "next/link";
import Image from "next/image";
import { getCollections, getProducts, getHomepage } from "@/lib/sanity";
import NewsletterForm from "@/components/newsletter-form";
import HeroSection from "@/components/home/hero-section";
import FadeIn from "@/components/ui/fade-in";
import { cropped, croppedCard } from "@/lib/sanity/image";

export default async function HomePage() {
  const [products, collections, homepage] = await Promise.all([
    getProducts(4),
    getCollections(6),
    getHomepage(),
  ]);

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

      <HeroSection
        heroImage={homepage.heroImage}
        heroTitle={homepage.heroTitle}
        heroSubtitle={homepage.heroSubtitle}
      />

      <div className="bg-[#f7f2ec]">
        <div className="mx-auto max-w-7xl space-y-24 px-4 pb-24 pt-20">
          <section>
            <FadeIn>
              <div className="text-center pb-20">
                <h2 className="font-serif text-4xl font-medium tracking-tight text-neutral-900 md:text-6xl">
                  Produtos em Destaque
                </h2>
                <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-500 md:text-2xl">
                  Seleção especial das nossas peças mais icónicas da temporada
                </p>
              </div>
            </FadeIn>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => {
                const gallery = product.images?.edges?.map((e) => e.node) ?? [];
                const hoverImage =
                  gallery.find((img) => img.url !== product.featuredImage?.url) ??
                  null;
                return (
                <Link
                  key={product.id}
                  href={`/produtos/${product.handle}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white">
                    {product.featuredImage ? (
                      <>
                        <Image
                          src={croppedCard(product.featuredImage) ?? product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className={`object-cover transition duration-700 group-hover:scale-105 ${
                            hoverImage ? "group-hover:opacity-0" : ""
                          }`}
                        />
                        {hoverImage && (
                          <Image
                            src={croppedCard(hoverImage) ?? hoverImage.url}
                            alt={hoverImage.altText || product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                          />
                        )}
                      </>
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
                    <p className="mt-2 text-xl text-neutral-500">
                      €{Number(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  </div>
                </Link>
                );
              })}
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
            <FadeIn>
              <div className="mb-20 text-center">
                <h2 className="font-serif text-4xl font-medium tracking-tight text-neutral-900 md:text-6xl">
                  Coleções
                </h2>
              </div>
            </FadeIn>

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
                        src={cropped(collection.image, 900, 1200) ?? collection.image.url}
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

          <section className="py-20">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

              <FadeIn direction="left">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B76E2B]">
                  Atendimento Personalizado
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight text-neutral-900 md:text-6xl">
                  A sua personal stylist está aqui para si
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-neutral-500 md:text-xl">
                  Na Brave Fashion, cada cliente é única. A Paula conhece o seu estilo,
                  os seus gostos e as ocasiões especiais da sua vida — e é com esse
                  conhecimento que a acompanha em cada escolha.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-neutral-500 md:text-xl">
                  Não é como nas lojas de fast fashion. Aqui há tempo para experimentar
                  com calma, para receber uma opinião honesta, e para sair com a certeza
                  de que escolheu bem.
                </p>

                <Link
                  href="/marcacoes"
                  className="mt-10 inline-flex items-center gap-3 rounded-[6px] bg-[#B76E2B] px-8 py-4 font-serif text-lg text-white transition hover:bg-[#9d5e24]"
                >
                  Marcar uma visita
                  <span aria-hidden="true" style={{ fontSize: "20px" }}>→</span>
                </Link>
              </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.15}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {[
                  {
                    icon: "✦",
                    title: "Conhece o seu estilo",
                    desc: "A Paula acompanha as suas clientes ao longo do tempo e contacta-as quando chegam peças que sabe que vão gostar.",
                  },
                  {
                    icon: "✦",
                    title: "Ajuda para eventos especiais",
                    desc: "Casamento, batizado, formatura ou qualquer ocasião importante — juntas encontram o look perfeito para o momento.",
                  },
                  {
                    icon: "✦",
                    title: "Experimenta com calma",
                    desc: "Venha à loja sem pressa, experimente as peças e receba uma opinião sincera de quem a conhece.",
                  },
                  {
                    icon: "✦",
                    title: "Um toque pessoal",
                    desc: "Mais do que vender roupa, a Brave Fashion cria uma relação de confiança com cada cliente.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[6px] border border-[#e7d9cf] bg-white p-6"
                  >
                    <span className="text-[#B76E2B]">{item.icon}</span>
                    <h3 className="mt-3 font-serif text-xl text-neutral-900">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-7 text-neutral-500">{item.desc}</p>
                  </div>
                ))}
              </div>
              </FadeIn>
            </div>
          </section>

          <section>
            <FadeIn>
            <div className="mb-10 mt-20 text-center">
              <h2 className="font-serif text-4xl font-medium tracking-tight text-neutral-900 md:text-6xl">
                Segue a Brave Fashion
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-500 md:text-2xl">
                Inspiração, novidades e looks nas redes sociais.
              </p>
            </div>
            </FadeIn>

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

