import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import { groq } from 'next-sanity'

const LISTS_QUERY = groq`
  *[_type == "userList" && userId == $userId] | order(_createdAt asc) {
    "_id": _id,
    name,
    "products": products[]-> {
      "_id": _id,
      title,
      "handle": slug.current,
      "image": images[0] { "url": asset->url, "altText": alt }
    }
  }
`

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ lists: [] })

  const lists = await client.fetch(LISTS_QUERY, { userId })
  return NextResponse.json({ lists: lists ?? [] })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

  const doc = await writeClient.create({
    _type: 'userList',
    userId,
    name: name.trim(),
    products: [],
  })

  return NextResponse.json({ id: doc._id, name: doc.name })
}
