"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  PixelCrown,
  PixelDashboard,
  PixelSword,
  PixelFlame,
  PixelChest,
  PixelChart,
  PixelLogout,
} from "@/components/ui/PixelIcons";
import { SVGProps, ReactElement } from "react";

type IconComponent = (p: SVGProps<SVGSVGElement>) => ReactElement;

const navItems: { href: string; label: string; icon: IconComponent; showBadge?: boolean }[] = [
  { href: "/dashboard",  label: "Dashboard",   icon: PixelDashboard },
  { href: "/quests",     label: "Quests",      icon: PixelSword     },
  { href: "/habits",     label: "Habits",      icon: PixelFlame     },
  { href: "/shop",       label: "Reward Shop", icon: PixelChest     },
  { href: "/stats",      label: "Stats",       icon: PixelChart, showBadge: true },
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
            <PixelCrown className="w-5 h-5 text-neon-yellow" />
          </div>
          <div>
            <p className="font-pixel text-neon-yellow text-[11px] text-glow-yellow leading-tight">
              MONARCH
            </p>
            <p className="font-pixel text-muted text-[8px] leading-tight mt-1">
              PROTOCOL
            </p>
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
          <PixelLogout className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
