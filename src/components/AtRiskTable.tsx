"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { atRiskAccounts } from "@/data/sample";
import { useComputedAccounts } from "@/lib/useComputedAccounts";
import { useRowIntro } from "@/lib/useRowIntro";
import { RiskBar, tableCellClass } from "./RiskBar";

type AtRiskTableProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function AtRiskTable({ selectedId, onSelect }: AtRiskTableProps) {
  const accounts = useComputedAccounts();
  const rowMotion = useRowIntro();

  const { rows, totalLabel } = useMemo(() => {
    const byId = new Map(accounts.map((a) => [a.id, a]));
    const rows = atRiskAccounts.map((seed) => {
      const live = byId.get(seed.id);
      const risk = live?.risk ?? seed.risk;
      const status = live?.status ?? (seed.tier === "crit" ? "critical" : "watch");
      return {
        ...seed,
        arr: live?.arr ?? seed.arr,
        risk,
        status,
      };
    });
    const flagged = accounts.filter((a) => a.status !== "healthy").length;
    return { rows, totalLabel: `${flagged} accounts` };
  }, [accounts]);

  return (
    <section className="mt-[var(--nf-section-gap)]">
      <div className="mb-2 flex items-baseline gap-2.5">
        <h2 className="nf-type-section">At risk</h2>
        <span className="nf-type-secondary">{totalLabel}</span>
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
          {rows.map((row, index) => {
            const selected = selectedId === row.id;
            return (
              <motion.tr
                key={row.id}
                tabIndex={0}
                aria-selected={selected}
                onClick={() => onSelect(row.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(row.id);
                  }
                }}
                className="group cursor-pointer border-b border-line last:border-b-0"
                {...rowMotion(row.id, index)}
              >
                <td
                  className={`nf-type-body whitespace-nowrap ${selected ? "font-semibold" : "font-medium"} ${tableCellClass(selected)}`}
                >
                  {row.name}
                </td>
                <td
                  className={`nf-type-body tabular-nums whitespace-nowrap pr-4 text-right ${tableCellClass(selected)}`}
                >
                  {row.arr}
                </td>
                <td
                  className={`nf-type-body tabular-nums whitespace-nowrap pr-4 text-right font-semibold ${tableCellClass(selected)}`}
                >
                  {row.risk}
                </td>
                <td className={`w-[70px] ${tableCellClass(selected)}`}>
                  <RiskBar risk={row.risk} status={row.status} />
                </td>
                <td
                  className={`nf-type-body whitespace-nowrap text-ink-3 ${tableCellClass(selected)}`}
                >
                  {row.reason}
                </td>
                <td
                  className={`nf-type-body tabular-nums whitespace-nowrap ${tableCellClass(selected)}`}
                >
                  {row.renewal}
                </td>
                <td
                  className={`nf-type-body whitespace-nowrap text-ink-3 ${tableCellClass(selected)}`}
                >
                  {row.owner}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}