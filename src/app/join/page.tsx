"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n/context";
import { authClient } from "@/lib/auth-client";

type Status = "loading" | "success" | "error" | "unauthenticated";

export default function JoinPage() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data: session, isPending } = authClient.useSession();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      // Redirect to login, then come back to this URL after auth
      router.push(`/login?callbackUrl=/join?token=${token}`);
      return;
    }

    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`/api/family/invite?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.success ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [token, session, isPending, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center space-y-4">
        <h1 className="text-lg font-semibold text-slate-800">{t("join.title")}</h1>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-slate-500">{t("join.joining")}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
            <p className="text-base font-medium text-slate-800">{t("join.success")}</p>
            <p className="text-sm text-slate-500">{t("join.successDesc")}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-2 w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              {t("join.goToDashboard")}
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <XCircle className="h-10 w-10 text-red-400" />
            <p className="text-sm text-slate-600">{t("join.error")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
