import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const { productId, action } = await req.json()

  const list = await client.fetch(
    groq`*[_type == "userList" && _id == $id && userId == $userId][0]{ _id }`,
    { id, userId }
  )
  if (!list) return NextResponse.json({ error: 'Lista não encontrada' }, { status: 404 })

  if (action === 'add') {
    // Remove primeiro para evitar duplicados, depois adiciona
    await writeClient
      .patch(id)
      .setIfMissing({ products: [] })
      .unset([`products[_ref == "${productId}"]`])
      .commit()
    await writeClient
      .patch(id)
      .append('products', [{ _type: 'reference', _ref: productId }])
      .commit()
  } else {
    await writeClient
      .patch(id)
      .unset([`products[_ref == "${productId}"]`])
      .commit()
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params

  const list = await client.fetch(
    groq`*[_type == "userList" && _id == $id && userId == $userId][0]{ _id }`,
    { id, userId }
  )
  if (!list) return NextResponse.json({ error: 'Lista não encontrada' }, { status: 404 })

  await writeClient.delete(id)
  return NextResponse.json({ ok: true })
}
