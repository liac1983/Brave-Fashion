import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import { groq } from 'next-sanity'

const FAVORITES_QUERY = groq`
  *[_type == "userFavorites" && userId == $userId][0] {
    _id,
    "products": products[]-> {
      "_id": _id,
      title,
      "handle": slug.current,
      "image": images[0] {
        "url": asset->url,
        "altText": alt
      }
    }
  }
`

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ products: [] })

  const data = await client.fetch(FAVORITES_QUERY, { userId })
  return NextResponse.json({ products: data?.products ?? [] })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { productId, action } = await req.json()

  const existing = await client.fetch(
    groq`*[_type == "userFavorites" && userId == $userId][0]{ _id }`,
    { userId }
  )

  if (!existing) {
    if (action === 'add') {
      await writeClient.create({
        _type: 'userFavorites',
        userId,
        products: [{ _type: 'reference', _ref: productId }],
      })
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'add') {
    await writeClient
      .patch(existing._id)
      .setIfMissing({ products: [] })
      .append('products', [{ _type: 'reference', _ref: productId }])
      .commit()
  } else {
    await writeClient
      .patch(existing._id)
      .unset([`products[_ref == "${productId}"]`])
      .commit()
  }

  return NextResponse.json({ ok: true })
}
