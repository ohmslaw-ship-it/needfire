import { briefHeader, workspace } from "@/data/sample";

export function BriefHeader() {
  return (
    <header>
      <div className="text-[13px] text-ink-3">{briefHeader.dateLabel}</div>
      <h1 className="font-display mt-2 mb-3 text-[44px] font-[350] leading-[1.05] tracking-[-0.025em] [font-variation-settings:'SOFT'_100,'opsz'_96]">
        Good morning, {workspace.userFirstName}
      </h1>
      <p className="text-base text-ink-2">{briefHeader.summary}</p>
    </header>
  );
}