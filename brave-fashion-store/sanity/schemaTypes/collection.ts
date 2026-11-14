import { defineField, defineType } from 'sanity'

export const collection = defineType({
  name: 'collection',
  title: 'Coleção',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'products',
      title: 'Produtos',
      type: 'array',
      description:
        'As peças desta coleção. Enquanto estiver vazia, a coleção não aparece na loja — ' +
        'é o que evita mandar a cliente para uma página sem nada.',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', produtos: 'products' },
    prepare({ title, media, produtos }) {
      const total = Array.isArray(produtos) ? produtos.length : 0

      return {
        title,
        subtitle:
          total === 0
            ? 'vazia — não aparece na loja'
            : `${total} ${total === 1 ? 'peça' : 'peças'}`,
        media,
      }
    },
  },
})
