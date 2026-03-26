import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-neutral-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-base font-semibold">Brave Fashion by Paula Valente</h3>
          <p className="text-sm text-neutral-600">
            Moda feminina com atendimento próximo e peças escolhidas com cuidado.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold">Informações</h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>Morada: Paços de Ferreira</li>
            <li>Telefone: [colocar número]</li>
            <li>Horário: [colocar horário]</li>
            <li>
              Instagram:{" "}
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                @bravefashion
              </a>
            </li>
            <li>
              Facebook:{" "}
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Ver página
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold">Links úteis</h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>
              <Link href="/contactos" className="hover:underline">
                Contactos
              </Link>
            </li>
            <li>
              <Link href="/envios" className="hover:underline">
                Envios
              </Link>
            </li>
            <li>
              <Link href="/trocas-e-devolucoes" className="hover:underline">
                Trocas e devoluções
              </Link>
            </li>
            <li>
              <Link href="/politica-de-privacidade" className="hover:underline">
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link href="/termos-e-condicoes" className="hover:underline">
                Termos e condições
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

