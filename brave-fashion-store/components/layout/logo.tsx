import Image from "next/image";
import Link from "next/link";

export default function Logo() {
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

      <span className="hidden text-sm font-medium tracking-wide md:block">
        Brave Fashion
      </span>
    </Link>
  );
}