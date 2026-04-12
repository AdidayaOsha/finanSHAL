import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { budgets } from "@/lib/db/schema";
import { z } from "zod";
import { generateId, getCurrentMonthYear } from "@/lib/utils";
import { and, eq } from "drizzle-orm";

const UpsertBudgetSchema = z.object({
  categoryId: z.string().min(1),
  limitAmount: z.number().positive(),
  monthYear: z.string().regex(/^\d{4}-\d{2}$/).optional(),
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
  const parsed = UpsertBudgetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { categoryId, limitAmount, monthYear = getCurrentMonthYear() } = parsed.data;

  // Upsert: delete existing budget for same category+month, then insert
  await db
    .delete(budgets)
    .where(
      and(
        eq(budgets.familyId, familyId),
        eq(budgets.categoryId, categoryId),
        eq(budgets.monthYear, monthYear)
      )
    );

  const id = generateId();
  await db.insert(budgets).values({ id, familyId, categoryId, limitAmount, monthYear });

  return NextResponse.json({ id }, { status: 201 });
}
