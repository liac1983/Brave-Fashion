import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Tamanhos oferecidos na lista.
 *
 * É uma lista fechada de propósito: escrito à mão, "m" e "M" seriam dois
 * tamanhos diferentes para o site e a cliente veria o mesmo tamanho duas
 * vezes na página da peça.
 */
const TAMANHOS = [
  'Único',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '34',
  '36',
  '38',
  '40',
  '42',
  '44',
  '46',
  '48',
]

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
      name: 'tamanhos',
      title: 'Tamanhos e quantidades',
      type: 'array',
      description:
        'Só para peças que existem em mais do que um tamanho. Escolhe o tamanho e quantas tens de cada. ' +
        'Cada venda no site desce a quantidade sozinha, e o tamanho deixa de aparecer à cliente quando chega a zero. ' +
        'Deixa vazio se a peça é única: o site vende-a como uma só e retira-a do site quando for paga.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tamanhoStock',
          title: 'Tamanho',
          fields: [
            defineField({
              name: 'tamanho',
              title: 'Tamanho',
              type: 'string',
              options: { list: TAMANHOS },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'stock',
              title: 'Quantidade',
              type: 'number',
              initialValue: 1,
              validation: (Rule) => Rule.required().min(0).integer(),
            }),
          ],
          preview: {
            select: { tamanho: 'tamanho', stock: 'stock' },
            prepare({ tamanho, stock }) {
              const quantidade = typeof stock === 'number' ? stock : 0
              return {
                title: tamanho || 'sem tamanho',
                subtitle:
                  quantidade > 0
                    ? `${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'}`
                    : 'esgotado',
              }
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((tamanhos) => {
          if (!Array.isArray(tamanhos)) return true

          const vistos = new Set<string>()

          for (const linha of tamanhos) {
            const nome = (linha as { tamanho?: string } | null)?.tamanho
            if (!nome) continue
            if (vistos.has(nome)) {
              return `O tamanho ${nome} está na lista duas vezes. Junta as quantidades numa só linha.`
            }
            vistos.add(nome)
          }

          return true
        }),
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
      tamanhos: 'tamanhos',
    },
    prepare({ title, media, price, tamanhos }) {
      const linhas: { tamanho?: string; stock?: number }[] = Array.isArray(tamanhos)
        ? tamanhos
        : []

      const comStock = linhas.filter((linha) => (linha.stock ?? 0) > 0)

      const resumo =
        linhas.length === 0
          ? ''
          : comStock.length === 0
            ? '  ·  tamanhos esgotados'
            : `  ·  ${comStock.map((linha) => linha.tamanho).join(', ')}`

      return {
        title,
        subtitle: `${price ? `€${price}` : ''}${resumo}`,
        media,
      }
    },
  },
})
