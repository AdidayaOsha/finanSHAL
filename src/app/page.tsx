"use client";

import { MessageCircle, BarChart3, Users, Shield } from "lucide-react";
import LoginButton from "@/components/auth/LoginButton";
import { useLang } from "@/lib/i18n/context";
import LangSwitcher from "@/components/layout/LangSwitcher";

export default function Home() {
  const { t } = useLang();

  const features = [
    { icon: MessageCircle, titleKey: "landing.whatsappFirst", descKey: "landing.whatsappFirstDesc" },
    { icon: BarChart3, titleKey: "landing.sharedDashboard", descKey: "landing.sharedDashboardDesc" },
    { icon: Users, titleKey: "landing.multiMember", descKey: "landing.multiMemberDesc" },
    { icon: Shield, titleKey: "landing.safeEasy", descKey: "landing.safeEasyDesc" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo & Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-end mb-2">
            <LangSwitcher />
          </div>
          <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">
            fINAn-SHAl
          </h1>
          <p className="text-lg text-slate-600">{t("landing.tagline")}</p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-4 text-left">
          {features.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
            >
              <Icon className="h-5 w-5 text-indigo-500 mb-2" />
              <p className="font-semibold text-sm text-slate-800">{t(titleKey)}</p>
              <p className="text-xs text-slate-500 mt-1">{t(descKey)}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-4">
          <p className="text-sm text-slate-600">{t("landing.cta")}</p>
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
