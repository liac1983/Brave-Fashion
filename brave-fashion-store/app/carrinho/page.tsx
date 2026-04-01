"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/cart-provider";

export default function CarrinhoPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    clearCart,
    checkoutUrl,
    isLoading,
  } = useCart();

  return (
    <section className="bg-[#f7f2ec] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-12 font-serif text-5xl leading-tight text-neutral-900 md:text-6xl">
          Carrinho de Compras
        </h1>

        {items.length === 0 ? (
          <div className="rounded-[6px] border border-[#e6d8cf] bg-white px-8 py-16">
            <p className="text-lg text-neutral-600">O teu carrinho está vazio.</p>

            <Link
              href="/produtos"
              className="mt-6 inline-flex items-center gap-2 text-lg text-neutral-500 transition hover:text-neutral-900"
            >
              <span aria-hidden="true">←</span>
              <span>Continuar a comprar</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="space-y-8">
                {items.map((item) => {
                  const image =
                    item.merchandise.image ||
                    item.merchandise.product.featuredImage;

                  return (
                    <article
                      key={item.id}
                      className="border-b border-[#e6d8cf] pb-6"
                    >
                      <div className="flex items-start gap-6">
                        <div
                          className="overflow-hidden rounded-[6px] bg-white"
                          style={{
                            width: "110px",
                            height: "140px",
                            minWidth: "110px",
                            minHeight: "140px",
                            maxWidth: "110px",
                            maxHeight: "140px",
                            flex: "0 0 110px",
                          }}
                        >
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.altText || item.merchandise.product.title}
                              width={110}
                              height={140}
                              unoptimized
                              style={{
                                width: "110px",
                                height: "140px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                              Sem imagem
                            </div>
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 items-start justify-between gap-6">
                          <div className="min-w-0">
                            <h2 className="font-serif text-[22px] leading-snug text-neutral-900">
                              {item.merchandise.product.title}
                            </h2>

                            <p className="mt-2 text-lg text-neutral-500">
                              Tamanho: {item.merchandise.title}
                            </p>

                            <div className="mt-8 flex items-center">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={isLoading}
                                className="flex h-9 w-9 items-center justify-center rounded-l-[4px] border border-[#d8c7bb] bg-[#f7f2ec] text-xl text-neutral-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                −
                              </button>

                              <div className="flex h-9 min-w-[40px] items-center justify-center border-y border-[#d8c7bb] bg-[#f7f2ec] px-3 text-lg text-neutral-900">
                                {item.quantity}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={isLoading}
                                className="flex h-9 w-9 items-center justify-center rounded-r-[4px] border border-[#d8c7bb] bg-[#f7f2ec] text-xl text-neutral-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex min-h-[140px] flex-col items-end justify-between">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              disabled={isLoading}
                              aria-label="Remover produto"
                              className="text-neutral-500 transition hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M8 6V4h8v2" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                              </svg>
                            </button>

                            <p className="text-right text-[20px] font-semibold text-neutral-900">
                              €
                              {(
                                Number(item.merchandise.price.amount) *
                                item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-8">
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-2 text-xl text-neutral-500 transition hover:text-neutral-900"
                >
                  <span aria-hidden="true">←</span>
                  <span>Continuar a comprar</span>
                </Link>
              </div>
            </div>

            <aside className="h-fit rounded-[6px] bg-[#f3ece7] p-7">
              <h2 className="font-serif text-[28px] leading-tight text-neutral-900">
                Resumo da Encomenda
              </h2>

              <div className="mt-8 space-y-5">
                <div className="flex items-center justify-between text-[18px] text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-900">
                    €{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[18px] text-neutral-500">
                  <span>Envio</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
              </div>

              <div className="mt-8 border-t border-[#e2d2c6] pt-8">
                <div className="flex items-center justify-between text-[20px] font-semibold text-neutral-900">
                  <span>Total</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (checkoutUrl) {
                    window.location.href = checkoutUrl;
                  }
                }}
                disabled={!checkoutUrl || isLoading}
                className="mt-8 w-full rounded-[4px] bg-[#B76E2B] px-6 py-4 text-[18px] font-medium text-white transition hover:bg-[#a86424] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceder para Pagamento
              </button>

              <div className="mt-6 text-center">
                <p className="text-base text-neutral-500">Aceitamos:</p>
                <div className="mt-3 flex items-center justify-center gap-4 text-base text-neutral-500">
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>PayPal</span>
                </div>
              </div>

              <button
                type="button"
                onClick={clearCart}
                disabled={isLoading}
                className="mt-8 w-full rounded-[4px] border border-[#d8c7bb] bg-transparent px-6 py-4 text-[18px] text-neutral-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Limpar carrinho
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

