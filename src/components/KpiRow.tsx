"use client";

import { formatLakhs } from "@/lib/book";
import { useBookSummary } from "@/lib/useBookSummary";

export function KpiRow() {
  const { live, arrDetail, criticalDetail, watchDetail, renewingDetail } =
    useBookSummary();

  const metrics = [
    {
      id: "arr-risk",
      label: "ARR at risk",
      value: formatLakhs(live.arrAtRisk),
      detail: arrDetail,
    },
    {
      id: "critical",
      label: "Critical",
      value: String(live.critical),
      detail: criticalDetail,
    },
    {
      id: "watch",
      label: "Watch",
      value: String(live.watch),
      detail: watchDetail,
    },
    {
      id: "renewals",
      label: "Renewals in 30 days",
      value: String(live.renewals),
      detail: renewingDetail,
    },
  ];

  return (
    <section className="mt-2 mb-[var(--nf-section-gap)] grid grid-cols-4 gap-6">
      {metrics.map((kpi) => (
        <div key={kpi.id}>
          <div className="nf-type-label">{kpi.label}</div>
          <div className="nf-type-kpi my-2.5">{kpi.value}</div>
          <div className="nf-type-secondary tabular-nums">{kpi.detail}</div>
        </div>
      ))}
    </section>
  );
}
