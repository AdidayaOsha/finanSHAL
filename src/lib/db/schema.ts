import {
  pgTable,
  text,
  boolean,
  timestamp,
  doublePrecision,
  primaryKey,
} from "drizzle-orm/pg-core";

// ─── Better Auth required tables ─────────────────────────────────────────────

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  // App-specific additions
  familyId: text("family_id").references(() => familyGroups.id),
  phoneNumber: text("phone_number").unique(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ─── App tables ───────────────────────────────────────────────────────────────

export const familyGroups = pgTable("family_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  familyId: text("family_id")
    .notNull()
    .references(() => familyGroups.id),
  name: text("name").notNull(),
  type: text("type", { enum: ["expense", "savings"] })
    .notNull()
    .default("expense"),
  isDefault: boolean("is_default").notNull().default(false),
});

export const transactions = pgTable("transactions", {
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
  amount: doublePrecision("amount").notNull(),
  currency: text("currency").notNull().default("IDR"),
  notes: text("notes"),
  date: timestamp("date").notNull(),
  source: text("source", { enum: ["whatsapp", "web"] })
    .notNull()
    .default("web"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});

export const budgets = pgTable("budgets", {
  id: text("id").primaryKey(),
  familyId: text("family_id")
    .notNull()
    .references(() => familyGroups.id),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  limitAmount: doublePrecision("limit_amount").notNull(),
  monthYear: text("month_year").notNull(), // YYYY-MM
});

export const familyInvites = pgTable("family_invites", {
  id: text("id").primaryKey(),
  familyId: text("family_id")
    .notNull()
    .references(() => familyGroups.id),
  invitedEmail: text("invited_email"),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
});
