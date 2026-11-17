import type { ReactNode } from "react";

type SheetProps = {
  children: ReactNode;
  /** Brief and Accounts reserve a drawer column; Settings does not. */
  showDrawer?: boolean;
  /** When false the drawer column collapses and the table takes the width. */
  drawerOpen?: boolean;
  /** Case study and other reading layouts omit the nav column. */
  showSidebar?: boolean;
};

export function Sheet({
  children,
  showDrawer = false,
  drawerOpen = false,
  showSidebar = true,
}: SheetProps) {
  const columns = !showSidebar
    ? "minmax(0,1fr)"
    : showDrawer
      ? drawerOpen
        ? "200px minmax(0,1fr) 376px"
        : "200px minmax(0,1fr) 0px"
      : "200px minmax(0,1fr)";

  return (
    <div
      className="nf-sheet relative z-[1] grid h-full min-h-0 flex-1 overflow-hidden rounded-[var(--nf-shell-radius)] border border-[var(--nf-sheet-border)] bg-sheet shadow-[0_1px_2px_rgba(22,24,29,0.04),0_12px_40px_-12px_rgba(22,24,29,0.10)]"
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </div>
  );
}
