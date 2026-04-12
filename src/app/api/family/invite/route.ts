import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { familyInvites, users, familyGroups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { z } from "zod";

const InviteSchema = z.object({
  email: z.string().email().optional(),
});

// POST /api/family/invite — generate an invite link (or email-specific invite)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const familyId = (session.user as { familyId?: string }).familyId;
  if (!familyId) {
    return NextResponse.json({ error: "No family group" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = InviteSchema.safeParse(body);

  const token = generateId();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(familyInvites).values({
    id: generateId(),
    familyId,
    invitedEmail: parsed.success ? (parsed.data.email ?? null) : null,
    token,
    expiresAt,
  });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join?token=${token}`;
  return NextResponse.json({ inviteUrl, expiresAt });
}

// GET /api/family/invite?token=xxx — accept invite
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const invite = await db.query.familyInvites.findFirst({
    where: eq(familyInvites.token, token),
  });

  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 410 });
  }

  // Move user to the invited family
  await db
    .update(users)
    .set({ familyId: invite.familyId })
    .where(eq(users.id, session.user.id));

  // Mark invite as used
  await db
    .update(familyInvites)
    .set({ usedAt: new Date() })
    .where(eq(familyInvites.token, token));

  const [family] = await db
    .select({ name: familyGroups.name })
    .from(familyGroups)
    .where(eq(familyGroups.id, invite.familyId));

  return NextResponse.json({ familyName: family?.name, success: true });
}
