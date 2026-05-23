import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { collection } from './collection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, collection],
}
