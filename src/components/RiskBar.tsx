import type { AccountStatus } from "@/data/accounts";

const fillClass: Record<AccountStatus, string> = {
  critical: "bg-ember",
  watch: "bg-ink-2",
  healthy: "bg-[rgba(22,24,29,0.2)]",
};

export function RiskBar({
  risk,
  status,
}: {
  risk: number;
  status: AccountStatus;
}) {
  const width = Math.max(0, Math.min(100, risk));
  return (
    <span
      className="block h-[3px] w-14 overflow-hidden rounded-sm bg-[rgba(22,24,29,0.08)]"
      aria-hidden
    >
      <span
        className={`nf-risk-fill block h-full rounded-sm ${fillClass[status]}`}
        style={{ width: `${width}%` }}
      />
    </span>
  );
}

export function tableCellClass(selected: boolean) {
  return [
    "nf-table-cell transition-colors duration-150",
    "group-hover:bg-[rgba(22,24,29,0.03)]",
    selected ? "bg-[rgba(22,24,29,0.05)]" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
