import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "351918699920";

type WhatsAppButtonProps = {
  productTitle: string;
  productHandle: string;
};

export default function WhatsAppButton({ productTitle, productHandle }: WhatsAppButtonProps) {
  const message = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${productTitle}\nReferência: ${productHandle}\nPodem dar-me mais informações?`
  );

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-6 flex w-full items-center justify-center gap-3 rounded-[6px] bg-[#B76E2B] px-6 py-5 text-lg font-medium text-white transition hover:bg-[#9d5e24]"
    >
      <MessageCircle size={22} />
      <span className="font-serif">Tenho Interesse</span>
    </a>
  );
}
