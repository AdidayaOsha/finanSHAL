import {
  sqliteTable,
  text,
  real,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── NextAuth required tables ────────────────────────────────────────────────
// Column names and types must match @auth/drizzle-adapter expectations exactly.

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  // App-specific additions
  familyId: text("family_id").references(() => familyGroups.id),
  phoneNumber: text("phone_number").unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// ─── App tables ───────────────────────────────────────────────────────────────

export const familyGroups = sqliteTable("family_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  familyId: text("family_id")
    .notNull()
    .references(() => familyGroups.id),
  name: text("name").notNull(),
  type: text("type", { enum: ["expense", "savings"] })
    .notNull()
    .default("expense"),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  familyId: text("family_id")
    .notNull()
    .references(() => familyGroups.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("IDR"),
  notes: text("notes"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  source: text("source", { enum: ["whatsapp", "web"] })
    .notNull()
    .default("web"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

export const budgets = sqliteTable("budgets", {
  id: text("id").primaryKey(),
  familyId: text("family_id")
    .notNull()
    .references(() => familyGroups.id),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  limitAmount: real("limit_amount").notNull(),
  monthYear: text("month_year").notNull(), // YYYY-MM
});

export const familyInvites = sqliteTable("family_invites", {
  id: text("id").primaryKey(),
  familyId: text("family_id")
    .notNull()
    .references(() => familyGroups.id),
  invitedEmail: text("invited_email"),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  usedAt: integer("used_at", { mode: "timestamp" }),
});
