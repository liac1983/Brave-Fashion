"use client";

import { useRouter, useSearchParams } from "next/navigation";

type ProductsSortSelectProps = {
  categoria: string;
  ordenar: string;
};

export default function ProductsSortSelect({
  categoria,
  ordenar,
}: ProductsSortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ordenar", value);
    params.set("categoria", categoria);
    router.push(`/produtos?${params.toString()}`);
  };

  return (
    <select
      id="ordenar"
      value={ordenar}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full rounded-[6px] border border-[#d9c8bb] bg-white px-4 py-3 text-xl text-neutral-700 outline-none"
    >
      <option value="destaques">Destaques</option>
      <option value="preco-asc">Preço: mais baixo</option>
      <option value="preco-desc">Preço: mais alto</option>
      <option value="nome">Nome</option>
    </select>
  );
}

