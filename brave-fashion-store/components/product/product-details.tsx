"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

function getUniqueImages(
  variantImage: ShopifyImage | null,
  featuredImage: ShopifyImage | null,
  productImages: ShopifyImage[]
) {
  const allImages = [variantImage, featuredImage, ...productImages].filter(
    Boolean
  ) as ShopifyImage[];

  return allImages.filter(
    (image, index, self) =>
      index === self.findIndex((item) => item.url === image.url)
  );
}

export default function ProductDetails({
  product,
  variants,
}: ProductDetailsProps) {
  const productImages = useMemo(() => {
    return product.images?.edges.map((edge) => edge.node) ?? [];
  }, [product.images]);

  const initialVariantImage = variants[0]?.image || null;

  const [selectedVariantImage, setSelectedVariantImage] =
    useState<ShopifyImage | null>(initialVariantImage);

  const category = useMemo(() => getCategoryFromProduct(product), [product]);

  const carouselImages = useMemo(() => {
    return getUniqueImages(
      selectedVariantImage,
      product.featuredImage,
      productImages
    );
  }, [selectedVariantImage, product.featuredImage, productImages]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!carouselImages.length) {
      setCurrentIndex(0);
      return;
    }

    const selectedUrl = selectedVariantImage?.url;

    if (!selectedUrl) {
      setCurrentIndex(0);
      return;
    }

    const newIndex = carouselImages.findIndex(
      (image) => image.url === selectedUrl
    );

    setCurrentIndex(newIndex >= 0 ? newIndex : 0);
  }, [selectedVariantImage, carouselImages]);

  const currentImage = carouselImages[currentIndex] || null;

  function goToPrevious() {
    if (!carouselImages.length) return;

    setCurrentIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  }

  function goToNext() {
    if (!carouselImages.length) return;

    setCurrentIndex((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
  }

  function goToSlide(index: number) {
    setCurrentIndex(index);
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
      <div className="order-1">
        {currentImage ? (
          <div className="space-y-5">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-white">
              <Image
                key={currentImage.url}
                src={currentImage.url}
                alt={currentImage.altText || product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {carouselImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    aria-label="Imagem anterior"
                    className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-900 shadow-sm transition hover:bg-white"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={goToNext}
                    aria-label="Imagem seguinte"
                    className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-900 shadow-sm transition hover:bg-white"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {carouselImages.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                {carouselImages.map((image, index) => {
                  const active = index === currentIndex;

                  return (
                    <button
                      key={image.url}
                      type="button"
                      aria-label={`Ir para imagem ${index + 1}`}
                      onClick={() => goToSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        active
                          ? "w-8 bg-[#B76E2B]"
                          : "w-2.5 bg-neutral-300 hover:bg-neutral-400"
                      }`}
                    />
                  );
                })}
              </div>
            )}
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
                setSelectedVariantImage(variant.image || product.featuredImage || null);
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

