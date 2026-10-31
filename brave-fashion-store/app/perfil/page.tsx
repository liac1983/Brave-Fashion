"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Trash2, FolderOpen } from "lucide-react";
import { croppedCard } from "@/lib/sanity/image";

type Product = {
  _id: string;
  title: string;
  handle: string;
  image: { url: string; altText: string | null } | null;
};

type List = {
  _id: string;
  name: string;
  products: Product[] | null;
};

export default function PerfilPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [lists, setLists] = useState<List[]>([]);

  async function loadLists() {
    const res = await fetch("/api/lists");
    const data = await res.json();
    setLists(data.lists ?? []);
  }

  useEffect(() => {
    if (isSignedIn) loadLists();
  }, [isSignedIn]);

  async function deleteList(id: string) {
    await fetch(`/api/lists/${id}`, { method: "DELETE" });
    setLists((prev) => prev.filter((l) => l._id !== id));
  }

  async function removeFromList(listId: string, productId: string) {
    await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, action: "remove" }),
    });
    loadLists();
  }

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <section className="bg-[#f7f2ec] min-h-screen py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif text-5xl text-neutral-900">O meu perfil</h1>
          <p className="mt-4 text-xl text-neutral-500">
            Precisas de entrar para ver as tuas listas.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block font-serif text-[#B76E2B] underline underline-offset-4"
          >
            Voltar ao início
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f7f2ec] min-h-screen py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14">
          <h1 className="font-serif text-5xl leading-tight text-neutral-900 md:text-7xl">
            As minhas listas
          </h1>
          <p className="mt-4 text-2xl text-neutral-500">
            {lists.length} {lists.length === 1 ? "lista guardada" : "listas guardadas"}
          </p>
        </div>

        {lists.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <FolderOpen size={48} className="text-neutral-300" strokeWidth={1.2} />
            <p className="text-xl text-neutral-500">
              Ainda não criaste nenhuma lista.
            </p>
            <p className="text-neutral-400">
              Na página de um produto, clica em{" "}
              <span className="font-medium text-neutral-600">"Guardar em lista"</span>{" "}
              para criar a tua primeira lista.
            </p>
            <Link
              href="/produtos"
              className="font-serif text-lg text-[#B76E2B] underline underline-offset-4"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {lists.map((list) => (
              <div key={list._id}>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-serif text-3xl text-neutral-900">{list.name}</h2>
                  <button
                    type="button"
                    onClick={() => deleteList(list._id)}
                    className="flex items-center gap-2 text-sm text-neutral-400 transition hover:text-red-500"
                  >
                    <Trash2 size={16} />
                    Eliminar lista
                  </button>
                </div>

                {!list.products || list.products.length === 0 ? (
                  <p className="text-neutral-400">Lista vazia.</p>
                ) : (
                  <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                    {list.products
                      .filter((p, i, arr) => arr.findIndex((x) => x._id === p._id) === i)
                      .map((product) => (
                      <article key={product._id} className="group relative">
                        <button
                          type="button"
                          onClick={() => removeFromList(list._id, product._id)}
                          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-400 shadow-sm transition hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                        <Link href={`/produtos/${product.handle}`} className="block">
                          <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-white">
                            {product.image ? (
                              <Image
                                src={croppedCard(product.image) ?? product.image.url}
                                alt={product.image.altText || product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, 25vw"
                                className="object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-neutral-400">
                                Sem imagem
                              </div>
                            )}
                          </div>
                          <h3 className="mt-4 font-serif text-xl text-neutral-900">
                            {product.title}
                          </h3>
                        </Link>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
