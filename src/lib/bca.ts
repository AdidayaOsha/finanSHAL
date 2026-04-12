/**
 * Generates a BCA deep-link for transferring money between accounts.
 * This uses BCA's undocumented deep-link scheme — no merchant API required.
 *
 * Format: https://m.klikbca.com/transfer?destination=<accountNumber>&amount=<amount>
 */
export function generateBcaDeepLink(params: {
  accountNumber: string;
  amount: number;
  description?: string;
}): string {
  const { accountNumber, amount, description } = params;
  const base = "https://m.klikbca.com/transfer";
  const query = new URLSearchParams({
    destination: accountNumber,
    amount: String(Math.round(amount)),
    ...(description ? { description } : {}),
  });
  return `${base}?${query.toString()}`;
}

/**
 * Splits a total amount among contributors.
 * Returns per-person share rounded to nearest 100 IDR.
 */
export function splitAmount(
  totalAmount: number,
  participants: number
): number {
  const raw = totalAmount / participants;
  return Math.round(raw / 100) * 100;
}
