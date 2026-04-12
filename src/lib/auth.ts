import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens, familyGroups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { seedDefaultCategories } from "@/lib/db/seed";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        try {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, user.id),
          });
          (session.user as { familyId?: string | null }).familyId =
            dbUser?.familyId ?? null;
        } catch (err) {
          console.error("[auth] session callback error:", err);
        }
      }
      return session;
    },
    async signIn({ user }) {
      if (!user.id) return true;
      try {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });
        if (dbUser && !dbUser.familyId) {
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
        }
      } catch (err) {
        console.error("[auth] signIn callback error:", err);
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});
