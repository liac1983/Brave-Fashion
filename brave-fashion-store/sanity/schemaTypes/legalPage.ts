import { defineField, defineType } from 'sanity'

/**
 * Textos legais (termos, devoluções, privacidade).
 *
 * Vivem no Sanity e não no código de propósito: depois da revisão da
 * contabilista as correções entram pelo Studio, sem precisar de programador
 * nem de novo deploy. É texto que muda — e muda sem aviso.
 */
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Página legal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço',
      type: 'slug',
      description:
        'Tem de corresponder ao endereço da página: termos-e-condicoes, devolucoes ou privacidade.',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introdução',
      type: 'text',
      rows: 3,
      description: 'Uma ou duas frases por baixo do título. Opcional.',
    }),
    defineField({
      name: 'content',
      title: 'Texto',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Parágrafo', value: 'normal' },
            { title: 'Secção', value: 'h2' },
            { title: 'Subsecção', value: 'h3' },
          ],
          lists: [
            { title: 'Lista', value: 'bullet' },
            { title: 'Lista numerada', value: 'number' },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Última atualização',
      type: 'date',
      description: 'Mostrada no fim da página. Atualizar sempre que o texto mudar.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviewed',
      title: 'Revisto por profissional',
      type: 'boolean',
      initialValue: false,
      description:
        'Deixar desligado enquanto o texto não for validado. Com isto desligado, a página mostra um aviso de rascunho.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current', reviewed: 'reviewed' },
    prepare({ title, subtitle, reviewed }) {
      return {
        title,
        subtitle: `/${subtitle ?? ''}${reviewed ? '' : '  ·  POR REVER'}`,
      }
    },
  },
})
