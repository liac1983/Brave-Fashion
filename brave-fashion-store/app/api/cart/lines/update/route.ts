import { NextRequest, NextResponse } from "next/server";
import { updateCartLines } from "@/lib/shopify/cart";

export async function POST(request: NextRequest) {
  const { cartId, lines } = await request.json();
  const cart = await updateCartLines(cartId, lines);
  return NextResponse.json({ cart });
}

