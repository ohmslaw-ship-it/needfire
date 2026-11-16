import type { ReactNode } from "react";

type SheetProps = {
  children: ReactNode;
};

export function Sheet({ children }: SheetProps) {
  return (
    <div
      className="relative z-[1] grid min-h-0 flex-1 grid-cols-[200px_minmax(0,1fr)_376px] overflow-hidden rounded-[var(--nf-shell-radius)] border border-[var(--nf-sheet-border)] bg-sheet shadow-[0_1px_2px_rgba(22,24,29,0.04),0_12px_40px_-12px_rgba(22,24,29,0.10)]"
    >
      {children}
    </div>
  );
}