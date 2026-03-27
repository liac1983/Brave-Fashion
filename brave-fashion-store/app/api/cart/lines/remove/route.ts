import { NextRequest, NextResponse } from "next/server";
import { removeCartLines } from "@/lib/shopify/cart";

export async function POST(request: NextRequest) {
  const { cartId, lineIds } = await request.json();
  const cart = await removeCartLines(cartId, lineIds);
  return NextResponse.json({ cart });
}

