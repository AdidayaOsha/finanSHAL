const WA_API_URL = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

type TextMessage = {
  to: string;
  text: string;
};

export async function sendWhatsAppMessage({ to, text }: TextMessage) {
  const res = await fetch(WA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API error: ${err}`);
  }

  return res.json();
}

export function buildConfirmationMessage(params: {
  amount: number;
  currency: string;
  notes: string;
  categoryName: string;
}): string {
  const { amount, currency, notes, categoryName } = params;
  const formatted = new Intl.NumberFormat("id-ID").format(amount);
  return `✅ Tercatat!\n*${currency} ${formatted}* — ${notes}\nKategori: ${categoryName}`;
}

export function buildBudgetAlertMessage(params: {
  categoryName: string;
  spent: number;
  limit: number;
  currency: string;
}): string {
  const { categoryName, spent, limit, currency } = params;
  const pct = Math.round((spent / limit) * 100);
  const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);
  return (
    `⚠️ *Budget Alert!*\nKategori *${categoryName}* sudah ${pct}% terpakai.\n` +
    `${currency} ${fmt(spent)} dari ${currency} ${fmt(limit)}`
  );
}

export function buildClarificationMessage(): string {
  return "❓ Maaf, aku tidak mengenali nominalnya. Coba kirim seperti:\n*Makan 45000*\natau\n*Belanja 1.2jt di Indomaret*";
}
