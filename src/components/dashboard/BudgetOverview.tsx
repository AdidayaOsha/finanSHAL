"use client";

import { formatCurrency } from "@/lib/utils";
import type { Budget } from "@/types";
import { useLang } from "@/lib/i18n/context";

interface BudgetOverviewProps {
  budgets: (Budget & { spent: number })[];
  showFull?: boolean;
}

export default function BudgetOverview({ budgets, showFull }: BudgetOverviewProps) {
  const { t } = useLang();
  const displayed = showFull ? budgets : budgets.slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">
        {t("budgetOverview.title")}
      </h2>
      {displayed.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">
          {t("budgetOverview.empty")}
        </p>
      ) : (
        <ul className="space-y-4">
          {displayed.map((b) => {
            const pct = Math.min(
              b.limitAmount > 0 ? Math.round((b.spent / b.limitAmount) * 100) : 0,
              100
            );
            const over = b.spent > b.limitAmount;
            return (
              <li key={b.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{b.categoryName}</span>
                  <span className={over ? "text-red-500 font-semibold" : "text-slate-500"}>
                    {formatCurrency(b.spent)} / {formatCurrency(b.limitAmount)}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-red-500" : pct >= 80 ? "bg-amber-400" : "bg-indigo-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{pct}{t("budgetOverview.used")}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
