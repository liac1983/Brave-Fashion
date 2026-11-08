/**
 * Preenche o carrossel do topo da homepage, uma única vez.
 *
 * Fica com três slides:
 *   1. o logótipo em grande, em fundo bege;
 *   2. a fotografia que já estava no hero, com o mesmo título e subtítulo;
 *   3. a fotografia da montra (scripts/assets/hero-montra.webp).
 *
 * Depois disto, tudo se edita no Studio, em Página inicial → Carrossel do topo.
 *
 * Uso (a partir de brave-fashion-store/):
 *   node --env-file=.env.local scripts/seed-hero-carrossel.mjs            # só mostra o que faria
 *   node --env-file=.env.local scripts/seed-hero-carrossel.mjs --aplicar  # escreve no Sanity
 *
 * Recusa-se a correr se o carrossel já tiver slides, para não apagar o que a
 * Paula tenha posto entretanto.
 */
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const aplicar = process.argv.includes("--aplicar");

const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset, SANITY_WRITE_TOKEN: token } =
  process.env;

if (!projectId || !dataset || !token) {
  console.error("Faltam NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET ou SANITY_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-05-20", useCdn: false });

const chave = () => randomUUID().replace(/-/g, "").slice(0, 12);

const homepage = await client.fetch(
  `*[_type == "homepage" && !(_id in path("drafts.**"))][0]{ _id, heroImage, heroTitle, heroSubtitle, "slides": count(slides) }`
);

if (!homepage) {
  console.error("Não há documento da Página Inicial publicado.");
  process.exit(1);
}

if (homepage.slides > 0) {
  console.error(`O carrossel já tem ${homepage.slides} slides. Nada feito.`);
  process.exit(1);
}

console.log(`Página inicial: ${homepage._id} (dataset ${dataset})`);
console.log("Slides a criar:");
console.log("  1. Logótipo em grande, fundo bege");
console.log(`  2. Fotografia atual do hero — "${homepage.heroTitle ?? "Nova Coleção"}"`);
console.log("  3. Fotografia da montra (scripts/assets/hero-montra.webp)");

if (!aplicar) {
  console.log("\nEnsaio apenas. Para escrever no Sanity, correr outra vez com --aplicar.");
  process.exit(0);
}

const caminho = fileURLToPath(new URL("./assets/hero-montra.webp", import.meta.url));
const asset = await client.assets.upload("image", await readFile(caminho), {
  filename: "hero-montra.webp",
});

const slides = [
  { _key: chave(), _type: "slide", tipo: "logo", fundo: "bege" },
  {
    _key: chave(),
    _type: "slide",
    tipo: "imagem",
    ...(homepage.heroImage ? { imagem: homepage.heroImage } : {}),
    titulo: homepage.heroTitle ?? "Nova Coleção",
    subtitulo:
      homepage.heroSubtitle ?? "O estilo é criar a própria moda — a diferença está nos pormenores.",
    mostrarBotao: true,
  },
  {
    _key: chave(),
    _type: "slide",
    tipo: "imagem",
    imagem: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      // O centro das peças, para o recorte em telemóvel não cortar os manequins ao meio.
      hotspot: { _type: "sanity.imageHotspot", x: 0.55, y: 0.5, width: 0.6, height: 0.8 },
    },
    titulo: "",
    subtitulo: "",
    mostrarBotao: true,
  },
];

await client.patch(homepage._id).set({ slides }).commit();
console.log("\nFeito. O carrossel tem agora 3 slides.");
