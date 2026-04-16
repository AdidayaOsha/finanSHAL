"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLang } from "@/lib/i18n/context";

interface Props {
  mode: "signin" | "signup";
}

export default function EmailPasswordForm({ mode }: Props) {
  const { t } = useLang();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          name,
          email,
          password,
        });
        if (err) {
          setError(err.message ?? t("auth.invalidCredentials"));
          return;
        }
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
        });
        if (err) {
          setError(t("auth.invalidCredentials"));
          return;
        }
      }
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      {mode === "signup" && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {t("auth.name")}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("auth.name")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          {t("auth.email")}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("auth.emailPlaceholder")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          {t("auth.password")}
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("auth.passwordPlaceholder")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      {mode === "signup" && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {t("auth.confirmPassword")}
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm disabled:opacity-60"
      >
        {loading
          ? "..."
          : mode === "signup"
          ? t("auth.signUpWithEmail")
          : t("auth.signInWithEmail")}
      </button>
    </form>
  );
}
