"use client";

import { formatCurrency } from "@/lib/utils";
import { Wallet, Receipt, Users } from "lucide-react";
import { useLang } from "@/lib/i18n/context";

interface SummaryCardsProps {
  totalThisMonth: number;
  transactionCount: number;
  memberCount: number;
}

export default function SummaryCards({
  totalThisMonth,
  transactionCount,
  memberCount,
}: SummaryCardsProps) {
  const { t } = useLang();

  const cards = [
    {
      labelKey: "summary.totalThisMonth",
      value: formatCurrency(totalThisMonth),
      icon: Wallet,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      labelKey: "summary.transactions",
      value: transactionCount.toString(),
      icon: Receipt,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      labelKey: "summary.activeMembers",
      value: memberCount.toString(),
      icon: Users,
      color: "text-violet-600 bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ labelKey, value, icon: Icon, color }) => (
        <div
          key={labelKey}
          className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
        >
          <div className={`p-2.5 rounded-lg ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t(labelKey)}</p>
            <p className="text-xl font-bold text-slate-800">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
