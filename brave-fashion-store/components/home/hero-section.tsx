"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/lib/sanity/types";
import { definirTomDoHero } from "@/lib/hero-tom";

type HeroSectionProps = {
  slides: HeroSlide[];
};

/** Tempo de cada slide à vista, em milissegundos. */
const DURACAO = 7000;

const FUNDOS = {
  bege: "#f3ebe1",
  branco: "#ffffff",
} as const;

/** Ponto focal marcado no Studio, para o recorte do ecrã inteiro o respeitar. */
function pontoFocal(hotspot?: { x: number; y: number } | null) {
  if (!hotspot) return "center 25%";
  return `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`;
}

function SlideLogo({
  slide,
  primeiro,
}: {
  slide: Extract<HeroSlide, { tipo: "logo" }>;
  primeiro: boolean;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ backgroundColor: FUNDOS[slide.fundo] }}
    >
      <div className="relative aspect-square w-[min(62vh,78vw)] max-w-[560px]">
        <Image
          src={slide.logo?.url ?? "/logo-hero.png"}
          alt="Brave Fashion by Paula Valente"
          fill
          priority={primeiro}
          sizes="(max-width: 768px) 78vw, 560px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

function SlideImagem({
  slide,
  primeiro,
  ativo,
}: {
  slide: Extract<HeroSlide, { tipo: "imagem" }>;
  primeiro: boolean;
  ativo: boolean;
}) {
  const reduzir = useReducedMotion();

  return (
    <>
      <motion.div
        className="absolute inset-0"
        // Aproximação lenta enquanto o slide está à vista.
        initial={false}
        animate={{ scale: ativo || reduzir ? 1 : 1.06 }}
        transition={{
          duration: ativo ? DURACAO / 1000 + 1 : 0,
          ease: "easeOut",
        }}
      >
        <Image
          src={slide.imagem?.url ?? "/hero.jpg"}
          alt={slide.imagem?.altText || slide.titulo || "Brave Fashion"}
          fill
          priority={primeiro}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: pontoFocal(slide.imagem?.hotspot) }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* O texto só existe no slide à vista, para entrar animado de cada vez. */}
      {ativo && (
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-4xl">
            {slide.titulo && (
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="font-serif text-5xl font-medium tracking-tight text-white md:text-7xl"
              >
                {slide.titulo}
              </motion.h2>
            )}

            {slide.subtitulo && (
              <motion.p
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white md:text-2xl"
              >
                {slide.subtitulo}
              </motion.p>
            )}

            {slide.mostrarBotao && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
                className="mt-10"
              >
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-3 bg-[#B9712C] px-8 py-4 text-base font-medium text-white transition duration-300 hover:scale-105 hover:bg-[#a86424]"
                >
                  Explorar Loja
                  <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const reduzir = useReducedMotion();

  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = slides.length;
  const slide = slides[atual] ?? slides[0];

  const irPara = useCallback(
    (indice: number) => setAtual(((indice % total) + total) % total),
    [total],
  );

  // O cabeçalho fica com letras escuras por cima do slide do logótipo.
  useEffect(() => {
    definirTomDoHero(slide?.tipo === "logo" ? "claro" : "escuro");
  }, [slide]);

  // Ao sair da homepage, o resto do site volta ao tom de sempre.
  useEffect(() => () => definirTomDoHero("escuro"), []);

  // Avanço automático — parado se a pessoa pediu menos movimento, se está com
  // o rato ou o foco no carrossel, ou se o separador não está à vista.
  useEffect(() => {
    if (total < 2 || pausado || reduzir) return;

    const temporizador = window.setTimeout(() => {
      if (document.visibilityState === "visible") irPara(atual + 1);
    }, DURACAO);

    return () => window.clearTimeout(temporizador);
  }, [atual, total, pausado, reduzir, irPara]);

  if (!slide) return null;

  return (
    <section
      ref={ref}
      aria-roledescription="carrossel"
      aria-label="Destaques da Brave Fashion"
      className="relative h-screen w-full overflow-hidden bg-[#f3ebe1]"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <h1 className="sr-only">Brave Fashion by Paula Valente</h1>

      <motion.div
        className="absolute inset-0"
        style={{ y }}
        drag={total > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) irPara(atual + 1);
          else if (info.offset.x > 60) irPara(atual - 1);
        }}
      >
        {/*
          Todos os slides ficam montados, uns por cima dos outros, e só o
          atual está visível: assim as fotografias seguintes já estão
          carregadas quando chega a vez delas.
        */}
        {slides.map((item, indice) => {
          const ativo = indice === atual;
          return (
            <motion.div
              key={item.key}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: ativo ? 1 : 0 }}
              transition={{ duration: reduzir ? 0 : 1, ease: "easeInOut" }}
              style={{
                zIndex: ativo ? 1 : 0,
                pointerEvents: ativo ? "auto" : "none",
              }}
              aria-roledescription="slide"
              aria-label={`${indice + 1} de ${total}`}
              aria-hidden={!ativo}
            >
              {item.tipo === "logo" ? (
                <SlideLogo slide={item} primeiro={indice === 0} />
              ) : (
                <SlideImagem
                  slide={item}
                  primeiro={indice === 0}
                  ativo={ativo}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => irPara(atual - 1)}
            aria-label="Slide anterior"
            className={`absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur transition md:flex ${
              slide.tipo === "logo"
                ? "bg-white/70 text-neutral-800 hover:bg-white"
                : "bg-white/15 text-white hover:bg-white/30"
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={() => irPara(atual + 1)}
            aria-label="Slide seguinte"
            className={`absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur transition md:flex ${
              slide.tipo === "logo"
                ? "bg-white/70 text-neutral-800 hover:bg-white"
                : "bg-white/15 text-white hover:bg-white/30"
            }`}
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center gap-2.5">
            {slides.map((item, indice) => (
              <button
                key={item.key}
                type="button"
                onClick={() => irPara(indice)}
                aria-label={`Ir para o slide ${indice + 1}`}
                aria-current={indice === atual}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  indice === atual
                    ? "w-8 bg-[#B76E2B]"
                    : slide.tipo === "logo"
                      ? "w-2.5 bg-neutral-400/70 hover:bg-neutral-500"
                      : "w-2.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
