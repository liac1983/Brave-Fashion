"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "351918699920";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VISIT_TYPES = [
  "Ajuda para escolher um outfit para um evento",
  "Explorar a nova coleção",
  "Renovar o guarda-roupa",
  "Outro",
];

const EVENT_TYPES = [
  "Casamento",
  "Batizado",
  "Aniversário",
  "Formatura",
  "Festa",
  "Outro",
];

export default function BookingForm() {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    tipoVisita: "",
    tipoEvento: "",
    data: "",
    hora: "",
    notas: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const showEventType = form.tipoVisita === "Ajuda para escolher um outfit para um evento";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "tipoVisita" ? { tipoEvento: "" } : {}),
    }));
    setStatus("idle");
    setMessage("");
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const lines = [
      "Olá! Gostaria de marcar uma visita à Brave Fashion. 🛍️",
      "",
      `*Nome:* ${form.nome}`,
      `*Contacto:* ${form.telefone}`,
      form.email ? `*Email:* ${form.email}` : null,
      `*Motivo da visita:* ${form.tipoVisita}`,
      showEventType && form.tipoEvento ? `*Tipo de evento:* ${form.tipoEvento}` : null,
      form.data ? `*Data preferida:* ${form.data}` : null,
      form.hora ? `*Hora preferida:* ${form.hora}` : null,
      form.notas ? `*Notas:* ${form.notas}` : null,
      "",
      "Podem confirmar disponibilidade?",
    ].filter((l) => l !== null);

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  }

  async function handleEmailSubmit() {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/marcacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tipoEvento: showEventType ? form.tipoEvento : "",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus("error");
        setMessage(data?.error || "Não foi possível enviar o pedido.");
        return;
      }

      setStatus("success");
      setMessage(
        "Pedido enviado! Recebeu uma confirmação por email e a Paula entra em contacto para confirmar a data e a hora."
      );
    } catch {
      setStatus("error");
      setMessage("Ocorreu um erro. Tente novamente ou envie por WhatsApp.");
    }
  }

  const inputClass =
    "w-full rounded-[6px] border border-[#e7d9cf] bg-white px-4 py-3 text-[17px] text-neutral-900 outline-none transition focus:border-[#B76E2B] focus:ring-1 focus:ring-[#B76E2B]";

  const labelClass = "block font-medium text-neutral-800 mb-2";

  const isValid = Boolean(form.nome.trim() && form.telefone.trim() && form.tipoVisita);
  const hasValidEmail = EMAIL_REGEX.test(form.email.trim());
  const canSendEmail = isValid && hasValidEmail && status !== "loading";

  return (
    <form onSubmit={handleSubmit} className="space-y-16">

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Nome completo *</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="O seu nome"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Telefone *</label>
          <input
            type="tel"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="+351 9XX XXX XXX"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="o.seu.email@exemplo.pt"
          className={inputClass}
        />
        <p className="mt-2 text-sm text-neutral-500">
          Necessário apenas para enviar o pedido por email.
        </p>
      </div>

      <div>
        <label className={labelClass}>Motivo da visita *</label>
        <select
          name="tipoVisita"
          value={form.tipoVisita}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">Selecione uma opção</option>
          {VISIT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {showEventType && (
        <div>
          <label className={labelClass}>Tipo de evento</label>
          <select
            name="tipoEvento"
            value={form.tipoEvento}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Selecione o evento</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Data preferida</label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Hora preferida</label>
          <select
            name="hora"
            value={form.hora}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Selecione uma hora</option>
            {["10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30",
              "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"].map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Notas adicionais</label>
        <textarea
          name="notas"
          value={form.notas}
          onChange={handleChange}
          rows={4}
          placeholder="Descreva brevemente o que procura, o seu estilo, ocasião especial..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="submit"
            disabled={!isValid}
            className="flex items-center justify-center gap-3 rounded-[6px] bg-[#B76E2B] px-8 py-4 text-[18px] font-medium text-white transition hover:bg-[#9d5e24] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enviar via WhatsApp
          </button>

          <button
            type="button"
            onClick={handleEmailSubmit}
            disabled={!canSendEmail}
            className="flex items-center justify-center gap-3 rounded-[6px] border border-[#B76E2B] bg-white px-8 py-4 text-[18px] font-medium text-[#B76E2B] transition hover:bg-[#f3e7dc] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 6 10-6" />
            </svg>
            {status === "loading" ? "A enviar..." : "Enviar por email"}
          </button>
        </div>

        {message ? (
          <p
            className={`mt-6 text-[17px] ${
              status === "success" ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        ) : null}

        {isValid && !hasValidEmail && status === "idle" ? (
          <p className="mt-6 text-sm text-neutral-500">
            Preencha o campo Email para poder enviar o pedido por email.
          </p>
        ) : null}

        <p className="mt-6 text-sm text-neutral-500">
          No WhatsApp será redirecionada com os seus dados já preenchidos. Por email, o
          pedido segue diretamente para a loja. Em ambos os casos a Paula confirma a data
          e a hora disponível.
        </p>
      </div>
    </form>
  );
}
