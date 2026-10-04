import { ShieldCheck, ShoppingBag } from "lucide-react";
import { shippingSummary } from "@/lib/shop";

type BuyButtonProps = {
  /** Payment Link do Stripe. Sem ele o botão não é renderizado. */
  linkPagamento: string;
};

export default function BuyButton({ linkPagamento }: BuyButtonProps) {
  return (
    <div className="mt-6">
      <a
        href={linkPagamento}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-3 rounded-[6px] bg-[#B76E2B] px-6 py-5 text-lg font-medium text-white transition hover:bg-[#9d5e24]"
      >
        <ShoppingBag size={22} />
        <span className="font-serif">Comprar</span>
      </a>

      <p className="mt-3 text-sm text-neutral-500">{shippingSummary()}</p>

      <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
        <ShieldCheck size={16} className="shrink-0 text-[#B76E2B]" strokeWidth={1.8} />
        Pagamento seguro por cartão ou MB WAY
      </p>
    </div>
  );
}
