"use client";

import { useState } from "react";
import AddToCartButton from "@/components/cart/add-to-cart-button";

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  image?: {
    url: string;
    altText: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  price: {
    amount: string;
    currencyCode: string;
  };
};

type VariantSelectorProps = {
  product: {
    id: string;
    handle: string;
    title: string;
    featuredImage?: {
      url: string;
      altText: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
  };
  variants: Variant[];
  onVariantChange?: (variant: Variant) => void;
};

export default function VariantSelector({
  product,
  variants,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants[0] || null
  );

  const handleSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    onVariantChange?.(variant);
  };

  return (
    <div className="space-y-6">
      {selectedVariant && (
        <p className="text-2xl font-semibold text-neutral-900">
          {selectedVariant.price.amount} {selectedVariant.price.currencyCode}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleSelect(variant)}
              disabled={!variant.availableForSale}
              className={`min-w-[64px] rounded-full border px-6 py-3 text-center text-sm font-medium transition ${
                isSelected
                  ? "border-black bg-black text-white shadow-sm"
                  : "border-neutral-300 hover:bg-neutral-100"
              } ${
                !variant.availableForSale ? "cursor-not-allowed opacity-40" : ""
              }`}
            >
              {variant.title}
            </button>
          );
        })}
      </div>

      {selectedVariant && selectedVariant.availableForSale ? (
        <AddToCartButton
          item={{
            id: product.id,
            variantId: selectedVariant.id,
            handle: product.handle,
            title: product.title,
            variantTitle: selectedVariant.title,
            price: selectedVariant.price.amount,
            currencyCode: selectedVariant.price.currencyCode,
            image: selectedVariant.image || product.featuredImage,
          }}
        />
      ) : (
        <button
          disabled
          className="rounded-full bg-neutral-300 px-6 py-3 text-sm text-white"
        >
          Indisponível
        </button>
      )}
    </div>
  );
}

