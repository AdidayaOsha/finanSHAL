import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { transactions, users, categories } from "@/lib/db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const familyId = (session.user as { familyId?: string }).familyId;
  if (!familyId) return NextResponse.json({ error: "No family group" }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const type = searchParams.get("type") ?? "all";
  const userId = searchParams.get("userId") ?? "all";

  const conditions = [eq(transactions.familyId, familyId)];
  if (dateFrom) conditions.push(gte(transactions.date, new Date(dateFrom)));
  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    conditions.push(lte(transactions.date, to));
  }
  if (type !== "all") conditions.push(eq(categories.type, type as "expense" | "savings"));
  if (userId !== "all") conditions.push(eq(transactions.userId, userId));

  const rows = await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      currency: transactions.currency,
      notes: transactions.notes,
      date: transactions.date,
      userId: transactions.userId,
      userName: users.name,
      categoryName: categories.name,
      categoryType: categories.type,
    })
    .from(transactions)
    .leftJoin(users, eq(transactions.userId, users.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(transactions.date))
    .limit(200);

  return NextResponse.json(rows);
}

const CreateTransactionSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(2).max(4).default("IDR"),
  notes: z.string().optional(),
  date: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
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
    userId: session.user.id as string,
    categoryId,
    amount,
    currency,
    notes: notes ?? null,
    date: date ? new Date(date) : new Date(),
    source: "web",
  });

  return NextResponse.json({ id }, { status: 201 });
}
