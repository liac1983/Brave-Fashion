"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/components/favorites/favorites-provider";
import HeartButton from "@/components/favorites/heart-button";

export default function FavoritosPage() {
  const { items } = useFavorites();

  return (
    <section className="bg-[#f7f2ec] min-h-screen py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14">
          <h1 className="font-serif text-5xl leading-tight text-neutral-900 md:text-7xl">
            Os Meus Favoritos
          </h1>
          <p className="mt-4 text-2xl text-neutral-500">
            {items.length} {items.length === 1 ? "peça guardada" : "peças guardadas"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <p className="text-xl text-neutral-500">
              Ainda não guardaste nenhuma peça.
            </p>
            <Link
              href="/produtos"
              className="font-serif text-lg text-[#B76E2B] underline underline-offset-4"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="group relative">
                <div className="absolute right-3 top-3 z-10">
                  <HeartButton product={item} />
                </div>
                <Link href={`/produtos/${item.handle}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-white">
                    {item.image ? (
                      <Image
                        src={item.image.url}
                        alt={item.image.altText || item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-400">
                        Sem imagem
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <h3 className="font-serif text-[24px] leading-snug text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[22px] text-neutral-900">{item.price}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
