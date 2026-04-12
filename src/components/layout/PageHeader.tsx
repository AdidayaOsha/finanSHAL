"use client";

import { useLang } from "@/lib/i18n/context";

interface PageHeaderProps {
  titleKey: string;
  subtitleKey?: string;
}

export default function PageHeader({ titleKey, subtitleKey }: PageHeaderProps) {
  const { t } = useLang();
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">{t(titleKey)}</h1>
      {subtitleKey && (
        <p className="text-slate-500 text-sm mt-1">{t(subtitleKey)}</p>
      )}
    </div>
  );
}
