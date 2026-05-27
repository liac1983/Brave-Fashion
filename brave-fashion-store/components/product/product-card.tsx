import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  title: string;
  handle: string;
  price?: string;
  compareAtPrice?: string;
  badge?: string;
  image?: {
    url: string;
    altText: string | null;
  } | null;
};


export default function ProductCard({
  title,
  handle,
  badge,
  image,
}: ProductCardProps) {
  return (
    <article className="group">
      <Link href={`/produtos/${handle}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-white">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
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
      </div>
    </article>
  );
}
