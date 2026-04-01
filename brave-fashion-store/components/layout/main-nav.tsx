import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/contactos", label: "Contactos" },
];

export default function MainNav() {
  return (
    <nav className="flex items-center gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-neutral-700 transition hover:text-black"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

