import { shopifyFetch } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "./queries";
import type {
  Cart,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesRemoveResponse,
  CartLinesUpdateResponse,
  CartQueryResponse,
} from "./types";

function assertCart<T extends { cart: Cart | null; userErrors: { message: string }[] }>(
  payload: T
) {
  if (payload.userErrors?.length) {
    throw new Error(payload.userErrors.map((e) => e.message).join(", "));
  }

  if (!payload.cart) {
    throw new Error("Carrinho não encontrado.");
  }

  return payload.cart;
}

export async function createCart(variantId?: string, quantity = 1) {
  const lines = variantId
    ? [{ merchandiseId: variantId, quantity }]
    : [];

  const data = await shopifyFetch<CartCreateResponse>({
    query: CART_CREATE_MUTATION,
    variables: { lines },
  });

  return assertCart(data.cartCreate);
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch<CartQueryResponse>({
    query: CART_QUERY,
    variables: { id: cartId },
  });

  return data.cart;
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
) {
  const data = await shopifyFetch<CartLinesAddResponse>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
  });

  return assertCart(data.cartLinesAdd);
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
) {
  const data = await shopifyFetch<CartLinesUpdateResponse>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
  });

  return assertCart(data.cartLinesUpdate);
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<CartLinesRemoveResponse>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
  });

  return assertCart(data.cartLinesRemove);
}

