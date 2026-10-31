import { groq } from 'next-sanity'

const imageFields = groq`
  "url": asset->url,
  "altText": alt,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  asset,
  hotspot,
  crop
`

const productFields = groq`
  "_id": _id,
  title,
  "handle": slug.current,
  description,
  price,
  category,
  isNew,
  available,
  originalPrice,
  venderOnline,
  "featuredImage": images[0] {
    ${imageFields}
  },
  "allImages": images[] {
    ${imageFields}
  }
`

export const PRODUCTS_QUERY = groq`
  *[_type == "product" && available == true] | order(_createdAt desc) [0...$limit] {
    ${productFields}
  }
`

export const PRODUCT_BY_HANDLE_QUERY = groq`
  *[_type == "product" && slug.current == $handle][0] {
    ${productFields}
  }
`

export const COLLECTIONS_QUERY = groq`
  *[_type == "collection"] | order(_createdAt desc) [0...$limit] {
    "_id": _id,
    title,
    "handle": slug.current,
    description,
    "image": image {
      ${imageFields}
    }
  }
`

export const COLLECTION_BY_HANDLE_QUERY = groq`
  *[_type == "collection" && slug.current == $handle][0] {
    "_id": _id,
    title,
    "handle": slug.current,
    description,
    "image": image {
      ${imageFields}
    },
    "products": products[]-> {
      ${productFields}
    }
  }
`

export const PRODUCTS_BY_CATEGORY_QUERY = groq`
  *[_type == "product" && available == true && category == $category] | order(_createdAt desc) [0...$limit] {
    ${productFields}
  }
`

export const NEW_PRODUCTS_QUERY = groq`
  *[_type == "product" && available == true && isNew == true] | order(_createdAt desc) {
    ${productFields}
  }
`

export const HOMEPAGE_QUERY = groq`
  *[_type == "homepage"][0] {
    "heroImage": heroImage {
      ${imageFields}
    },
    heroTitle,
    heroSubtitle,
  }
`

export const LEGAL_PAGE_QUERY = groq`
  *[_type == "legalPage" && slug.current == $slug][0] {
    title,
    intro,
    content,
    lastUpdated,
    reviewed
  }
`
