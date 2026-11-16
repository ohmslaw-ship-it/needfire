import { atRiskAccounts, atRiskTotalLabel } from "@/data/sample";

type AtRiskTableProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function AtRiskTable({ selectedId, onSelect }: AtRiskTableProps) {
  return (
    <section className="mt-12">
      <div className="mb-2 flex items-baseline gap-2.5">
        <h2 className="text-[15px] font-semibold tracking-[-0.005em]">
          At risk
        </h2>
        <span className="text-[13px] text-ink-3">{atRiskTotalLabel}</span>
        <span className="ml-auto text-[13px] font-semibold text-ink-2">
          View all
        </span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-line">
            <th className="pb-2.5 pt-2.5 text-left text-xs font-medium text-ink-3">
              Company
            </th>
            <th className="pb-2.5 pt-2.5 pr-4 text-right text-xs font-medium text-ink-3">
              ARR
            </th>
            <th className="pb-2.5 pt-2.5 pr-4 text-right text-xs font-medium text-ink-3">
              Risk
            </th>
            <th className="pb-2.5 pt-2.5 text-xs font-medium text-ink-3">
              {" "}
            </th>
            <th className="pb-2.5 pt-2.5 text-left text-xs font-medium text-ink-3">
              Reason
            </th>
            <th className="pb-2.5 pt-2.5 text-left text-xs font-medium text-ink-3">
              Renewal
            </th>
            <th className="pb-2.5 pt-2.5 text-left text-xs font-medium text-ink-3">
              Owner
            </th>
          </tr>
        </thead>
        <tbody>
          {atRiskAccounts.map((row) => {
            const selected = selectedId === row.id;
            return (
              <tr
                key={row.id}
                onClick={() => onSelect(row.id)}
                className="group cursor-pointer border-b border-line last:border-b-0"
              >
                <td
                  className={`whitespace-nowrap py-[13px] text-sm font-medium transition-colors duration-200 ${
                    selected
                      ? "bg-ink/[0.035] shadow-[-12px_0_0_rgba(22,24,29,0.035)]"
                      : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.name}
                </td>
                <td
                  className={`tabular-nums whitespace-nowrap py-[13px] pr-4 text-right text-sm transition-colors duration-200 ${
                    selected ? "bg-ink/[0.035]" : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.arr}
                </td>
                <td
                  className={`tabular-nums whitespace-nowrap py-[13px] pr-4 text-right text-sm font-semibold transition-colors duration-200 ${
                    selected ? "bg-ink/[0.035]" : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.risk}
                </td>
                <td
                  className={`w-[70px] py-[13px] transition-colors duration-200 ${
                    selected ? "bg-ink/[0.035]" : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  <span className="block h-[3px] w-14 rounded-sm bg-[rgba(22,24,29,0.08)]">
                    <i
                      className={`block h-full rounded-sm ${
                        row.tier === "watch"
                          ? "bg-[rgba(22,24,29,0.32)]"
                          : "bg-ink-2"
                      }`}
                      style={{ width: `${row.risk}%` }}
                    />
                  </span>
                </td>
                <td
                  className={`whitespace-nowrap py-[13px] text-sm text-ink-3 transition-colors duration-200 ${
                    selected ? "bg-ink/[0.035]" : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.reason}
                </td>
                <td
                  className={`tabular-nums whitespace-nowrap py-[13px] text-sm transition-colors duration-200 ${
                    selected ? "bg-ink/[0.035]" : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.renewal}
                </td>
                <td
                  className={`whitespace-nowrap py-[13px] text-sm text-ink-3 transition-colors duration-200 ${
                    selected
                      ? "bg-ink/[0.035] shadow-[12px_0_0_rgba(22,24,29,0.035)]"
                      : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.owner}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}