import { defineField, defineType } from 'sanity'

export const userList = defineType({
  name: 'userList',
  title: 'Lista do Utilizador',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'ID do Utilizador (Clerk)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nome da Lista',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'products',
      title: 'Produtos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'userId' },
  },
})
