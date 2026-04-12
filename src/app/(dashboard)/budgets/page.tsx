import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { budgets, categories, transactions } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { getCurrentMonthYear } from "@/lib/utils";
import BudgetOverview from "@/components/dashboard/BudgetOverview";

export default async function BudgetsPage() {
  const session = await auth();
  const familyId = (session?.user as { familyId?: string })?.familyId;
  if (!familyId) return null;

  const monthYear = getCurrentMonthYear();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const budgetRows = await db
    .select({
      id: budgets.id,
      familyId: budgets.familyId,
      categoryId: budgets.categoryId,
      limitAmount: budgets.limitAmount,
      monthYear: budgets.monthYear,
      categoryName: categories.name,
    })
    .from(budgets)
    .leftJoin(categories, eq(budgets.categoryId, categories.id))
    .where(and(eq(budgets.familyId, familyId), eq(budgets.monthYear, monthYear)));

  const txRows = await db
    .select({
      categoryId: transactions.categoryId,
      amount: transactions.amount,
      currency: transactions.currency,
    })
    .from(transactions)
    .where(and(eq(transactions.familyId, familyId), gte(transactions.date, startOfMonth)));

  const spentByCategoryId = txRows.reduce(
    (acc, t) => {
      if (t.currency !== "IDR") return acc;
      acc[t.categoryId] = (acc[t.categoryId] ?? 0) + t.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const budgetsWithSpent = budgetRows.map((b) => ({
    ...b,
    categoryName: b.categoryName ?? "Lainnya",
    spent: spentByCategoryId[b.categoryId] ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Anggaran</h1>
        <p className="text-slate-500 text-sm mt-1">
          Kelola batas pengeluaran bulanan per kategori
        </p>
      </div>
      <BudgetOverview budgets={budgetsWithSpent} showFull />
    </div>
  );
}
