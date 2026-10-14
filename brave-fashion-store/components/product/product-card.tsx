import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import HeartButton from "@/components/favorites/heart-button";

type ProductImage = {
  url: string;
  altText: string | null;
};

type ProductCardProps = {
  id: string;
  title: string;
  handle: string;
  price?: string;
  compareAtPrice?: string;
  badge?: string;
  image?: ProductImage | null;
  hoverImage?: ProductImage | null;
  /** Peça com link de pagamento: pode ser comprada sem passar pelo WhatsApp. */
  buyable?: boolean;
};

export default function ProductCard({
  id,
  title,
  handle,
  price,
  compareAtPrice,
  badge,
  image,
  hoverImage,
  buyable = false,
}: ProductCardProps) {
  return (
    <article className="group relative">
      <div className="absolute right-3 top-3 z-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <HeartButton product={{ id, handle, title, image: image ?? null }} />
        </div>
      </div>

      <Link href={`/produtos/${handle}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-white">
          {image ? (
            <>
              <Image
                src={image.url}
                alt={image.altText || title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className={`object-cover transition duration-700 group-hover:scale-105 ${
                  hoverImage ? "group-hover:opacity-0" : ""
                }`}
              />
              {hoverImage && (
                <Image
                  src={hoverImage.url}
                  alt={hoverImage.altText || title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              Sem imagem
            </div>
          )}

          {badge && (
            <div className="absolute left-5 top-5 rounded-[6px] bg-[#B76E2B] px-4 py-2 text-lg text-white">
              {badge}
            </div>
          )}
        </div>
      </Link>

      <div className="mt-6">
        <Link href={`/produtos/${handle}`} className="block">
          <h3 className="font-serif text-[24px] leading-snug text-neutral-900 transition group-hover:opacity-80">
            {title}
          </h3>
        </Link>
        {price && (
          <div className="mt-3 flex items-center gap-3">
            <p className="text-[22px] text-neutral-900">{price}</p>
            {compareAtPrice && (
              <p className="text-[18px] text-neutral-400 line-through">{compareAtPrice}</p>
            )}
          </div>
        )}

        {buyable && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#f0e3d5] px-3 py-1 text-[14px] text-[#8a4e16]">
            <ShoppingBag size={14} strokeWidth={1.9} />
            Comprar online
          </p>
        )}
      </div>
    </article>
  );
}
