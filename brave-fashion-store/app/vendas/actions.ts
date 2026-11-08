"use server";

import { revalidatePath } from "next/cache";
import { eAdmin, marcarFatura } from "@/lib/vendas";

/**
 * Marca a fatura de uma venda como passada (ou volta a desmarcá-la).
 *
 * A autorização é verificada aqui outra vez: uma Server Action é um endpoint
 * público, e esconder o botão não chega.
 */
export async function alternarFatura(formData: FormData) {
  const acesso = await eAdmin();
  if (acesso.estado !== "admin") throw new Error("Sem acesso.");

  const id = formData.get("id");
  const passada = formData.get("passada") === "1";

  if (typeof id !== "string" || !id.startsWith("cs_")) throw new Error("Venda inválida.");

  await marcarFatura(id, passada);
  revalidatePath("/vendas");
}
