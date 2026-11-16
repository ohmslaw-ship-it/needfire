import type { ReactNode } from "react";

type SheetProps = {
  children: ReactNode;
};

export function Sheet({ children }: SheetProps) {
  return (
    <div
      className="relative z-[1] grid min-h-[calc(100vh-56px)] grid-cols-[200px_minmax(0,1fr)_376px] overflow-hidden rounded-[28px] bg-sheet shadow-[0_40px_80px_-40px_rgba(20,30,50,0.35)] backdrop-blur-[40px] backdrop-saturate-[1.2] m-[var(--nf-shell-margin)]"
    >
      {children}
    </div>
  );
}