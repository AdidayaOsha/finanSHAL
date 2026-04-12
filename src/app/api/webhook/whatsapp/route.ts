import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, transactions, categories, budgets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { parseWhatsAppMessage } from "@/lib/whatsapp/parser";
import {
  sendWhatsAppMessage,
  buildConfirmationMessage,
  buildBudgetAlertMessage,
  buildClarificationMessage,
} from "@/lib/whatsapp/sender";
import { generateId, getCurrentMonthYear } from "@/lib/utils";

// Webhook verification (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// Incoming message handler (POST)
export async function POST(req: NextRequest) {
  const body = await req.json();

  const entry = body?.entry?.[0]?.changes?.[0]?.value;
  const message = entry?.messages?.[0];
  if (!message || message.type !== "text") {
    return NextResponse.json({ status: "ignored" });
  }

  const fromPhone = message.from as string;
  const text = message.text.body as string;

  // Look up user by phone number
  const user = await db.query.users.findFirst({
    where: eq(users.phoneNumber, fromPhone),
  });

  if (!user || !user.familyId) {
    await sendWhatsAppMessage({
      to: fromPhone,
      text: "Nomor WhatsApp ini belum terdaftar. Hubungkan nomor di halaman Pengaturan fINAn-SHAl.",
    });
    return NextResponse.json({ status: "unregistered" });
  }

  const parsed = parseWhatsAppMessage(text);

  if (!parsed) {
    await sendWhatsAppMessage({ to: fromPhone, text: buildClarificationMessage() });
    return NextResponse.json({ status: "clarification_needed" });
  }

  // Find matching category
  const familyCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.familyId, user.familyId));

  let matchedCategory = parsed.categoryHint
    ? familyCategories.find(
        (c) => c.name.toLowerCase() === parsed.categoryHint?.toLowerCase()
      )
    : null;

  // Fall back to first expense category
  if (!matchedCategory) {
    matchedCategory =
      familyCategories.find((c) => c.type === "expense") ?? familyCategories[0];
  }

  if (!matchedCategory) {
    await sendWhatsAppMessage({ to: fromPhone, text: buildClarificationMessage() });
    return NextResponse.json({ status: "no_category" });
  }

  // Save transaction
  const txId = generateId();
  await db.insert(transactions).values({
    id: txId,
    familyId: user.familyId,
    userId: user.id,
    categoryId: matchedCategory.id,
    amount: parsed.amount,
    currency: parsed.currency,
    notes: parsed.notes,
    date: new Date(),
    source: "whatsapp",
  });

  // Send confirmation
  await sendWhatsAppMessage({
    to: fromPhone,
    text: buildConfirmationMessage({
      amount: parsed.amount,
      currency: parsed.currency,
      notes: parsed.notes,
      categoryName: matchedCategory.name,
    }),
  });

  // Check budget alert (IDR only)
  if (parsed.currency === "IDR") {
    const monthYear = getCurrentMonthYear();
    const budget = await db.query.budgets.findFirst({
      where: and(
        eq(budgets.familyId, user.familyId),
        eq(budgets.categoryId, matchedCategory.id),
        eq(budgets.monthYear, monthYear)
      ),
    });

    if (budget) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthTxs = await db
        .select({ amount: transactions.amount })
        .from(transactions)
        .where(
          and(
            eq(transactions.familyId, user.familyId),
            eq(transactions.categoryId, matchedCategory.id)
          )
        );

      const spent = monthTxs.reduce((s, t) => s + t.amount, 0);
      if (spent >= budget.limitAmount * 0.8) {
        await sendWhatsAppMessage({
          to: fromPhone,
          text: buildBudgetAlertMessage({
            categoryName: matchedCategory.name,
            spent,
            limit: budget.limitAmount,
            currency: "IDR",
          }),
        });
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
