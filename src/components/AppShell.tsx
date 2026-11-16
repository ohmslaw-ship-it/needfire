"use client";

import { useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { CanvasWash } from "./CanvasWash";
import { ScrollCapsule } from "./ScrollCapsule";
import { Sheet } from "./Sheet";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  fixedHeader: ReactNode;
  children: ReactNode;
  drawer: (onScrollNode: (node: HTMLDivElement | null) => void) => ReactNode;
};

export function AppShell({ fixedHeader, children, drawer }: AppShellProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [mainScroller, setMainScroller] = useState<HTMLElement | null>(null);
  const [drawerScroller, setDrawerScroller] = useState<HTMLDivElement | null>(
    null,
  );

  return (
    <div className="relative isolate box-border flex h-dvh max-h-dvh w-full max-w-none flex-col overflow-hidden p-[var(--nf-shell-margin)]">
      <CanvasWash />
      <ScrollCapsule
        scrollElement={mainScroller}
        reducedMotion={reducedMotion}
      />
      <ScrollCapsule
        scrollElement={drawerScroller}
        reducedMotion={reducedMotion}
      />
      <Sheet>
        <Sidebar />
        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <div className="shrink-0 px-11 pt-[38px]">{fixedHeader}</div>
          <div
            ref={setMainScroller}
            className="nf-scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-11 pb-11"
          >
            {children}
          </div>
        </main>
        {drawer(setDrawerScroller)}
      </Sheet>
    </div>
  );
}