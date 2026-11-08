import { createElement } from 'react'
import type { StructureResolver } from 'sanity/structure'

/**
 * As vendas não vivem no Sanity (trazem dados das clientes e o Sanity é de
 * leitura pública): vivem no Stripe e veem-se em /vendas. Isto é só o atalho.
 */
function AtalhoVendas() {
  return createElement(
    'div',
    { style: { padding: 24, fontFamily: 'inherit', lineHeight: 1.6 } },
    createElement('p', null, 'As vendas do site, com os dados para passar as faturas, estão numa página própria.'),
    createElement(
      'a',
      { href: '/vendas', target: '_blank', rel: 'noreferrer', style: { color: '#B76E2B', fontWeight: 600 } },
      'Abrir as vendas do site →'
    )
  )
}

/**
 * Menu do Studio.
 *
 * "À venda online" é a lista das peças que o site pode cobrar sozinho — serve
 * para a Paula ver de relance o que está exposto à venda.
 *
 * "Esgotados" apanha o caso contrário: peças que continuam ligadas à venda mas
 * já não têm unidade nenhuma em nenhuma cor nem tamanho. O site deixa de as
 * vender sozinho, mas é aqui que ela as vê para repor quantidades ou desligar
 * a venda.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      S.listItem()
        .title('Vendas do site')
        .child(S.component(AtalhoVendas).title('Vendas do site')),

      S.divider(),

      S.listItem()
        .title('Produtos')
        .child(S.documentTypeList('product').title('Produtos')),

      S.listItem()
        .title('À venda online')
        .child(
          S.documentList()
            .title('À venda online')
            .filter('_type == "product" && venderOnline == true')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      S.listItem()
        .title('Esgotados')
        .child(
          S.documentList()
            .title('Esgotados')
            .filter(
              '_type == "product" && count(variantes) > 0 && count(variantes[stock > 0]) == 0'
            )
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      S.divider(),

      S.listItem()
        .title('Coleções')
        .child(S.documentTypeList('collection').title('Coleções')),

      S.listItem()
        .title('Página inicial')
        .child(S.documentTypeList('homepage').title('Página inicial')),

      S.listItem()
        .title('Páginas legais')
        .child(S.documentTypeList('legalPage').title('Páginas legais')),

      S.divider(),

      // Dados das clientes — escritos pelo site, não para edição manual.
      S.listItem()
        .title('Favoritos das clientes')
        .child(S.documentTypeList('userFavorites').title('Favoritos das clientes')),

      S.listItem()
        .title('Listas das clientes')
        .child(S.documentTypeList('userList').title('Listas das clientes')),
    ])
