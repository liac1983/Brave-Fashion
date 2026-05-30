import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { collection } from './collection'
import { userFavorites } from './userFavorites'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, collection, userFavorites],
}
