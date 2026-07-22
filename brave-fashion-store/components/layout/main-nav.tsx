import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/sobre-nos", label: "Sobre Nós" },
  { href: "/produtos", label: "Produtos" },
  { href: "/novidades", label: "Novidades" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/marcacoes", label: "Marcar Visita" },
];

export default function MainNav({ light = false }: { light?: boolean }) {
  return (
    <nav className="flex items-center gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium transition-colors ${
            light
              ? "text-white/90 hover:text-white"
              : "text-neutral-700 hover:text-black"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

