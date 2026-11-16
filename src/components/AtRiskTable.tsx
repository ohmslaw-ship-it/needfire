import { atRiskAccounts, atRiskTotalLabel } from "@/data/sample";

type AtRiskTableProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function AtRiskTable({ selectedId, onSelect }: AtRiskTableProps) {
  return (
    <section className="mt-12">
      <div className="mb-2 flex items-baseline gap-2.5">
        <h2 className="nf-type-section">At risk</h2>
        <span className="nf-type-secondary">{atRiskTotalLabel}</span>
        <span className="nf-type-secondary ml-auto font-semibold text-ink-2">
          View all
        </span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-line">
            <th className="nf-type-label nf-table-cell text-left font-medium">
              Company
            </th>
            <th className="nf-type-label nf-table-cell pr-4 text-right font-medium">
              ARR
            </th>
            <th className="nf-type-label nf-table-cell pr-4 text-right font-medium">
              Risk
            </th>
            <th className="nf-type-label nf-table-cell font-medium"> </th>
            <th className="nf-type-label nf-table-cell text-left font-medium">
              Reason
            </th>
            <th className="nf-type-label nf-table-cell text-left font-medium">
              Renewal
            </th>
            <th className="nf-type-label nf-table-cell text-left font-medium">
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
                  className={`nf-type-body nf-table-cell whitespace-nowrap font-medium transition-colors duration-200 ${
                    selected
                      ? "bg-ink/[0.035] shadow-[-12px_0_0_rgba(22,24,29,0.035)]"
                      : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.name}
                </td>
                <td
                  className={`nf-type-body nf-table-cell tabular-nums whitespace-nowrap pr-4 text-right transition-colors duration-200 ${
                    selected ? "bg-ink/[0.035]" : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.arr}
                </td>
                <td
                  className={`nf-type-body nf-table-cell tabular-nums whitespace-nowrap pr-4 text-right font-semibold transition-colors duration-200 ${
                    selected ? "bg-ink/[0.035]" : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.risk}
                </td>
                <td
                  className={`nf-table-cell w-[70px] transition-colors duration-200 ${
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
                  className={`nf-type-secondary nf-table-cell whitespace-nowrap transition-colors duration-200 ${
                    selected ? "bg-ink/[0.035]" : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.reason}
                </td>
                <td
                  className={`nf-type-body nf-table-cell tabular-nums whitespace-nowrap transition-colors duration-200 ${
                    selected ? "bg-ink/[0.035]" : "group-hover:bg-ink/[0.02]"
                  }`}
                >
                  {row.renewal}
                </td>
                <td
                  className={`nf-type-secondary nf-table-cell whitespace-nowrap transition-colors duration-200 ${
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