import { urlFor } from "@/sanity/lib/image";

/**
 * Só o que é preciso para recortar — não as dimensões originais. Assim serve
 * tanto o tipo completo do Sanity como as versões reduzidas que os
 * componentes de listagem usam.
 */
type Recortavel = {
  url: string;
  asset?: { _ref?: string; _type?: string } | null;
  hotspot?: { x: number; y: number; height: number; width: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
};

/**
 * Recorta uma imagem respeitando o ponto focal definido no Studio.
 *
 * As fotografias das peças não têm todas a mesma proporção, mas o site
 * mostra-as sempre em 3:4. Até aqui o recorte era feito às cegas pelo centro
 * da imagem, o que cortava a cabeça de quem estivesse mais acima no
 * enquadramento.
 *
 * O Sanity já tinha o mecanismo certo — o hotspot, que a Paula pode arrastar
 * em cada fotografia — só não estava a ser usado. Com isto, o que ela marcar
 * no Studio é o que fica garantidamente visível.
 *
 * Se a imagem vier sem referência (ou de outra origem), devolve-se o endereço
 * original: pior enquadrada, mas nunca partida.
 */
export function cropped(
  image: Recortavel | null | undefined,
  width: number,
  height: number
): string | null {
  if (!image?.url) return null;
  if (!image.asset?._ref) return image.url;

  try {
    return urlFor({
      _type: "image",
      asset: image.asset,
      hotspot: image.hotspot ?? undefined,
      crop: image.crop ?? undefined,
    })
      .width(width)
      .height(height)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return image.url;
  }
}

/** Mesma proporção 3:4 usada em toda a listagem de peças. */
export function croppedCard(image: Recortavel | null | undefined) {
  return cropped(image, 900, 1200);
}
