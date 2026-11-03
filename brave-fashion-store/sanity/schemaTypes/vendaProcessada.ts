import { defineField, defineType } from 'sanity'

/**
 * Marca de que uma venda já desceu o stock.
 *
 * O Stripe repete o aviso de pagamento sempre que não recebe resposta — e nós
 * próprios pedimos essa repetição quando o email da venda falha, porque um
 * email repetido é melhor do que uma venda que ninguém viu. Só que descer o
 * stock não é uma operação que se possa repetir: à segunda, roubava uma
 * unidade que ninguém comprou.
 *
 * Daí este documento. O `_id` é derivado da referência do pagamento, e o
 * Sanity recusa criar dois documentos com o mesmo `_id` — por isso quem
 * consegue criá-lo é, garantidamente, o primeiro a tratar daquela venda.
 *
 * Guarda-se só uma impressão digital do pagamento: nem a referência do
 * Stripe, nem nada da cliente. O conjunto de dados é de leitura pública e a
 * encomenda vive no Stripe, que é onde tem de viver.
 *
 * Fica fora do menu do Studio porque não é conteúdo — é contabilidade interna
 * do site.
 */
export const vendaProcessada = defineType({
  name: 'vendaProcessada',
  title: 'Venda já contabilizada',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({
      name: 'quando',
      title: 'Quando',
      type: 'datetime',
    }),
    defineField({
      name: 'produto',
      title: 'Produto',
      type: 'string',
    }),
    defineField({
      name: 'tamanho',
      title: 'Tamanho',
      type: 'string',
    }),
  ],
  preview: {
    select: { produto: 'produto', tamanho: 'tamanho', quando: 'quando' },
    prepare({ produto, tamanho, quando }) {
      return {
        title: [produto, tamanho].filter(Boolean).join(' · ') || 'venda',
        subtitle: quando ?? '',
      }
    },
  },
})
