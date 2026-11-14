/**
 * As categorias das peças.
 *
 * Isto era texto livre, e com texto livre "Malha", "MALHA " e "malha" são três
 * categorias diferentes para o site. Chegou a haver doze valores para vinte e
 * três peças — filtros a dobrar para a mesma coisa, e peças que desapareciam da
 * sua própria categoria. Uma lista fechada torna isso impossível.
 *
 * A ordem aqui é a ordem por que os filtros aparecem na loja, e é propositada:
 * primeiro o que a Paula mais vende. Não é alfabética.
 *
 * A lista pode ser generosa sem custo nenhum: a loja só mostra as categorias
 * que têm peças, por isso uma categoria a mais não enche o filtro de entradas
 * vazias. Acrescentar uma é escrever mais uma linha aqui.
 */
export const CATEGORIAS = [
  'Vestidos',
  'Malhas',
  'Casacos',
  'Blusões',
  'Gabardinas',
  'Camisas e blusas',
  'Calças',
  'Saias',
  'T-shirts',
  'Coletes',
  'Conjuntos',
  'Acessórios',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/**
 * Ordena categorias pela ordem da lista acima.
 *
 * O que vier de fora da lista — uma peça antiga ainda por arrumar — vai para o
 * fim em vez de desaparecer: é preferível uma categoria estranha no filtro a
 * uma peça que deixa de ser encontrada.
 */
export function ordenarCategorias(categorias: string[]) {
  const posicao = (categoria: string) => {
    const indice = CATEGORIAS.indexOf(categoria as Categoria);
    return indice === -1 ? CATEGORIAS.length : indice;
  };

  return [...categorias].sort(
    (a, b) => posicao(a) - posicao(b) || a.localeCompare(b, 'pt')
  );
}
