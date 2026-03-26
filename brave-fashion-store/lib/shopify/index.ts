import { shopifyFetch } from "./client";
import {
  COLLECTION_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
} from "./queries";
import type {
  CollectionByHandleQueryResponse,
  CollectionsQueryResponse,
  ProductByHandleQueryResponse,
  ProductsQueryResponse,
} from "./types";

export async function getCollections(first = 12) {
  const data = await shopifyFetch<{
    collections: {
      edges: { node: any }[];
    };
  }>({
    query: COLLECTIONS_QUERY,
    variables: { first },
  });

  return data.collections.edges.map((edge) => edge.node);
}

export async function getProducts(first = 12) {
  const data = await shopifyFetch<ProductsQueryResponse>({
    query: PRODUCTS_QUERY,
    variables: { first },
  });

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<ProductByHandleQueryResponse>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  return data.product;
}

export async function getCollectionByHandle(handle: string, first = 12) {
  const data = await shopifyFetch<CollectionByHandleQueryResponse>({
    query: COLLECTION_BY_HANDLE_QUERY,
    variables: { handle, first },
  });

  return data.collection;
}