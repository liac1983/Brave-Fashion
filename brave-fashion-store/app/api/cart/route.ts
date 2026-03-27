import { NextRequest, NextResponse } from "next/server";
import { getCart } from "@/lib/shopify/cart";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ cart: null }, { status: 400 });
  }

  const cart = await getCart(id);
  return NextResponse.json({ cart });
}

