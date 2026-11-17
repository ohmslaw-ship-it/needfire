"use client";

import { briefHeader, workspace } from "@/data/sample";
import { useBookSummary } from "@/lib/useBookSummary";

export function BriefHeader() {
  const { sentence } = useBookSummary();

  return (
    <header className="pb-2">
      <div className="nf-type-secondary tabular-nums">{briefHeader.dateLabel}</div>
      <h1 className="nf-type-page-title mt-2 mb-3">
        Good morning, {workspace.userFirstName}
      </h1>
      <p className="nf-type-body text-ink-2">{sentence}</p>
    </header>
  );
}