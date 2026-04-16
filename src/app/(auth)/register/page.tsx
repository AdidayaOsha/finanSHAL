"use client";

import Link from "next/link";
import EmailPasswordForm from "@/components/auth/EmailPasswordForm";
import { useLang } from "@/lib/i18n/context";

export default function RegisterPage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-indigo-700">fINAn-SHAl</h1>
          <p className="text-slate-500 text-sm mt-1">{t("auth.signUpWithEmail")}</p>
        </div>
        <EmailPasswordForm mode="signup" />
        <p className="text-xs text-center text-slate-500">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </main>
  );
}
