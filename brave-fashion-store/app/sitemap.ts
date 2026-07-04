import type { MetadataRoute } from "next";
import { getProducts, getCollections } from "@/lib/sanity";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bravefashionbypaulavalente.com";

// Páginas estáticas públicas
const staticRoutes = [
  "",
  "/sobre-nos",
  "/produtos",
  "/novidades",
  "/promocoes",
  "/marcacoes",
  "/colecoes",
  "/contactos",
  "/arranjos",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  // Produtos e coleções (dinâmico). Protegido para o build não falhar
  // se o Sanity estiver indisponível no momento da geração.
  let productEntries: MetadataRoute.Sitemap = [];
  let collectionEntries: MetadataRoute.Sitemap = [];

  try {
    const products = await getProducts(200);
    productEntries = products.map((product) => ({
      url: `${siteUrl}/produtos/${product.handle}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // ignora — sitemap fica com as rotas estáticas
  }

  try {
    const collections = await getCollections(100);
    collectionEntries = collections.map((collection) => ({
      url: `${siteUrl}/colecao/${collection.handle}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // ignora
  }

  return [...staticEntries, ...productEntries, ...collectionEntries];
}
