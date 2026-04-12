export type User = {
  id: string;
  familyId: string;
  name: string;
  email: string;
  googleId: string | null;
  phoneNumber: string | null;
  createdAt: Date;
};

export type FamilyGroup = {
  id: string;
  name: string;
  createdAt: Date;
};

export type Category = {
  id: string;
  familyId: string;
  name: string;
  type: "expense" | "savings";
};

export type Transaction = {
  id: string;
  familyId: string;
  userId: string;
  categoryId: string;
  amount: number;
  currency: string;
  notes: string | null;
  date: Date;
  createdAt: Date;
  // joined fields
  userName?: string | null;
  categoryName?: string | null;
};

export type Budget = {
  id: string;
  familyId: string;
  categoryId: string;
  limitAmount: number;
  monthYear: string; // format: "YYYY-MM"
  // joined fields
  categoryName?: string;
  spent?: number;
};

export type TransactionInput = {
  amount: number;
  currency: string;
  notes: string;
  categoryId: string;
  date?: Date;
};

export type ParsedTransaction = {
  amount: number;
  currency: string;
  notes: string;
  categoryHint: string | null;
  confidence: "high" | "low";
};

export type SpendingByDay = {
  date: string;
  total: number;
};

export type MemberContribution = {
  userId: string;
  userName: string;
  total: number;
  percentage: number;
};
