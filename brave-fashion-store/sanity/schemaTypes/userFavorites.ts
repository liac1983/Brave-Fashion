import { defineField, defineType } from 'sanity'

export const userFavorites = defineType({
  name: 'userFavorites',
  title: 'Favoritos do Utilizador',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'ID do Utilizador (Clerk)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'products',
      title: 'Produtos Favoritos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
  ],
  preview: {
    select: { title: 'userId' },
  },
})
