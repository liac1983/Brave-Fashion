import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Página inicial.
 *
 * O topo da página é um carrossel: cada slide é ou o logótipo em grande, ou
 * uma fotografia com título e subtítulo. A Paula acrescenta, tira e reordena
 * slides arrastando-os no Studio.
 *
 * Os campos antigos (imagem, título e subtítulo do hero) ficam: enquanto o
 * carrossel estiver vazio, o site mostra o logótipo e essa imagem, como antes.
 */
export const homepage = defineType({
  name: 'homepage',
  title: 'Página Inicial',
  type: 'document',
  fields: [
    defineField({
      name: 'slides',
      title: 'Carrossel do topo',
      type: 'array',
      description:
        'Os slides que passam no topo da página inicial, por esta ordem. Arrasta para mudar a ordem. ' +
        'Podes ter quantos quiseres; com um só, não roda.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'slide',
          title: 'Slide',
          fields: [
            defineField({
              name: 'tipo',
              title: 'Tipo de slide',
              type: 'string',
              initialValue: 'imagem',
              options: {
                list: [
                  { title: 'Fotografia com texto', value: 'imagem' },
                  { title: 'Logótipo em grande', value: 'logo' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'imagem',
              title: 'Fotografia',
              type: 'image',
              options: { hotspot: true },
              description: 'Arrasta o círculo para o que tem de ficar sempre visível (o recorte muda entre telemóvel e computador).',
              hidden: ({ parent }) => parent?.tipo === 'logo',
              validation: (Rule) =>
                Rule.custom((imagem, context) => {
                  const tipo = (context.parent as { tipo?: string } | undefined)?.tipo
                  return tipo !== 'logo' && !imagem ? 'Escolhe a fotografia do slide.' : true
                }),
            }),
            defineField({
              name: 'titulo',
              title: 'Título',
              type: 'string',
              hidden: ({ parent }) => parent?.tipo === 'logo',
            }),
            defineField({
              name: 'subtitulo',
              title: 'Subtítulo',
              type: 'string',
              hidden: ({ parent }) => parent?.tipo === 'logo',
            }),
            defineField({
              name: 'mostrarBotao',
              title: 'Mostrar o botão "Explorar Loja"',
              type: 'boolean',
              initialValue: true,
              hidden: ({ parent }) => parent?.tipo === 'logo',
            }),
            defineField({
              name: 'fundo',
              title: 'Cor de fundo',
              type: 'string',
              initialValue: 'bege',
              options: {
                list: [
                  { title: 'Bege', value: 'bege' },
                  { title: 'Branco', value: 'branco' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              hidden: ({ parent }) => parent?.tipo !== 'logo',
            }),
            defineField({
              name: 'logo',
              title: 'Outro logótipo (opcional)',
              type: 'image',
              description: 'Deixa vazio para usar o logótipo da loja.',
              hidden: ({ parent }) => parent?.tipo !== 'logo',
            }),
          ],
          preview: {
            select: { tipo: 'tipo', titulo: 'titulo', imagem: 'imagem', logo: 'logo', fundo: 'fundo' },
            prepare({ tipo, titulo, imagem, logo, fundo }) {
              if (tipo === 'logo') {
                return {
                  title: 'Logótipo em grande',
                  subtitle: fundo === 'branco' ? 'fundo branco' : 'fundo bege',
                  media: logo,
                }
              }
              return { title: titulo || 'Fotografia sem título', subtitle: 'Fotografia', media: imagem }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagem do Hero (antiga)',
      type: 'image',
      options: { hotspot: true },
      description: 'Só é usada se o carrossel acima estiver vazio.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título do Hero (antigo)',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo do Hero (antigo)',
      type: 'string',
    }),
  ],
  preview: {
    select: { media: 'slides.0.imagem', fallback: 'heroImage' },
    prepare({ media, fallback }) {
      return { title: 'Página Inicial', media: media ?? fallback }
    },
  },
})
