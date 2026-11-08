import { client } from '@/sanity/lib/client'
import {
  COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  NEW_PRODUCTS_QUERY,
  PROMOTIONS_QUERY,
  HOMEPAGE_QUERY,
  LEGAL_PAGE_QUERY,
} from './queries'
import type { Product, Collection, Homepage, HeroSlide, LegalPage, SanityImage } from './types'
import type { Variante } from '@/lib/shop'

/** Linha do campo "Cores, tamanhos e quantidades" como vem do Sanity. */
type RawVariante = { key?: string; cor?: string | null; tamanho?: string | null; stock?: number }

/**
 * Linhas sem chave são descartadas, e a cor é limpa de espaços: escrito à mão,
 * "Azul " e "Azul" seriam duas cores para a cliente escolher.
 */
export function mapVariantes(raw: unknown): Variante[] {
  if (!Array.isArray(raw)) return []

  return (raw as RawVariante[])
    .filter((linha): linha is RawVariante & { key: string } => Boolean(linha?.key))
    .map((linha) => ({
      key: linha.key,
      cor: linha.cor?.trim() || null,
      tamanho: linha.tamanho?.trim() || null,
      stock: typeof linha.stock === 'number' ? linha.stock : 0,
    }))
}

function mapProduct(raw: any): Product {
  const allImages: Product['images']['edges'] = (raw.allImages ?? []).map(
    (img: any) => ({ node: img })
  )

  return {
    id: raw._id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description ?? '',
    category: raw.category ?? null,
    isNew: raw.isNew ?? false,
    available: raw.available ?? true,
    originalPrice: raw.originalPrice ?? null,
    venderOnline: raw.venderOnline ?? false,
    variantes: mapVariantes(raw.variantes),
    featuredImage: raw.featuredImage ?? null,
    images: { edges: allImages },
    priceRange: {
      minVariantPrice: {
        amount: String(raw.price ?? 0),
        currencyCode: 'EUR',
      },
    },
    variants: { edges: [] },
  }
}

export async function getProducts(first = 12): Promise<Product[]> {
  const raw = await client.fetch(PRODUCTS_QUERY, { limit: first - 1 })
  return (raw ?? []).map(mapProduct)
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const raw = await client.fetch(PRODUCT_BY_HANDLE_QUERY, { handle })
  if (!raw) return null
  return mapProduct(raw)
}

export async function getCollections(first = 12): Promise<Collection[]> {
  const raw = await client.fetch(COLLECTIONS_QUERY, { limit: first - 1 })
  return (raw ?? []).map((c: any) => ({
    id: c._id,
    handle: c.handle,
    title: c.title,
    description: c.description ?? '',
    image: c.image ?? null,
  }))
}

export async function getCollectionByHandle(
  handle: string,
): Promise<Collection | null> {
  const col = await client.fetch(COLLECTION_BY_HANDLE_QUERY, { handle })

  if (!col) return null

  return {
    id: col._id,
    handle,
    title: col.title,
    description: col.description ?? '',
    image: col.image ?? null,
    products: {
      edges: (col.products ?? []).map((p: any) => ({ node: mapProduct(p) })),
    },
  }
}

export async function getNewProducts(): Promise<Product[]> {
  const raw = await client.fetch(NEW_PRODUCTS_QUERY)
  return (raw ?? []).map(mapProduct)
}

/** Todas as peças em promoção, sem o limite da listagem geral. */
export async function getPromotions(): Promise<Product[]> {
  const raw = await client.fetch(PROMOTIONS_QUERY)
  return (raw ?? []).map(mapProduct)
}

type RawSlide = {
  key?: string
  tipo?: string
  fundo?: string
  titulo?: string | null
  subtitulo?: string | null
  mostrarBotao?: boolean | null
  imagem?: SanityImage | null
  logo?: SanityImage | null
}

function mapSlide(raw: RawSlide | null): HeroSlide | null {
  if (!raw?.key) return null

  if (raw.tipo === 'logo') {
    return {
      key: raw.key,
      tipo: 'logo',
      fundo: raw.fundo === 'branco' ? 'branco' : 'bege',
      logo: raw.logo?.url ? raw.logo : null,
    }
  }

  // Um slide de fotografia sem fotografia (acabado de criar no Studio) não
  // se mostra: seria um ecrã vazio a rodar.
  if (!raw.imagem?.url) return null

  return {
    key: raw.key,
    tipo: 'imagem',
    imagem: raw.imagem ?? null,
    titulo: raw.titulo ?? null,
    subtitulo: raw.subtitulo ?? null,
    mostrarBotao: raw.mostrarBotao ?? true,
  }
}

export async function getHomepage(): Promise<Homepage> {
  const raw = await client.fetch(HOMEPAGE_QUERY)
  const slides = ((raw?.slides ?? []) as (RawSlide | null)[])
    .map(mapSlide)
    .filter((slide): slide is HeroSlide => slide !== null)

  if (slides.length > 0) return { slides }

  // Carrossel ainda por preencher: o logótipo e o hero de antes.
  return {
    slides: [
      { key: 'logo', tipo: 'logo', fundo: 'bege', logo: null },
      {
        key: 'hero',
        tipo: 'imagem',
        imagem: raw?.heroImage ?? null,
        titulo: raw?.heroTitle ?? 'Nova Coleção',
        subtitulo: raw?.heroSubtitle ?? 'O estilo é criar a própria moda — a diferença está nos pormenores.',
        mostrarBotao: true,
      },
    ],
  }
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  const raw = await client.fetch(LEGAL_PAGE_QUERY, { slug })
  if (!raw) return null

  return {
    title: raw.title,
    intro: raw.intro ?? null,
    content: raw.content ?? [],
    lastUpdated: raw.lastUpdated ?? null,
    reviewed: raw.reviewed ?? false,
  }
}
