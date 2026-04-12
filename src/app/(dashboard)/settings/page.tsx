"use client";

import { useEffect, useState } from "react";
import InviteMemberModal from "@/components/family/InviteMemberModal";
import PageHeader from "@/components/layout/PageHeader";
import { useLang } from "@/lib/i18n/context";
import { authClient } from "@/lib/auth-client";

type Member = { id: string; name: string | null; email: string; image: string | null };
type FamilyData = { familyName: string | null; members: Member[] };

export default function SettingsPage() {
  const { t } = useLang();
  const { data: session } = authClient.useSession();
  const [data, setData] = useState<FamilyData | null>(null);

  const familyId = (session?.user as { familyId?: string })?.familyId;

  useEffect(() => {
    if (!familyId) return;
    fetch("/api/family")
      .then((r) => r.json())
      .then((json) => {
        setData({ familyName: json.familyName ?? null, members: json.members ?? [] });
      });
  }, [familyId]);

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader titleKey="settings.title" subtitleKey="settings.subtitle" />

      {/* Family info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">{t("settings.familyGroup")}</h2>
          {data?.familyName && (
            <span className="text-sm text-slate-500">{data.familyName}</span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">
            {t("settings.members")} ({data?.members.length ?? 0})
          </p>
          <ul className="space-y-2">
            {(data?.members ?? []).map((m) => (
              <li key={m.id} className="flex items-center gap-3 text-sm text-slate-600">
                {m.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image} alt={m.name ?? ""} className="w-7 h-7 rounded-full" />
                )}
                <div>
                  <p className="font-medium text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {familyId && <InviteMemberModal familyId={familyId} />}
      </div>

      {/* WhatsApp setup hint */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-5 space-y-2">
        <h2 className="font-semibold text-indigo-700">{t("settings.connectWhatsApp")}</h2>
        <p className="text-sm text-slate-600">{t("settings.connectWhatsAppDesc")}</p>
      </div>
    </div>
  );
}
