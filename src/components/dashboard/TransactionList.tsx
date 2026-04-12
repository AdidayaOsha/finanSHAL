import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Partial<Transaction>[];
  showAll?: boolean;
}

export default function TransactionList({
  transactions,
  showAll,
}: TransactionListProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">
        {showAll ? "Semua Transaksi" : "Transaksi Terbaru"}
      </h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">
          Belum ada transaksi
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <li key={t.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {t.notes ?? "—"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.categoryName} · {t.userName} ·{" "}
                  {t.date ? formatDate(t.date) : ""}
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-800 shrink-0">
                {formatCurrency(t.amount ?? 0, t.currency ?? "IDR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
