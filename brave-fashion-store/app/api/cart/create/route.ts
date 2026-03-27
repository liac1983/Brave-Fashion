import { NextRequest, NextResponse } from "next/server";
import { createCart } from "@/lib/shopify/cart";

export async function POST(request: NextRequest) {
  const { variantId, quantity } = await request.json();
  const cart = await createCart(variantId, quantity ?? 1);
  return NextResponse.json({ cart });
}

