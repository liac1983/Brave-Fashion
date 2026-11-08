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
        'Serve para qualquer peça, esteja ou não em promoção. ' +
        'Desligado, a peça continua a mostrar o botão de WhatsApp. ' +
        'Quando a última unidade for vendida, o site desliga isto sozinho.',
    }),
    defineField({
      name: 'variantes',
      title: 'Cores, tamanhos e quantidades',
      type: 'array',
      description:
        'Uma linha por cada combinação que tens: por exemplo "Azul · M · 2" e "Azul · L · 1". ' +
        'A cor e o tamanho são opcionais — preenche só o que a peça tiver. ' +
        'Cada venda no site desce a quantidade sozinha, e a combinação deixa de aparecer à cliente quando chega a zero. ' +
        'Deixa vazio se a peça é única: o site vende-a como uma só e retira-a do site quando for paga.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'variante',
          title: 'Variante',
          fields: [
            defineField({
              name: 'cor',
              title: 'Cor',
              type: 'string',
              description: 'Escreve sempre da mesma maneira (ex.: "Azul") — é o que a cliente vê para escolher.',
            }),
            defineField({
              name: 'tamanho',
              title: 'Tamanho',
              type: 'string',
              options: { list: TAMANHOS },
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
            select: { cor: 'cor', tamanho: 'tamanho', stock: 'stock' },
            prepare({ cor, tamanho, stock }) {
              const quantidade = typeof stock === 'number' ? stock : 0
              const nome = [cor, tamanho].filter(Boolean).join(' · ')
              return {
                title: nome || 'Sem cor nem tamanho',
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
        Rule.custom((variantes) => {
          if (!Array.isArray(variantes) || variantes.length === 0) return true

          const linhas = variantes as { cor?: string; tamanho?: string }[]
          const limpo = (valor?: string) => (valor ?? '').trim()

          // Misturar linhas com e sem cor deixa a cliente sem saber o que
          // escolher: "Azul" ou "nenhuma"? O mesmo para o tamanho.
          const comCor = linhas.filter((linha) => limpo(linha.cor)).length
          if (comCor > 0 && comCor < linhas.length) {
            return 'Se uma linha tem cor, todas têm de ter. Preenche a cor que falta.'
          }

          const comTamanho = linhas.filter((linha) => linha.tamanho).length
          if (comTamanho > 0 && comTamanho < linhas.length) {
            return 'Se uma linha tem tamanho, todas têm de ter. Preenche o tamanho que falta.'
          }

          if (linhas.length > 1 && comCor === 0 && comTamanho === 0) {
            return 'Sem cor nem tamanho basta uma linha, com a quantidade total.'
          }

          const vistas = new Set<string>()
          for (const linha of linhas) {
            const chave = `${limpo(linha.cor).toLowerCase()}|${linha.tamanho ?? ''}`
            if (vistas.has(chave)) {
              const nome = [limpo(linha.cor), linha.tamanho].filter(Boolean).join(' · ')
              return `A combinação ${nome} está na lista duas vezes. Junta as quantidades numa só linha.`
            }
            vistas.add(chave)
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
      variantes: 'variantes',
    },
    prepare({ title, media, price, variantes }) {
      const linhas: { stock?: number }[] = Array.isArray(variantes) ? variantes : []

      const unidades = linhas.reduce((total, linha) => total + Math.max(0, linha.stock ?? 0), 0)

      const resumo =
        linhas.length === 0
          ? ''
          : unidades === 0
            ? '  ·  esgotado'
            : `  ·  ${unidades} ${unidades === 1 ? 'unidade' : 'unidades'}`

      return {
        title,
        subtitle: `${price ? `€${price}` : ''}${resumo}`,
        media,
      }
    },
  },
})
