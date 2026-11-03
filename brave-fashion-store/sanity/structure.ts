import type { StructureResolver } from 'sanity/structure'

/**
 * Menu do Studio.
 *
 * "À venda online" é a lista das peças que o site pode cobrar sozinho — serve
 * para a Paula ver de relance o que está exposto à venda.
 *
 * "Tamanhos esgotados" apanha o caso contrário: peças que continuam ligadas à
 * venda mas já não têm unidade nenhuma em nenhum tamanho. O site deixa de as
 * vender sozinho, mas é aqui que ela as vê para repor quantidades ou desligar
 * a venda.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
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
        .title('Tamanhos esgotados')
        .child(
          S.documentList()
            .title('Tamanhos esgotados')
            .filter(
              '_type == "product" && count(tamanhos) > 0 && count(tamanhos[stock > 0]) == 0'
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
