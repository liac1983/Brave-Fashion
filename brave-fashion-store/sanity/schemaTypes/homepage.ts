import { defineField, defineType } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Página Inicial',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Imagem do Hero',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título do Hero',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo do Hero',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'heroTitle', media: 'heroImage' },
    prepare({ title, media }) {
      return { title: title ?? 'Página Inicial', media }
    },
  },
})
