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
      name: 'linkPagamento',
      title: 'Link de pagamento (Stripe)',
      type: 'url',
      description:
        'Cola aqui o Payment Link do Stripe para esta peça ficar à venda online. ' +
        'Deixa vazio e o produto mantém o botão de WhatsApp. ' +
        'Quando a peça for vendida, apaga o link para a retirares da venda.',
      validation: (Rule) =>
        Rule.uri({ scheme: ['https'] }).custom((value) =>
          !value || String(value).includes('stripe.com')
            ? true
            : 'O link deve ser um Payment Link do Stripe (buy.stripe.com).'
        ),
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
      name: 'originalPrice',
      title: 'Preço Original (antes da promoção)',
      type: 'number',
      description: 'Preenche só se o produto estiver em promoção',
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
