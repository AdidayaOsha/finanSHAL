"use client";

import { LogOut, Download } from "lucide-react";
import { useLang } from "@/lib/i18n/context";
import LangSwitcher from "./LangSwitcher";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const { t } = useLang();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="md:hidden font-bold text-indigo-700 text-lg">fINAn-SHAl</div>

      <div className="ml-auto flex items-center gap-3">
        {/* Export button */}
        <a
          href="/api/export?format=xlsx"
          className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          {t("navbar.export")}
        </a>

        {/* Language switcher */}
        <LangSwitcher />

        {/* User info */}
        <div className="flex items-center gap-2">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "User"}
              className="h-8 w-8 rounded-full"
            />
          )}
          <span className="hidden sm:block text-sm font-medium text-slate-700">
            {user.name}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded"
          title={t("navbar.signOut")}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
