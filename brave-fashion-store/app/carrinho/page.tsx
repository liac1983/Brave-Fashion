"use client";

import Image from "next/image";
import { useCart } from "@/components/cart/cart-provider";

export default function CarrinhoPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    clearCart,
    checkoutUrl,
    currencyCode,
    isLoading,
  } = useCart();

  return (
    <section className="py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold">Carrinho</h1>
        <p className="mt-3 text-neutral-600">
          Tens {totalItems} artigo(s) no carrinho.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-neutral-50 p-8">
          <p className="text-neutral-600">O teu carrinho está vazio.</p>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-6">
            {items.map((item) => {
              const image =
                item.merchandise.image ||
                item.merchandise.product.featuredImage;

              return (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-3xl border p-4"
                >
                  <div className="relative h-28 w-24 overflow-hidden rounded-2xl bg-neutral-100">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.altText || item.merchandise.product.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-medium">
                        {item.merchandise.product.title}
                      </h2>

                      <p className="mt-1 text-sm text-neutral-500">
                        {item.merchandise.title}
                      </p>

                      <p className="mt-2 text-sm text-neutral-700">
                        {item.merchandise.price.amount}{" "}
                        {item.merchandise.price.currencyCode}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={isLoading}
                          className="h-9 w-9 rounded-full border transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          -
                        </button>

                        <span className="min-w-6 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={isLoading}
                          className="h-9 w-9 rounded-full border transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        disabled={isLoading}
                        className="text-sm text-neutral-500 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-3xl bg-neutral-50 p-6">
            <h2 className="text-xl font-semibold">Resumo</h2>

            <div className="mt-6 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>
                {subtotal.toFixed(2)} {currencyCode}
              </span>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              Portes e pagamento serão calculados no checkout.
            </p>

            <button
              type="button"
              onClick={() => {
                if (checkoutUrl) {
                  window.location.href = checkoutUrl;
                }
              }}
              disabled={!checkoutUrl || isLoading}
              className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Finalizar compra
            </button>

            <button
              type="button"
              onClick={clearCart}
              disabled={isLoading}
              className="mt-3 w-full rounded-full border border-neutral-300 px-6 py-3 text-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Limpar carrinho
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
