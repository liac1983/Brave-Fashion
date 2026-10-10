import type { StructureResolver } from 'sanity/structure'

/**
 * Menu do Studio.
 *
 * O item "À venda online" existe para a Paula ver de relance que peças estão
 * à venda no site. Como a maioria das peças é de unidade única, quando uma sai
 * da loja o link tem de ser apagado — e essa lista é onde isso se confirma.
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
            .filter('_type == "product" && defined(linkPagamento)')
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
