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
  available,
  originalPrice,
  venderOnline,
  "variantes": variantes[] {
    "key": _key,
    cor,
    tamanho,
    stock
  },
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

/**
 * Só as coleções que já têm peças a sério.
 *
 * Uma coleção vazia aparecia na homepage com foto e tudo e levava a uma página
 * sem nada — o único beco sem saída do site.
 *
 * Contam-se as referências que *resolvem*, não as linhas da lista: uma linha
 * acrescentada no Studio e deixada sem peça escolhida, ou a apontar para uma
 * peça já apagada, conta como zero. Contar linhas deixava passar exactamente
 * o caso que se queria evitar.
 */
export const COLLECTIONS_QUERY = groq`
  *[_type == "collection" && count(products[defined(@->_id)]) > 0] | order(_createdAt desc) [0...$limit] {
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

export const PROMOTIONS_QUERY = groq`
  *[_type == "product" && available == true && defined(originalPrice) && originalPrice > price] | order(_createdAt desc) {
    ${productFields}
  }
`

/** As últimas peças a entrar no Studio — ver NOVIDADES_A_MOSTRAR. */
export const NEW_PRODUCTS_QUERY = groq`
  *[_type == "product" && available == true] | order(_createdAt desc) [0...$limit] {
    ${productFields}
  }
`

export const HOMEPAGE_QUERY = groq`
  *[_type == "homepage"][0] {
    "slides": slides[] {
      "key": _key,
      tipo,
      titulo,
      subtitulo,
      mostrarBotao,
      fundo,
      "imagem": imagem {
        ${imageFields}
      },
      "logo": logo {
        ${imageFields}
      }
    },
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
