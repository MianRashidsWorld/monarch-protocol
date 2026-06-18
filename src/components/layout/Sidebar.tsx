"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Sword, Flame, ShoppingBag, BarChart3, LogOut, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quests", label: "Quests", icon: Sword },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/shop", label: "Reward Shop", icon: ShoppingBag },
  { href: "/stats", label: "Stats", icon: BarChart3, showBadge: true },
];

interface SidebarProps {
  unallocatedPoints: number;
}

export default function Sidebar({ unallocatedPoints }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-background border border-neon-yellow/50 clip-card-sm flex items-center justify-center glow-yellow">
            <Crown className="w-5 h-5 text-neon-yellow" />
          </div>
          <div>
            <p className="font-display font-bold text-neon-yellow tracking-widest uppercase text-sm text-glow-yellow">
              Monarch
            </p>
            <p className="text-muted text-xs tracking-wider">Protocol</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, showBadge }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          const hasBadge = showBadge && unallocatedPoints > 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold tracking-wide transition-all relative",
                isActive
                  ? "text-neon-yellow bg-neon-yellow/10 border-l-2 border-neon-yellow"
                  : "text-muted hover:text-foreground hover:bg-surface-2 border-l-2 border-transparent"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
              {hasBadge && (
                <span className="ml-auto w-5 h-5 bg-neon-yellow text-background text-xs font-bold flex items-center justify-center rounded-full">
                  {unallocatedPoints}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-muted hover:text-neon-red transition-colors w-full tracking-wide"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
