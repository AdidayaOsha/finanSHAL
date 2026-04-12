import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, familyGroups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import InviteMemberModal from "@/components/family/InviteMemberModal";

export default async function SettingsPage() {
  const session = await auth();
  const familyId = (session?.user as { familyId?: string })?.familyId;
  if (!familyId) return null;

  const [family] = await db
    .select()
    .from(familyGroups)
    .where(eq(familyGroups.id, familyId));

  const members = await db
    .select({ id: users.id, name: users.name, email: users.email, image: users.image })
    .from(users)
    .where(eq(users.familyId, familyId));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola keluarga dan akun Anda</p>
      </div>

      {/* Family info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-700">Grup Keluarga</h2>
        <p className="text-sm text-slate-500">
          Nama grup: <span className="font-medium text-slate-800">{family?.name}</span>
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Anggota ({members.length})</p>
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 text-sm text-slate-600">
                {m.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image!} alt={m.name ?? ""} className="w-7 h-7 rounded-full" />
                )}
                <div>
                  <p className="font-medium text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <InviteMemberModal familyId={familyId} />
      </div>

      {/* WhatsApp setup hint */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-5 space-y-2">
        <h2 className="font-semibold text-indigo-700">Hubungkan WhatsApp</h2>
        <p className="text-sm text-slate-600">
          Tambahkan nomor WhatsApp kamu ke profil agar pencatatan via WA langsung
          terhubung ke akun ini.
        </p>
      </div>
    </div>
  );
}
