import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS: Record<string, number> = {
  nome: 120,
  telefone: 40,
  email: 160,
  tipoVisita: 120,
  tipoEvento: 60,
  data: 20,
  hora: 10,
  notas: 2000,
};

function clean(value: unknown, field: string) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_LENGTHS[field] ?? 200);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export async function POST(request: Request) {
  try {
    const parsed: unknown = await request.json().catch(() => null);

    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
    }

    const body = parsed as Record<string, unknown>;

    const nome = clean(body.nome, "nome");
    const telefone = clean(body.telefone, "telefone");
    const email = clean(body.email, "email").toLowerCase();
    const tipoVisita = clean(body.tipoVisita, "tipoVisita");
    const tipoEvento = clean(body.tipoEvento, "tipoEvento");
    const data = clean(body.data, "data");
    const hora = clean(body.hora, "hora");
    const notas = clean(body.notas, "notas");

    if (!nome || !telefone || !tipoVisita) {
      return NextResponse.json(
        { error: "Preencha o nome, o telefone e o motivo da visita." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const to = process.env.BOOKING_EMAIL_TO;
    const from = process.env.BOOKING_EMAIL_FROM;

    if (!apiKey || !to || !from) {
      return NextResponse.json(
        { error: "Envio por email não está configurado." },
        { status: 500 }
      );
    }

    const fields: [string, string][] = [
      ["Nome", nome],
      ["Telefone", telefone],
      ["Email", email],
      ["Motivo da visita", tipoVisita],
      ["Tipo de evento", tipoEvento],
      ["Data preferida", data ? formatDate(data) : ""],
      ["Hora preferida", hora],
      ["Notas", notas],
    ];

    const filled = fields.filter(([, value]) => value);

    const textContent = [
      "Novo pedido de marcação recebido pelo site.",
      "",
      ...filled.map(([label, value]) => `${label}: ${value}`),
    ].join("\n");

    const htmlContent = `
      <div style="font-family:Helvetica,Arial,sans-serif;color:#1f1f1f;line-height:1.6">
        <h2 style="font-size:20px;color:#B76E2B;margin:0 0 16px">Novo pedido de marcação</h2>
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          ${filled
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:6px 16px 6px 0;vertical-align:top;color:#6b6b6b">${escapeHtml(label)}</td>
              <td style="padding:6px 0;vertical-align:top">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
            </tr>`
            )
            .join("")}
        </table>
        <p style="margin:24px 0 0;font-size:13px;color:#8a8a8a">
          Enviado através do formulário de marcações do site.
        </p>
      </div>
    `;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: "Brave Fashion – Marcações", email: from },
        to: [{ email: to }],
        replyTo: { email, name: nome },
        subject: `Pedido de marcação — ${nome}`,
        htmlContent,
        textContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      return NextResponse.json(
        {
          error: "Não foi possível enviar o pedido por email.",
          details: errorData,
        },
        { status: response.status }
      );
    }

    // Confirmação para a cliente — best-effort, não bloqueia o pedido.
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: "Brave Fashion by Paula Valente", email: from },
        to: [{ email, name: nome }],
        replyTo: { email: to, name: "Brave Fashion" },
        subject: "Recebemos o seu pedido de marcação",
        textContent: [
          `Olá ${nome},`,
          "",
          "Recebemos o seu pedido de marcação. A Paula entra em contacto consigo para confirmar a data e a hora.",
          "",
          "Resumo do pedido:",
          ...filled.map(([label, value]) => `${label}: ${value}`),
          "",
          "Rua D. João IV nº23 R/CH, 4590-578 Paços de Ferreira",
          "Segunda a Sexta: 10h00 – 18h00 · Sábado: 10h00 – 13h00",
        ].join("\n"),
        htmlContent: `
          <div style="font-family:Helvetica,Arial,sans-serif;color:#1f1f1f;line-height:1.6">
            <p>Olá ${escapeHtml(nome)},</p>
            <p>Recebemos o seu pedido de marcação. A Paula entra em contacto consigo para confirmar a data e a hora.</p>
            <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0">
              ${filled
                .map(
                  ([label, value]) => `
                <tr>
                  <td style="padding:6px 16px 6px 0;vertical-align:top;color:#6b6b6b">${escapeHtml(label)}</td>
                  <td style="padding:6px 0;vertical-align:top">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
                </tr>`
                )
                .join("")}
            </table>
            <p style="font-size:14px;color:#6b6b6b;margin:0">
              Rua D. João IV nº23 R/CH, 4590-578 Paços de Ferreira<br>
              Segunda a Sexta: 10h00 – 18h00 · Sábado: 10h00 – 13h00
            </p>
          </div>
        `,
      }),
    }).catch(() => null);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
