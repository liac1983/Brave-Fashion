import { client } from '@/sanity/lib/client'
import {
  COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  NEW_PRODUCTS_QUERY,
} from './queries'
import type { Product, Collection } from './types'

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
