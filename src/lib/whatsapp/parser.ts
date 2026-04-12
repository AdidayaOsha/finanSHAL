import type { ParsedTransaction } from "@/types";

// Indonesian number words
const NUMBER_WORDS: Record<string, number> = {
  ribu: 1_000,
  rb: 1_000,
  k: 1_000,
  juta: 1_000_000,
  jt: 1_000_000,
  miliar: 1_000_000_000,
  m: 1_000_000_000,
};

// Category keyword hints (maps to category names)
const CATEGORY_HINTS: Record<string, string> = {
  makan: "Household",
  minum: "Household",
  belanja: "Goods & Shopping",
  groceries: "Household",
  bensin: "Travel & Trips",
  bbm: "Travel & Trips",
  grab: "Travel & Trips",
  gojek: "Travel & Trips",
  ojek: "Travel & Trips",
  hotel: "Travel & Trips",
  tiket: "Travel & Trips",
  travel: "Travel & Trips",
  film: "Entertainment",
  bioskop: "Entertainment",
  netflix: "Entertainment",
  spotify: "Entertainment",
  cicilan: "Financial Commitments",
  tagihan: "Financial Commitments",
  listrik: "Financial Commitments",
  internet: "Financial Commitments",
  wifi: "Financial Commitments",
  tabungan: "Savings",
  nabung: "Savings",
};

function parseAmount(raw: string): number | null {
  // Normalize: lowercase, remove dots used as thousand separators
  const normalized = raw.toLowerCase().replace(/\./g, "").replace(/,/g, ".");

  // Pattern: number followed by optional word multiplier (e.g., "45rb", "1.5jt")
  const match = normalized.match(/^([\d.]+)\s*(ribu|rb|k|juta|jt|miliar|m)?$/);
  if (!match) return null;

  const base = parseFloat(match[1]);
  const multiplier = match[2] ? NUMBER_WORDS[match[2]] ?? 1 : 1;
  return base * multiplier;
}

function extractCategoryHint(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_HINTS)) {
    if (lower.includes(keyword)) return category;
  }
  return null;
}

/**
 * Parses a free-form WhatsApp message into a structured transaction.
 *
 * Accepts:
 *   - "Makan 45000 food"
 *   - "Habis 45rb buat makan siang"
 *   - "45000 makan siang"
 *   - "belanja 1.2jt di supermarket"
 */
export function parseWhatsAppMessage(message: string): ParsedTransaction | null {
  const cleaned = message.trim();

  // Extract all number-like tokens (with optional multiplier)
  const tokenPattern = /\b([\d.,]+)\s*(ribu|rb|k|juta|jt|miliar|m)?\b/gi;
  const matches = [...cleaned.matchAll(tokenPattern)];

  let amount: number | null = null;
  let amountToken = "";

  for (const match of matches) {
    const candidate = parseAmount(match[0].trim());
    if (candidate && candidate >= 100) {
      amount = candidate;
      amountToken = match[0];
      break;
    }
  }

  if (!amount) return null;

  // Remove the amount token from the message to get notes
  const notes = cleaned.replace(amountToken, "").replace(/\s+/g, " ").trim();

  // Detect currency (default IDR)
  let currency = "IDR";
  if (/\$|usd/i.test(cleaned)) currency = "USD";
  else if (/sgd|s\$/i.test(cleaned)) currency = "SGD";
  else if (/myr|rm\s/i.test(cleaned)) currency = "MYR";

  const categoryHint = extractCategoryHint(cleaned);

  return {
    amount,
    currency,
    notes: notes || cleaned,
    categoryHint,
    confidence: categoryHint ? "high" : "low",
  };
}
