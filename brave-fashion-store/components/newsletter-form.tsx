"use client";

import { FormEvent, useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await fetch("/api/newsletter", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Não foi possível subscrever.");
        return;
      }

      setStatus("success");
      setMessage("Subscrição feita com sucesso. Verifique o seu email.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Ocorreu um erro. Tente novamente.");
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <input
          type="email"
          name="email"
          placeholder="O seu email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 flex-1 rounded-[6px] border border-[#e2d2c6] bg-white px-5 text-lg text-neutral-800 outline-none placeholder:text-neutral-400"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="h-14 rounded-[6px] bg-[#B76E2B] px-8 text-lg font-medium text-white transition hover:bg-[#a86424] disabled:opacity-70"
        >
          {status === "loading" ? "A subscrever..." : "Subscrever"}
        </button>
      </form>

      {message ? (
        <p
          className={`mt-4 text-sm ${
            status === "success" ? "text-green-700" : "text-red-600"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

