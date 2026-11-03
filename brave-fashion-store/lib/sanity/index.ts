import { client } from '@/sanity/lib/client'
import {
  COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  NEW_PRODUCTS_QUERY,
  HOMEPAGE_QUERY,
  LEGAL_PAGE_QUERY,
} from './queries'
import type { Product, Collection, Homepage, LegalPage } from './types'
import type { Tamanho } from '@/lib/shop'

/** Linha do campo "Tamanhos e quantidades" como vem do Sanity. */
type RawTamanho = { key?: string; label?: string; stock?: number }

/**
 * Linhas sem tamanho ou sem chave são descartadas: aconteceria se a Paula
 * acrescentasse uma linha no Studio e saísse antes de a preencher, e um
 * tamanho sem nome não é escolha nenhuma para quem está a comprar.
 */
function mapTamanhos(raw: unknown): Tamanho[] {
  if (!Array.isArray(raw)) return []

  return (raw as RawTamanho[])
    .filter(
      (linha): linha is RawTamanho & { key: string; label: string } =>
        Boolean(linha?.key && linha?.label),
    )
    .map((linha) => ({
      key: linha.key,
      label: linha.label,
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
    tamanhos: mapTamanhos(raw.tamanhos),
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

export async function getHomepage(): Promise<Homepage> {
  const raw = await client.fetch(HOMEPAGE_QUERY)
  return {
    heroImage: raw?.heroImage ?? null,
    heroTitle: raw?.heroTitle ?? null,
    heroSubtitle: raw?.heroSubtitle ?? null,
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
