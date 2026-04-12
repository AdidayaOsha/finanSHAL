import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { transactions, users, categories } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import TransactionList from "@/components/dashboard/TransactionList";
import AddTransactionForm from "@/components/transactions/AddTransactionForm";
import PageHeader from "@/components/layout/PageHeader";

export default async function TransactionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const familyId = (session?.user as { familyId?: string })?.familyId;
  if (!familyId) return null;

  const allTransactions = await db
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
    .where(eq(transactions.familyId, familyId))
    .orderBy(desc(transactions.date))
    .limit(100);

  const familyCategories = await db
    .select()
    .from(categories)
    .where(and(eq(categories.familyId, familyId)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader titleKey="transactions.title" subtitleKey="transactions.subtitle" />
        <AddTransactionForm
          categories={familyCategories}
          userId={(session?.user?.id as string) ?? ""}
          familyId={familyId}
        />
      </div>
      <TransactionList transactions={allTransactions} showAll />
    </div>
  );
}
