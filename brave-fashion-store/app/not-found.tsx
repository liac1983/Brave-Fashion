import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-semibold">Página não encontrada</h1>
      <p className="mt-4 text-neutral-600">
        A coleção ou página que procuras não existe.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm text-white"
      >
        Voltar ao início
      </Link>
    </section>
  );
}

