"use client";

import type { ReactNode } from "react";
import { CanvasWash } from "./CanvasWash";
import { ScrollArea } from "./ScrollArea";
import { Sheet } from "./Sheet";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  fixedHeader?: ReactNode;
  children: ReactNode;
  /** Account drawer. Omit on Settings. */
  drawer?: ReactNode;
  /** Slides the drawer column open. Ignored when `drawer` is omitted. */
  drawerOpen?: boolean;
  /** Constrains and centers main column content (e.g. Settings). */
  contentMaxWidth?: number;
};

function ContentColumn({
  maxWidth,
  children,
}: {
  maxWidth?: number;
  children: ReactNode;
}) {
  if (!maxWidth) return children;
  return (
    <div className="mx-auto w-full" style={{ maxWidth }}>
      {children}
    </div>
  );
}

export function AppShell({
  fixedHeader,
  children,
  drawer,
  drawerOpen = false,
  contentMaxWidth,
}: AppShellProps) {
  const showDrawer = drawer != null;

  return (
    <div className="relative isolate box-border flex h-dvh max-h-dvh w-full max-w-none flex-col overflow-hidden p-[var(--nf-shell-margin)]">
      <CanvasWash />
      <Sheet showDrawer={showDrawer} drawerOpen={showDrawer && drawerOpen}>
        <Sidebar />
        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          {fixedHeader != null ? (
            <div className="shrink-0 px-[var(--nf-pad-x)] pt-[var(--nf-pad-top)]">
              <ContentColumn maxWidth={contentMaxWidth}>
                <div className="w-full min-w-0">{fixedHeader}</div>
              </ContentColumn>
            </div>
          ) : null}
          <ScrollArea className="min-h-0 flex-1">
            <div
              className={`w-full min-w-0 px-[var(--nf-pad-x)] pb-[var(--nf-pad-bottom)]${
                fixedHeader == null ? " pt-[var(--nf-pad-top)]" : ""
              }`}
            >
              <ContentColumn maxWidth={contentMaxWidth}>
                <div className="w-full min-w-0">{children}</div>
              </ContentColumn>
            </div>
          </ScrollArea>
        </main>
        {showDrawer ? (
          <div className="min-w-0 overflow-hidden">{drawer}</div>
        ) : null}
      </Sheet>
    </div>
  );
}
