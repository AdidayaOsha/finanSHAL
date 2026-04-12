"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, X } from "lucide-react";
import type { Category } from "@/types";
import { useLang } from "@/lib/i18n/context";

interface SetBudgetModalProps {
  categories: Category[];
}

export default function SetBudgetModal({ categories }: SetBudgetModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useLang();

  const expenseCategories = categories.filter((c) => c.type === "expense");

  const [form, setForm] = useState({
    categoryId: expenseCategories[0]?.id ?? "",
    limitAmount: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const limitAmount = parseFloat(form.limitAmount);
    if (!limitAmount || limitAmount <= 0) return;

    startTransition(async () => {
      await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: form.categoryId, limitAmount }),
      });
      setOpen(false);
      setForm({ categoryId: expenseCategories[0]?.id ?? "", limitAmount: "" });
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <PlusCircle className="h-4 w-4" />
        {t("setBudget.button")}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-800">
                {t("setBudget.modalTitle")}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("setBudget.category")}
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("setBudget.limit")}
                </label>
                <input
                  type="number"
                  name="limitAmount"
                  value={form.limitAmount}
                  onChange={handleChange}
                  placeholder="1000000"
                  min="1"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 text-sm"
              >
                {isPending ? t("setBudget.saving") : t("setBudget.save")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
