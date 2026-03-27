import { NextRequest, NextResponse } from "next/server";
import { addCartLines } from "@/lib/shopify/cart";

export async function POST(request: NextRequest) {
  const { cartId, lines } = await request.json();
  const cart = await addCartLines(cartId, lines);
  return NextResponse.json({ cart });
}

