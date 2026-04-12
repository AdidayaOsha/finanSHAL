/**
 * Seeds dummy transactions and budgets for adidayaosha@gmail.com
 * Run with: npm run db:seed-dummy
 */
import { db } from "./index";
import { users, categories, transactions, budgets } from "./schema";
import { eq } from "drizzle-orm";
import { generateId, getCurrentMonthYear } from "@/lib/utils";

async function main() {
  const user = await db.query.users.findFirst({
    where: eq(users.email, "adidayaosha@gmail.com"),
  });

  if (!user?.familyId) {
    console.error("User or familyId not found.");
    process.exit(1);
  }

  const familyId = user.familyId;
  const userId = user.id;

  const cats = await db.select().from(categories).where(eq(categories.familyId, familyId));
  const byName = Object.fromEntries(cats.map((c) => [c.name, c]));

  const monthYear = getCurrentMonthYear();
  const now = new Date();

  // Seed transactions spread across this month
  const txData = [
    { name: "Household", notes: "Groceries at supermarket", amount: 350000, daysAgo: 1 },
    { name: "Travel & Trips", notes: "Grab to office", amount: 45000, daysAgo: 2 },
    { name: "Entertainment", notes: "Netflix subscription", amount: 186000, daysAgo: 3 },
    { name: "Household", notes: "Electricity bill", amount: 520000, daysAgo: 5 },
    { name: "Goods & Shopping", notes: "New shirt at mall", amount: 299000, daysAgo: 6 },
    { name: "Travel & Trips", notes: "Pertamina fuel", amount: 150000, daysAgo: 7 },
    { name: "Household", notes: "Makan siang warteg", amount: 35000, daysAgo: 8 },
    { name: "Financial Commitments", notes: "Car installment", amount: 2500000, daysAgo: 9 },
    { name: "Goods & Shopping", notes: "Tokopedia order", amount: 187500, daysAgo: 10 },
    { name: "Entertainment", notes: "Cinema with family", amount: 180000, daysAgo: 12 },
    { name: "Household", notes: "Warung makan dinner", amount: 85000, daysAgo: 13 },
    { name: "Savings", notes: "Monthly savings transfer", amount: 1000000, daysAgo: 14 },
    { name: "Travel & Trips", notes: "Toll charges", amount: 75000, daysAgo: 15 },
    { name: "Household", notes: "Indomaret grocery run", amount: 128000, daysAgo: 16 },
    { name: "Financial Commitments", notes: "Internet bill", amount: 350000, daysAgo: 18 },
  ];

  for (const tx of txData) {
    const cat = byName[tx.name];
    if (!cat) continue;
    const date = new Date(now);
    date.setDate(date.getDate() - tx.daysAgo);

    await db.insert(transactions).values({
      id: generateId(),
      familyId,
      userId,
      categoryId: cat.id,
      amount: tx.amount,
      currency: "IDR",
      notes: tx.notes,
      date,
      source: "web",
    });
  }

  console.log(`Inserted ${txData.length} transactions.`);

  // Seed budgets for this month
  const budgetData = [
    { name: "Household", limit: 1500000 },
    { name: "Travel & Trips", limit: 500000 },
    { name: "Entertainment", limit: 400000 },
    { name: "Goods & Shopping", limit: 600000 },
    { name: "Financial Commitments", limit: 3000000 },
    { name: "Savings", limit: 1000000 },
  ];

  for (const b of budgetData) {
    const cat = byName[b.name];
    if (!cat) continue;
    await db
      .insert(budgets)
      .values({
        id: generateId(),
        familyId,
        categoryId: cat.id,
        limitAmount: b.limit,
        monthYear,
      })
      .onConflictDoNothing();
  }

  console.log(`Inserted ${budgetData.length} budgets for ${monthYear}.`);
  console.log("Dummy seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
