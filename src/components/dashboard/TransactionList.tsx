"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";
import { useLang } from "@/lib/i18n/context";

interface TransactionListProps {
  transactions: Partial<Transaction>[];
  showAll?: boolean;
}

export default function TransactionList({
  transactions,
  showAll,
}: TransactionListProps) {
  const { t } = useLang();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">
        {showAll ? t("transactionList.titleAll") : t("transactionList.titleRecent")}
      </h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">
          {t("transactionList.empty")}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {transactions.map((tx) => (
            <li key={tx.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {tx.notes ?? "—"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {tx.categoryName} · {tx.userName} ·{" "}
                  {tx.date ? formatDate(tx.date) : ""}
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-800 shrink-0">
                {formatCurrency(tx.amount ?? 0, tx.currency ?? "IDR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
