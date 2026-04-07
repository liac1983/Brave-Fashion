"use client";

import { useState } from "react";
import Link from "next/link";
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
      width: number | null;
      height: number | null;
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
    <div className="space-y-8">
      <div className="mb-10 flex items-center justify-between gap-6">
        <h2 className="font-serif text-2xl text-neutral-900 md:text-3xl">
          Selecione o seu tamanho
        </h2>


      </div>

      <div className="flex flex-wrap gap-4">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => {
                        setSelectedVariant(variant);
                        onVariantChange?.(variant);
                      }}
              disabled={!variant.availableForSale}
              className={`flex h-[72px] min-w-[92px] items-center justify-center rounded-[6px] border text-2xl font-medium transition ${
                isSelected
                  ? "border-[#B76E2B] bg-[#B76E2B] text-white"
                  : "border-[#eadccf] bg-transparent text-neutral-900 hover:border-[#B76E2B]"
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
        <div className="pt-2">
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
            className="w-full rounded-[6px] bg-[#B76E2B] px-6 py-5 text-2xl font-medium text-white transition hover:bg-[#a86424]"
          />
        </div>
      ) : (
        <button
          disabled
          className="w-full rounded-[6px] bg-neutral-300 px-6 py-5 text-2xl font-medium text-white"
        >
          Indisponível
        </button>
      )}
    </div>
  );
}

