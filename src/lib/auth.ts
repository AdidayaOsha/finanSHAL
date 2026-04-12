import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { users, sessions, accounts, verifications, familyGroups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { seedDefaultCategories } from "@/lib/db/seed";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  user: {
    additionalFields: {
      familyId: {
        type: "string",
        nullable: true,
        input: false,
      },
      phoneNumber: {
        type: "string",
        nullable: true,
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const familyId = generateId();
            await db.insert(familyGroups).values({
              id: familyId,
              name: `${user.name ?? "My"}'s Family`,
            });
            await db
              .update(users)
              .set({ familyId })
              .where(eq(users.id, user.id));
            await seedDefaultCategories(familyId);
          } catch (err) {
            console.error("[auth] post-create hook error:", err);
          }
        },
      },
    },
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});
