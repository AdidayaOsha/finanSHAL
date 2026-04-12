import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { transactions, users, categories, budgets } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { getCurrentMonthYear } from "@/lib/utils";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SpendingChart from "@/components/dashboard/SpendingChart";
import MemberContributions from "@/components/dashboard/MemberContributions";
import BudgetOverview from "@/components/dashboard/BudgetOverview";
import TransactionList from "@/components/dashboard/TransactionList";

export default async function DashboardPage() {
  const session = await auth();
  const familyId = (session?.user as { familyId?: string })?.familyId;

  if (!familyId) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Keluarga tidak ditemukan. Hubungi administrator.
      </div>
    );
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthYear = getCurrentMonthYear();

  // Fetch this month's transactions
  const monthlyTransactions = await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      currency: transactions.currency,
      notes: transactions.notes,
      date: transactions.date,
      userName: users.name,
      categoryName: categories.name,
      userId: transactions.userId,
    })
    .from(transactions)
    .leftJoin(users, eq(transactions.userId, users.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.familyId, familyId),
        gte(transactions.date, startOfMonth)
      )
    )
    .orderBy(sql`${transactions.date} desc`)
    .limit(50);

  // Total this month (IDR only for summary card)
  const totalThisMonth = monthlyTransactions
    .filter((t) => t.currency === "IDR")
    .reduce((sum, t) => sum + t.amount, 0);

  // Member contributions
  const contributionMap = new Map<
    string,
    { userName: string; total: number }
  >();
  for (const t of monthlyTransactions) {
    if (!t.userId || t.currency !== "IDR") continue;
    const existing = contributionMap.get(t.userId);
    if (existing) {
      existing.total += t.amount;
    } else {
      contributionMap.set(t.userId, {
        userName: t.userName ?? "Unknown",
        total: t.amount,
      });
    }
  }
  const contributions = Array.from(contributionMap.entries()).map(
    ([userId, data]) => ({
      userId,
      userName: data.userName,
      total: data.total,
      percentage:
        totalThisMonth > 0
          ? Math.round((data.total / totalThisMonth) * 100)
          : 0,
    })
  );

  // Spending by day (last 30 days)
  const spendingByDay = monthlyTransactions
    .filter((t) => t.currency === "IDR")
    .reduce(
      (acc, t) => {
        const dateKey = new Date(t.date).toISOString().slice(0, 10);
        acc[dateKey] = (acc[dateKey] ?? 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>
    );

  const chartData = Object.entries(spendingByDay)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Budgets
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
    .where(
      and(eq(budgets.familyId, familyId), eq(budgets.monthYear, monthYear))
    );

  // Compute spent per category
  const spentByCategory = monthlyTransactions.reduce(
    (acc, t) => {
      if (t.currency !== "IDR") return acc;
      acc[t.categoryName ?? ""] = (acc[t.categoryName ?? ""] ?? 0) + t.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const budgetsWithSpent = budgetRows.map((b) => ({
    ...b,
    categoryName: b.categoryName ?? "Lainnya",
    spent: spentByCategory[b.categoryName ?? ""] ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dasbor Keluarga</h1>
        <p className="text-slate-500 text-sm mt-1">
          Ringkasan keuangan bulan ini
        </p>
      </div>

      <SummaryCards
        totalThisMonth={totalThisMonth}
        transactionCount={monthlyTransactions.length}
        memberCount={contributionMap.size}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart data={chartData} />
        </div>
        <div>
          <MemberContributions
            contributions={contributions}
            total={totalThisMonth}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetOverview budgets={budgetsWithSpent} />
        <TransactionList transactions={monthlyTransactions.slice(0, 10)} />
      </div>
    </div>
  );
}
