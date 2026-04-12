"use client";

import { Globe } from "lucide-react";
import { useLang } from "@/lib/i18n/context";
import type { Lang } from "@/lib/i18n/translations";

const LANGUAGES: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "id", label: "Indonesia" },
];

export default function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="relative flex items-center gap-1.5 text-sm text-slate-600">
      <Globe className="h-4 w-4 shrink-0" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="appearance-none bg-transparent border-none cursor-pointer text-sm font-medium text-slate-600 hover:text-indigo-600 focus:outline-none pr-1"
        aria-label="Select language"
      >
        {LANGUAGES.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
