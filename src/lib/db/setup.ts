/**
 * Direct DB setup — creates all tables without drizzle-kit.
 * Run once: npx tsx src/lib/db/setup.ts
 */
import Database from "better-sqlite3";

const DATABASE_URL = process.env.DATABASE_URL ?? "./finanshal_v2.db";
const db = new Database(DATABASE_URL);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS "family_groups" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "created_at" integer
  );

  CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text,
    "email" text NOT NULL UNIQUE,
    "emailVerified" integer,
    "image" text,
    "family_id" text REFERENCES "family_groups"("id"),
    "phone_number" text UNIQUE,
    "created_at" integer
  );

  CREATE TABLE IF NOT EXISTS "account" (
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "type" text NOT NULL,
    "provider" text NOT NULL,
    "providerAccountId" text NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" integer,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    PRIMARY KEY ("provider", "providerAccountId")
  );

  CREATE TABLE IF NOT EXISTS "session" (
    "sessionToken" text PRIMARY KEY NOT NULL,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "expires" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "verificationToken" (
    "identifier" text NOT NULL,
    "token" text NOT NULL,
    "expires" integer NOT NULL,
    PRIMARY KEY ("identifier", "token")
  );

  CREATE TABLE IF NOT EXISTS "categories" (
    "id" text PRIMARY KEY NOT NULL,
    "family_id" text NOT NULL REFERENCES "family_groups"("id"),
    "name" text NOT NULL,
    "type" text NOT NULL DEFAULT 'expense',
    "is_default" integer NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS "transactions" (
    "id" text PRIMARY KEY NOT NULL,
    "family_id" text NOT NULL REFERENCES "family_groups"("id"),
    "user_id" text NOT NULL REFERENCES "user"("id"),
    "category_id" text NOT NULL REFERENCES "categories"("id"),
    "amount" real NOT NULL,
    "currency" text NOT NULL DEFAULT 'IDR',
    "notes" text,
    "date" integer NOT NULL,
    "source" text NOT NULL DEFAULT 'web',
    "created_at" integer
  );

  CREATE TABLE IF NOT EXISTS "budgets" (
    "id" text PRIMARY KEY NOT NULL,
    "family_id" text NOT NULL REFERENCES "family_groups"("id"),
    "category_id" text NOT NULL REFERENCES "categories"("id"),
    "limit_amount" real NOT NULL,
    "month_year" text NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "family_invites" (
    "id" text PRIMARY KEY NOT NULL,
    "family_id" text NOT NULL REFERENCES "family_groups"("id"),
    "invited_email" text,
    "token" text NOT NULL UNIQUE,
    "expires_at" integer NOT NULL,
    "used_at" integer
  );
`);

console.log("✅ Database tables created successfully:", DATABASE_URL);
db.close();
