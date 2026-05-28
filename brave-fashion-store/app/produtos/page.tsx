import Link from "next/link";
import { getProducts } from "@/lib/sanity";
import ProductCard from "@/components/product/product-card";
import ProductsSortSelect from "@/components/product/products-sort-select";

type ProdutosPageProps = {
  searchParams?: Promise<{
    categoria?: string;
    ordenar?: string;
  }>;
};

export default async function ProdutosPage({ searchParams }: ProdutosPageProps) {
  const params = (await searchParams) || {};
  const categoria = params.categoria || "todos";
  const ordenar = params.ordenar || "destaques";

  const allProducts = await getProducts(100);

  const uniqueCategories = Array.from(
    new Set(allProducts.map((p) => p.category).filter(Boolean))
  ) as string[];

  const filtered =
    categoria === "todos"
      ? allProducts
      : allProducts.filter((p) => p.category === categoria);

  const sortedProducts = [...filtered];

  if (ordenar === "preco-asc") {
    sortedProducts.sort(
      (a, b) =>
        Number(a.priceRange.minVariantPrice.amount) -
        Number(b.priceRange.minVariantPrice.amount)
    );
  }

  if (ordenar === "preco-desc") {
    sortedProducts.sort(
      (a, b) =>
        Number(b.priceRange.minVariantPrice.amount) -
        Number(a.priceRange.minVariantPrice.amount)
    );
  }

  if (ordenar === "nome") {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  const categories = [
    { label: "Todos", value: "todos" },
    ...uniqueCategories.map((cat) => ({ label: cat, value: cat })),
  ];

  return (
    <section className="bg-[#f7f2ec] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14">
          <h1 className="font-serif text-5xl leading-tight text-neutral-900 md:text-7xl">
            A Nossa Coleção
          </h1>
          <p className="mt-4 text-2xl text-neutral-500">
            {sortedProducts.length} produtos disponíveis
          </p>
        </div>

        <div className="grid gap-14 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div>
              <h2 className="font-serif text-3xl text-neutral-900">Filtros</h2>

              <div className="mt-6 border-t border-[#e7d9cf] pt-8">
                <h3 className="font-serif text-2xl text-neutral-900">
                  Categoria
                </h3>

                <div className="mt-6 space-y-4">
                  {categories.map((item) => {
                    const active = categoria === item.value;
                    return (
                      <Link
                        key={item.value}
                        href={`/produtos?categoria=${item.value}&ordenar=${ordenar}`}
                        className={`block rounded-[6px] px-4 py-4 text-2xl font-medium transition ${
                          active
                            ? "bg-[#B76E2B] text-white"
                            : "text-neutral-900 hover:bg-[#efe4d8]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-14">
                <label
                  htmlFor="ordenar"
                  className="font-serif text-2xl text-neutral-900"
                >
                  Ordenar por
                </label>

                <div className="mt-4">
                  <ProductsSortSelect categoria={categoria} ordenar={ordenar} />
                </div>
              </div>
            </div>
          </aside>

          <div>
            {sortedProducts.length > 0 ? (
              <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    handle={product.handle}
                    image={product.featuredImage}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xl text-neutral-500">
                Não existem produtos nesta categoria.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
