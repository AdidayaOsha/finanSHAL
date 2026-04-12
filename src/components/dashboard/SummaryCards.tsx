import { formatCurrency } from "@/lib/utils";
import { Wallet, Receipt, Users } from "lucide-react";

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
  const cards = [
    {
      label: "Total Bulan Ini",
      value: formatCurrency(totalThisMonth),
      icon: Wallet,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Transaksi",
      value: transactionCount.toString(),
      icon: Receipt,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Anggota Aktif",
      value: memberCount.toString(),
      icon: Users,
      color: "text-violet-600 bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
        >
          <div className={`p-2.5 rounded-lg ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-xl font-bold text-slate-800">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
