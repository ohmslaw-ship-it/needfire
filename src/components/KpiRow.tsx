import { kpis } from "@/data/sample";

export function KpiRow() {
  return (
    <section className="mb-11 mt-10 grid grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <div key={kpi.id}>
          <div className="text-[13px] text-ink-3">{kpi.label}</div>
          <div className="font-display tabular-nums my-2.5 text-[38px] font-[350] leading-none tracking-[-0.02em] [font-variation-settings:'SOFT'_100,'opsz'_72]">
            {kpi.value}
          </div>
          <div className="text-[12.5px] text-ink-3">{kpi.detail}</div>
        </div>
      ))}
    </section>
  );
}