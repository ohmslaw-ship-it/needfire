import { briefHeader, workspace } from "@/data/sample";

export function BriefHeader() {
  return (
    <header className="pb-2">
      <div className="nf-type-secondary">{briefHeader.dateLabel}</div>
      <h1 className="nf-type-page-title mt-2 mb-3">
        Good morning, {workspace.userFirstName}
      </h1>
      <p className="nf-type-body text-ink-2">{briefHeader.summary}</p>
    </header>
  );
}