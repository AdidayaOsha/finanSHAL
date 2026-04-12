/**
 * Standalone seed runner — seeds default categories for all families that have none.
 * Run with: npm run db:seed
 */
import { db } from "./index";
import { familyGroups, categories } from "./schema";
import { eq } from "drizzle-orm";
import { seedDefaultCategories } from "./seed";

async function main() {
  const families = await db.select().from(familyGroups);

  if (families.length === 0) {
    console.log("No family groups found — nothing to seed.");
    process.exit(0);
  }

  for (const family of families) {
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.familyId, family.id));

    if (existing.length > 0) {
      console.log(`Family "${family.name}" already has ${existing.length} categories — skipping.`);
      continue;
    }

    await seedDefaultCategories(family.id);
    console.log(`Seeded default categories for family "${family.name}".`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
