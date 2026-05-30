"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src="/hero.jpg"
          alt="Nova coleção Brave Fashion"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_25%] scale-[1.15]"
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="font-serif text-5xl font-medium tracking-tight text-white md:text-7xl"
          >
            Nova Coleção
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white md:text-2xl"
          >
            O estilo é criar a própria moda — a diferença está nos pormenores.
          </motion.p>

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
        </div>
      </div>
    </section>
  );
}
