"use client";

import { formatCurrency } from "@/lib/utils";
import type { MemberContribution } from "@/types";
import { useLang } from "@/lib/i18n/context";

interface MemberContributionsProps {
  contributions: MemberContribution[];
  total: number;
}

const COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
];

export default function MemberContributions({
  contributions,
  total,
}: MemberContributionsProps) {
  const { t } = useLang();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 h-full">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">
        {t("contributions.title")}
      </h2>
      {contributions.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">
          {t("contributions.empty")}
        </p>
      ) : (
        <ul className="space-y-3">
          {contributions.map(({ userId, userName, total: memberTotal, percentage }, i) => (
            <li key={userId}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">{userName}</span>
                <span className="text-slate-500">{formatCurrency(memberTotal)}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${COLORS[i % COLORS.length]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{percentage}%</p>
            </li>
          ))}
        </ul>
      )}
      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 flex justify-between">
          <span>{t("contributions.total")}</span>
          <span className="font-semibold text-slate-800">{formatCurrency(total)}</span>
        </div>
      )}
    </div>
  );
}
