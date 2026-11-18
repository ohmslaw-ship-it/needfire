"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookSummary } from "@/lib/useBookSummary";

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`nf-type-body flex items-center gap-2 py-[7px] font-medium transition-colors duration-200 ${
        active ? "text-ink" : "text-ink-3 hover:text-ink-2"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          active ? "bg-ember" : "bg-transparent"
        }`}
        aria-hidden
      />
      {children}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { arrLabel, live } = useBookSummary();
  const onBrief = pathname === "/";
  const onAccounts = pathname === "/accounts";
  const onSettings = pathname === "/settings";

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden border-r border-line px-[var(--nf-sidebar-x)] py-[var(--nf-sidebar-y)]">
      <div
        className="font-display text-[26px] leading-none font-normal tracking-[-0.01em] [font-variation-settings:'SOFT'_100,'opsz'_40]"
        aria-label="Needfire"
      >
        <span className="text-[26px] leading-none" aria-hidden>
          Needf
          <span className="relative inline-block">
            ı
            <svg
              className="pointer-events-none absolute top-[-0.02em] left-1/2 h-[0.42em] w-[0.34em] -translate-x-1/2 fill-ember"
              viewBox="0 0 16 16"
              aria-hidden
            >
              <path d="M8 1.5c.4 2.3 3.4 3.6 3.4 7a3.4 3.4 0 0 1-6.8 0c0-1.6.8-2.5 1.6-3.3.2 1 .7 1.7 1.4 1.9-.4-2-.1-4 .4-5.6Z" />
            </svg>
          </span>
          re
        </span>
      </div>
      <p className="nf-type-label mt-2">A Monday brief for SaaS founders</p>
      <div className="nf-type-label mt-11 mb-2.5">Ledgerly · sample workspace</div>
      <nav className="flex flex-col gap-0.5">
        <NavLink href="/" active={onBrief}>
          Brief
        </NavLink>
        <NavLink href="/accounts" active={onAccounts}>
          Accounts
        </NavLink>
        <NavLink href="/settings" active={onSettings}>
          Settings
        </NavLink>
      </nav>
      <div className="mt-auto">
        <div className="nf-type-secondary tabular-nums">{live.critical} critical</div>
        <div className="nf-type-secondary tabular-nums">{arrLabel} at risk</div>
        <Link
          href="/case-study"
          className="nf-type-secondary mt-3 block font-medium text-ink-2 transition-colors duration-200 hover:text-ink"
        >
          Read the case study
        </Link>
      </div>
    </aside>
  );
}