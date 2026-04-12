import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { z } from "zod";
import { generateId } from "@/lib/utils";

const CreateTransactionSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(2).max(4).default("IDR"),
  notes: z.string().optional(),
  date: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const familyId = (session.user as { familyId?: string }).familyId;
  if (!familyId) {
    return NextResponse.json({ error: "No family group" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = CreateTransactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { categoryId, amount, currency, notes, date } = parsed.data;

  const id = generateId();
  await db.insert(transactions).values({
    id,
    familyId,
    userId: session.user.id,
    categoryId,
    amount,
    currency,
    notes: notes ?? null,
    date: date ? new Date(date) : new Date(),
    source: "web",
  });

  return NextResponse.json({ id }, { status: 201 });
}
