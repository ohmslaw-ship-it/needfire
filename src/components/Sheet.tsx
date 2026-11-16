import type { ReactNode } from "react";

type SheetProps = {
  children: ReactNode;
  /** Brief and Accounts use the account drawer column; Settings does not. */
  withDrawer?: boolean;
};

export function Sheet({ children, withDrawer = true }: SheetProps) {
  return (
    <div
      className={`relative z-[1] grid h-full min-h-0 flex-1 overflow-hidden rounded-[var(--nf-shell-radius)] border border-[var(--nf-sheet-border)] bg-sheet shadow-[0_1px_2px_rgba(22,24,29,0.04),0_12px_40px_-12px_rgba(22,24,29,0.10)] ${
        withDrawer
          ? "grid-cols-[200px_minmax(0,1fr)_376px]"
          : "grid-cols-[200px_minmax(0,1fr)]"
      }`}
    >
      {children}
    </div>
  );
}