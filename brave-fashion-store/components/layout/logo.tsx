import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.jpg"
        alt="Brave Fashion"
        width={50}
        height={50}
        className="h-10 w-auto object-contain"
        priority
      />

      <span
        className={`hidden text-sm font-medium tracking-wide transition-colors md:block ${
          light ? "text-white" : "text-neutral-900"
        }`}
      >
        Brave Fashion
      </span>
    </Link>
  );
}