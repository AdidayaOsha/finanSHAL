"use client";

import Link from "next/link";
import LoginButton from "@/components/auth/LoginButton";
import EmailPasswordForm from "@/components/auth/EmailPasswordForm";
import { useLang } from "@/lib/i18n/context";

export default function LoginPage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">fINAn-SHAl</h1>
          <p className="text-slate-500 text-sm mt-1">{t("auth.signInTitle")}</p>
        </div>
        <LoginButton />
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">{t("auth.or")}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <EmailPasswordForm mode="signin" />
        <p className="text-xs text-slate-500">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-indigo-600 hover:underline font-medium">
            {t("auth.register")}
          </Link>
        </p>
        <p className="text-xs text-slate-400">{t("auth.signInDisclaimer")}</p>
      </div>
    </main>
  );
}
