import { kpis } from "@/data/sample";

export function KpiRow() {
  return (
    <section className="mb-11 mt-2 grid grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <div key={kpi.id}>
          <div className="nf-type-label">{kpi.label}</div>
          <div className="nf-type-kpi tabular-nums my-2.5">
            {kpi.value}
          </div>
          <div className="nf-type-secondary">{kpi.detail}</div>
        </div>
      ))}
    </section>
  );
}