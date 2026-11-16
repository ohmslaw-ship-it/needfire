"use client";

import { useMemo } from "react";
import { useComputedAccounts } from "@/lib/useComputedAccounts";

export function KpiRow() {
  const accounts = useComputedAccounts();

  const metrics = useMemo(() => {
    const critical = accounts.filter((a) => a.status === "critical");
    const watch = accounts.filter((a) => a.status === "watch");
    const atRisk = [...critical, ...watch];
    const arrAtRisk = atRisk.reduce((sum, a) => sum + a.arrLakhs, 0);
    const renewalsSoon = accounts.filter((a) => a.renewalSort <= 30);
    const renewalArr = renewalsSoon.reduce((sum, a) => sum + a.arrLakhs, 0);

    return [
      {
        id: "arr-risk",
        label: "ARR at risk",
        value: `₹${arrAtRisk.toFixed(1)}L`,
        detail: `Across ${atRisk.length} flagged accounts (demo book)`,
      },
      {
        id: "critical",
        label: "Critical",
        value: String(critical.length),
        detail: "In your seeded book",
      },
      {
        id: "watch",
        label: "Watch",
        value: String(watch.length),
        detail: "In your seeded book",
      },
      {
        id: "renewals",
        label: "Renewals in 30 days",
        value: String(renewalsSoon.length),
        detail: `₹${renewalArr.toFixed(1)}L up for renewal`,
      },
    ];
  }, [accounts]);

  return (
    <section className="mb-11 mt-2 grid grid-cols-4 gap-6">
      {metrics.map((kpi) => (
        <div key={kpi.id}>
          <div className="nf-type-label">{kpi.label}</div>
          <div className="nf-type-kpi tabular-nums my-2.5">{kpi.value}</div>
          <div className="nf-type-secondary">{kpi.detail}</div>
        </div>
      ))}
    </section>
  );
}