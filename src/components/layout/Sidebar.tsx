"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, PiggyBank, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n/context";

const navItems = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/transactions", labelKey: "nav.transactions", icon: ArrowLeftRight },
  { href: "/budgets", labelKey: "nav.budgets", icon: PiggyBank },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-slate-200">
        <span className="font-bold text-indigo-700 text-lg">fINAn-SHAl</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, labelKey, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {t(labelKey)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
