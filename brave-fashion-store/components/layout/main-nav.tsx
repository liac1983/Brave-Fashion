import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/colecoes", label: "Coleções" },
  { href: "/contactos", label: "Contactos" },
];

export default function MainNav() {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-neutral-700 hover:text-black transition"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

