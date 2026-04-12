import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { budgets, categories, transactions } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { getCurrentMonthYear } from "@/lib/utils";
import BudgetOverview from "@/components/dashboard/BudgetOverview";
import SetBudgetModal from "@/components/budgets/SetBudgetModal";
import PageHeader from "@/components/layout/PageHeader";

export default async function BudgetsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const familyId = (session?.user as { familyId?: string })?.familyId;
  if (!familyId) return null;

  const monthYear = getCurrentMonthYear();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [budgetRows, txRows, familyCategories] = await Promise.all([
    db
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
      .where(and(eq(budgets.familyId, familyId), eq(budgets.monthYear, monthYear))),

    db
      .select({
        categoryId: transactions.categoryId,
        amount: transactions.amount,
        currency: transactions.currency,
      })
      .from(transactions)
      .where(and(eq(transactions.familyId, familyId), gte(transactions.date, startOfMonth))),

    db
      .select({ id: categories.id, familyId: categories.familyId, name: categories.name, type: categories.type })
      .from(categories)
      .where(eq(categories.familyId, familyId)),
  ]);

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
    categoryName: b.categoryName ?? "Other",
    spent: spentByCategoryId[b.categoryId] ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader titleKey="budgets.title" subtitleKey="budgets.subtitle" />
        <SetBudgetModal categories={familyCategories} />
      </div>
      <BudgetOverview budgets={budgetsWithSpent} showFull />
    </div>
  );
}
