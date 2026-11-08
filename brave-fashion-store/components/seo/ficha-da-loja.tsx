/**
 * Ficha da loja para o Google (dados estruturados schema.org, em JSON-LD).
 *
 * O Google e as respostas da IA dele leem isto para saber, sem adivinhar, que
 * a Brave Fashion é uma loja de roupa em Paços de Ferreira, com morada,
 * horário, contactos, redes sociais e este site. Sem a ficha, a resposta
 * dizia que a marca "não tem loja online".
 *
 * Os dados são os do rodapé (components/layout/footer.tsx). Se a morada, o
 * telefone ou o horário mudarem lá, têm de mudar aqui também.
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bravefashionbypaulavalente.com";

const ficha = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ClothingStore",
      "@id": `${siteUrl}/#loja`,
      name: "Brave Fashion by Paula Valente",
      alternateName: ["Bravefashion by Paula Valente", "Brave Fashion"],
      description:
        "Loja de moda feminina em Paços de Ferreira, com atendimento personalizado e venda online: vestidos, casacos, malhas, gabardinas e acessórios selecionados pela Paula Valente.",
      url: siteUrl,
      logo: `${siteUrl}/logo.jpg`,
      image: [`${siteUrl}/logo.jpg`, `${siteUrl}/hero.jpg`],
      telephone: "+351918699920",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rua D. João IV, nº 23, R/C",
        postalCode: "4590-578",
        addressLocality: "Paços de Ferreira",
        addressCountry: "PT",
      },
      areaServed: "PT",
      currenciesAccepted: "EUR",
      paymentAccepted: "Cartão, MB WAY",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "10:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "13:00",
        },
      ],
      sameAs: [
        "https://www.instagram.com/bravefashionbypaulavalente/",
        "https://www.facebook.com/lojapaulavalente/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#site`,
      url: siteUrl,
      name: "Brave Fashion by Paula Valente",
      inLanguage: "pt-PT",
      publisher: { "@id": `${siteUrl}/#loja` },
    },
  ],
};

export default function FichaDaLoja() {
  return (
    <script
      type="application/ld+json"
      // O "<" é trocado para que nenhum texto feche a etiqueta <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ficha).replace(/</g, "\\u003c") }}
    />
  );
}
