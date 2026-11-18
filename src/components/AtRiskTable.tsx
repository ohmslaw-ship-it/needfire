"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
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
    const atRisk = accounts.filter((a) => a.status !== "healthy");
    const rows = [...accounts]
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 6);
    return { rows, totalLabel: `${rows.length} of ${atRisk.length}` };
  }, [accounts]);

  return (
    <section className="mt-[var(--nf-section-gap)]">
      <div className="mb-2 flex items-baseline gap-2.5">
        <h2 className="nf-type-section">At risk</h2>
        <span className="nf-type-secondary">{totalLabel}</span>
        <Link
          href="/accounts"
          className="nf-type-secondary ml-auto font-semibold text-ink-2 transition-colors duration-200 hover:text-ink"
        >
          View all
        </Link>
      </div>
      <table className="nf-table-fixed w-full border-collapse">
        <colgroup>
          <col style={{ width: "28%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "5%" }} />
          <col style={{ width: "7%" }} />
          <col style={{ width: "35%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "5%" }} />
        </colgroup>
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
            <th className="nf-type-label nf-table-cell nf-table-cell-inset text-left font-medium">
              Renewal
            </th>
            <th className="nf-type-label nf-table-cell text-left font-medium">
              Owner
            </th>
          </tr>
        </thead>
        <tbody className="nf-table-body">
          {rows.map((row, index) => {
            const selected = selectedId === row.id;
            const rowWeight = selected ? "font-semibold" : "font-medium";
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
                  className={`nf-type-body whitespace-nowrap ${rowWeight} ${tableCellClass(selected)}`}
                >
                  {row.name}
                </td>
                <td
                  className={`nf-type-body tabular-nums whitespace-nowrap pr-4 text-right ${rowWeight} ${tableCellClass(selected)}`}
                >
                  {row.arr}
                </td>
                <td
                  className={`nf-type-body tabular-nums whitespace-nowrap pr-4 text-right ${rowWeight} ${tableCellClass(selected)}`}
                >
                  {row.risk}
                </td>
                <td className={tableCellClass(selected)}>
                  <RiskBar risk={row.risk} status={row.status} />
                </td>
                <td
                  className={`nf-type-body nf-table-cell-reason text-ink-3 ${rowWeight} ${tableCellClass(selected)}`}
                  title={row.reason}
                >
                  {row.reason}
                </td>
                <td
                  className={`nf-type-body nf-table-cell-inset tabular-nums whitespace-nowrap ${rowWeight} ${tableCellClass(selected)}`}
                >
                  {row.renewal}
                </td>
                <td
                  className={`nf-type-body whitespace-nowrap text-ink-3 ${rowWeight} ${tableCellClass(selected)}`}
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