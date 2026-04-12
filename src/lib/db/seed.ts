/**
 * Seeds default categories for a newly created family group.
 */
import { db } from "./index";
import { categories } from "./schema";
import { generateId } from "@/lib/utils";

export const DEFAULT_CATEGORIES = [
  { name: "Household", type: "expense" as const },
  { name: "Travel & Trips", type: "expense" as const },
  { name: "Entertainment", type: "expense" as const },
  { name: "Goods & Shopping", type: "expense" as const },
  { name: "Financial Commitments", type: "expense" as const },
  { name: "Savings", type: "savings" as const },
] as const;

export async function seedDefaultCategories(familyId: string) {
  const rows = DEFAULT_CATEGORIES.map((c) => ({
    id: generateId(),
    familyId,
    name: c.name,
    type: c.type,
    isDefault: true,
  }));

  await db.insert(categories).values(rows);
}
