import Image from "next/image";

export default function ComingSoonPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      
      {/* Background imagem */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Brave Fashion"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-2xl text-white">

          <h1 className="font-serif text-5xl md:text-7xl">
            Brave Fashion
          </h1>

          <p className="mt-4 text-lg tracking-[0.3em] uppercase text-white/80">
            by Paula Valente
          </p>

          <h2 className="mt-10 font-serif text-3xl md:text-5xl">
            Nova loja online brevemente
          </h2>

          <p className="mt-6 text-lg md:text-xl text-white/90">
            Estamos a preparar a nova coleção.
            Em breve disponível online.
          </p>

          {/* Botão Instagram */}
          <div className="mt-10 flex justify-center">
            <a
              href="https://www.instagram.com/bravefashionbypaulavalente/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-4 text-[16px] font-medium"
              style={{
                border: "2px solid white",
                padding: "16px 36px",
              }}
            >
              <span className="font-serif">Seguir no Instagram</span>
              <span style={{ fontSize: "20px" }}>→</span>
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}

