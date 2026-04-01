import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  title: string;
  handle: string;
  price: string;
  image?: {
    url: string;
    altText: string | null;
  } | null;
};

function getCategoryFromTitle(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("vestido")) return "Vestidos";
  if (lower.includes("casaco")) return "Casacos";
  if (lower.includes("conjunto")) return "Conjuntos";

  return "Brave Fashion";
}

export default function ProductCard({
  title,
  handle,
  price,
  image,
}: ProductCardProps) {
  const category = getCategoryFromTitle(title);

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

          
        </div>
      </Link>

      <div className="mt-6">
        <Link href={`/produtos/${handle}`} className="block">
          <h3 className="font-serif text-[24px] leading-snug text-neutral-900 transition group-hover:opacity-80">
            {title}
          </h3>
        </Link>

        <p className="mt-3 text-[22px] text-neutral-500">{price}</p>
      </div>
    </article>
  );
}

