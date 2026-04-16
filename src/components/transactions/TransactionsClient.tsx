"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import TransactionList from "@/components/dashboard/TransactionList";
import { useLang } from "@/lib/i18n/context";
import type { Transaction } from "@/types";

type FilterType = "all" | "expense" | "savings";

interface FamilyMember {
  id: string;
  name: string | null;
}

interface TransactionsClientProps {
  initialTransactions: Partial<Transaction>[];
  familyMembers: FamilyMember[];
}

export default function TransactionsClient({
  initialTransactions,
  familyMembers,
}: TransactionsClientProps) {
  const { t } = useLang();

  const [type, setType] = useState<FilterType>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userId, setUserId] = useState("all");
  const [txList, setTxList] = useState<Partial<Transaction>[]>(initialTransactions);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchTransactions = useCallback(
    async (params: {
      type: FilterType;
      dateFrom: string;
      dateTo: string;
      userId: string;
    }) => {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
        if (params.dateTo) qs.set("dateTo", params.dateTo);
        if (params.type !== "all") qs.set("type", params.type);
        if (params.userId !== "all") qs.set("userId", params.userId);

        const res = await fetch(`/api/transactions?${qs.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setTxList(data);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Re-fetch whenever type or member changes immediately
  useEffect(() => {
    fetchTransactions({ type, dateFrom, dateTo, userId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, userId]);

  // Debounce date changes (300ms) so typing doesn't fire on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchTransactions({ type, dateFrom, dateTo, userId });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo]);

  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: t("filters.all") },
    { key: "expense", label: t("filters.expense") },
    { key: "savings", label: t("filters.savings") },
  ];

  return (
    <div className="space-y-4">
      {/* Type tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setType(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              type === tab.key
                ? "bg-indigo-600 text-white"
                : "border border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {t("filters.dateFrom")}
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {t("filters.dateTo")}
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {t("filters.filterByMember")}
          </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">{t("filters.allMembers")}</option>
            {familyMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name ?? m.id}
              </option>
            ))}
          </select>
        </div>
        {(dateFrom || dateTo || userId !== "all") && (
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setUserId("all");
            }}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Transaction list */}
      <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : ""}>
        <TransactionList transactions={txList} showAll />
      </div>
    </div>
  );
}
