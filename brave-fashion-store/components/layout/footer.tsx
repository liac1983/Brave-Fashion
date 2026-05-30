import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#e6d8cf] bg-[#f3ece7]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          
          {/* Logo + descrição */}
          <div>
            <div className="mb-8">
              <Image
                src="/logo.jpg"
                alt="Brave Fashion"
                width={80}
                height={80}
                className="h-auto w-[80px]"
              />
            </div>

            <p className="max-w-[320px] text-[16px] leading-relaxed text-neutral-500 md:text-[18px]">
              Moda elegante e sofisticada para mulheres que apreciam qualidade
              e estilo.
            </p>
          </div>

          {/* Loja */}
          <div>
            <h3 className="mb-8 font-serif text-[20px] text-neutral-900">
              Loja
            </h3>

            <ul className="space-y-4 text-[16px] text-neutral-500 md:text-[18px]">
              <li>
                <Link href="/produtos" className="transition hover:text-neutral-900">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/novidades" className="transition hover:text-neutral-900">
                  Novidades
                </Link>
              </li>
              <li>
                <Link href="/promocoes" className="transition hover:text-neutral-900">
                  Promoções
                </Link>
              </li>
              <li>
                <Link href="/sobre-nos" className="transition hover:text-neutral-900">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/marcacoes" className="transition hover:text-neutral-900">
                  Marcar Visita
                </Link>
              </li>
            </ul>
          </div>

{/* Redes sociais */}
          <div>
            <h3 className="mb-8 font-serif text-[20px] text-neutral-900">
              Siga-nos
            </h3>

            <div className="flex items-center gap-5">
              
              {/* Instagram */}
              <a
                href="https://www.instagram.com/bravefashionbypaulavalente/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B76E2B] text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/lojapaulavalente/?ref=NONE_xav_ig_profile_page_web"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B76E2B] text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

            </div>
          </div>
          <div className="space-y-3 text-[16px] text-neutral-500 md:text-[18px]">
            <p>918699920</p>
            <p>Rua D.João IV nº23 R/CH<br />4590-578 Paços de Ferreira</p>
            <div className="pt-1">
              <p className="font-medium text-neutral-700">Horário</p>
              <p>Segunda a Sexta: 10h00 – 18h00</p>
              <p>Sábado: 10h00 – 13h00</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-[#e6d8cf] pt-10 text-center">
          <p className="text-[16px] text-neutral-500 md:text-[18px]">
            © 2026 Brave Fashion By Paula Valente
          </p>
        </div>
      </div>
    </footer>
  );
}

