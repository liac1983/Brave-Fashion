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

export default function ProductCard({
  title,
  handle,
  price,
  image,
}: ProductCardProps) {
  return (
    <article className="group">
      <Link href={`/produtos/${handle}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-neutral-100">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
              Sem imagem
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        <h3 className="text-base font-medium text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-500">{price}</p>

        <Link
          href={`/produtos/${handle}`}
          className="inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm transition hover:bg-black hover:text-white"
        >
          Ver produto
        </Link>
      </div>
    </article>
  );
}

