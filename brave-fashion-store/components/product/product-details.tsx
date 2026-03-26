"use client";

import { useState } from "react";
import Image from "next/image";
import VariantSelector from "@/components/product/variant-selector";
import type { Product, ProductVariant, ShopifyImage } from "@/lib/shopify/types";

type ProductDetailsProps = {
  product: Product;
  variants: ProductVariant[];
};

export default function ProductDetails({
  product,
  variants,
}: ProductDetailsProps) {
  const initialImage: ShopifyImage | null =
    variants[0]?.image || product.featuredImage || null;

  const [selectedImage, setSelectedImage] = useState<ShopifyImage | null>(
    initialImage
  );

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        {selectedImage ? (
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-neutral-100">
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[3/4] items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400">
            Sem imagem
          </div>
        )}
      </div>

      <div className="h-fit lg:sticky lg:top-24">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Brave Fashion
        </p>

        <h1 className="mt-3 text-4xl font-semibold">{product.title}</h1>

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Tamanhos
          </h2>

          {variants.length > 0 ? (
            <VariantSelector
              product={{
                id: product.id,
                handle: product.handle,
                title: product.title,
                featuredImage: product.featuredImage,
              }}
              variants={variants}
              onVariantChange={(variant) => {
                setSelectedImage(variant.image || product.featuredImage || null);
              }}
            />
          ) : (
            <>
              <p className="text-2xl text-neutral-800">
                {product.priceRange.minVariantPrice.amount}{" "}
                {product.priceRange.minVariantPrice.currencyCode}
              </p>

              <button
                type="button"
                disabled
                className="mt-6 rounded-full bg-neutral-300 px-6 py-3 text-sm text-white"
              >
                Indisponível
              </button>
            </>
          )}
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-medium">Descrição</h2>
          <p className="mt-4 leading-7 text-neutral-600">
            {product.description || "Descrição em atualização."}
          </p>
        </div>
      </div>
    </div>
  );
}
