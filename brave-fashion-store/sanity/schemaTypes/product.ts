import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Produto',
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
      name: 'price',
      title: 'Preço (€)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Preço Original (antes da promoção)',
      type: 'number',
      description:
        'O preço antigo, mais alto. Preenche isto e baixa o Preço acima — o site calcula a percentagem, risca o valor antigo e põe a peça nas Promoções. Para acabar a promoção, apaga este campo.',
    }),
    defineField({
      name: 'venderOnline',
      title: 'À venda online',
      type: 'boolean',
      initialValue: false,
      description:
        'Liga para esta peça poder ser comprada e paga no site. ' +
        'Desligado, a peça continua a mostrar o botão de WhatsApp. ' +
        'Quando a peça for vendida, o site desliga isto sozinho.',
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'images',
      title: 'Imagens',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
    }),
    defineField({
      name: 'isNew',
      title: 'Novidade',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'available',
      title: 'Disponível',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      price: 'price',
    },
    prepare({ title, media, price }) {
      return {
        title,
        subtitle: price ? `€${price}` : '',
        media,
      }
    },
  },
})
