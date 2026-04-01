"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import VariantSelector from "@/components/product/variant-selector";
import type {
  Product,
  ProductVariant,
  ShopifyImage,
} from "@/lib/shopify/types";

type ProductDetailsProps = {
  product: Product;
  variants: ProductVariant[];
};

function getCategoryFromProduct(product: Product) {
  const title = product.title.toLowerCase();

  if (title.includes("vestido")) return "Vestidos";
  if (title.includes("casaco")) return "Casacos";
  if (title.includes("conjunto")) return "Conjuntos";

  return "Brave Fashion";
}

export default function ProductDetails({
  product,
  variants,
}: ProductDetailsProps) {
  const initialImage: ShopifyImage | null =
    variants[0]?.image || product.featuredImage || null;

  const [selectedImage, setSelectedImage] = useState<ShopifyImage | null>(
    initialImage
  );

  const category = useMemo(() => getCategoryFromProduct(product), [product]);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
      <div className="order-1">
        {selectedImage ? (
          <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-white">
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[3/4] items-center justify-center rounded-[6px] bg-white text-neutral-400">
            Sem imagem
          </div>
        )}
      </div>

      <div className="order-2 lg:pt-8">
        <p className="text-[15px] text-neutral-500">{category}</p>

        <h1 className="mt-4 font-serif text-4xl leading-tight text-neutral-900 md:text-[58px]">
          {product.title}
        </h1>

        <div className="mt-6">
          <p className="text-3xl font-semibold text-neutral-900 md:text-[34px]">
            €{Number(product.priceRange.minVariantPrice.amount).toFixed(2)}
          </p>
        </div>

        <div className="mt-10 border-b border-[#e7d9cf] pb-10">
          <p className="max-w-2xl text-[18px] leading-9 text-neutral-600 md:text-[19px]">
            {product.description || "Descrição em atualização."}
          </p>
        </div>

        <div className="mt-10">
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
            <button
              type="button"
              disabled
              className="mt-6 w-full rounded-[6px] bg-neutral-300 px-6 py-5 text-lg font-medium text-white"
            >
              Indisponível
            </button>
          )}
        </div>

        <div className="mt-8 border-t border-[#e7d9cf]">
          <details className="group border-b border-[#e7d9cf]">
            <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-[20px] font-medium text-neutral-900 md:text-[21px]">
              <span>Detalhes do produto</span>
              <span className="text-xl transition group-open:rotate-90">›</span>
            </summary>
            <div className="pb-6 pr-4 text-[17px] leading-8 text-neutral-600">
              Peça selecionada com atenção ao corte, ao caimento e ao conforto.
              Ideal para criar um look elegante e feminino, tanto para ocasiões
              especiais como para um uso mais sofisticado no dia a dia.
            </div>
          </details>

          <details className="group border-b border-[#e7d9cf]">
            <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-[20px] font-medium text-neutral-900 md:text-[21px]">
              <span>Envio e devoluções</span>
              <span className="text-xl transition group-open:rotate-90">›</span>
            </summary>
            <div className="pb-6 pr-4 text-[17px] leading-8 text-neutral-600">
              Envio rápido para todo o país. As devoluções podem ser efetuadas
              dentro do prazo definido pela política da loja, desde que a peça
              se encontre em perfeitas condições.
            </div>
          </details>

          <details className="group border-b border-[#e7d9cf]">
            <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-[20px] font-medium text-neutral-900 md:text-[21px]">
              <span>Cuidados com a peça</span>
              <span className="text-xl transition group-open:rotate-90">›</span>
            </summary>
            <div className="pb-6 pr-4 text-[17px] leading-8 text-neutral-600">
              Recomendamos seguir as instruções da etiqueta. Lavar com cuidado e
              evitar temperaturas elevadas para preservar a qualidade do tecido
              e o acabamento da peça.
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

