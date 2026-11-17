import Link from "next/link";
import {
  getCaseStudyShotAvailability,
  readCaseStudyMarkdown,
} from "@/lib/caseStudyAssets";
import { enrichCaseStudyMarkdown } from "@/lib/enrichCaseStudyMarkdown";
import { CanvasWash } from "./CanvasWash";
import { CaseStudyFade } from "./CaseStudyFade";
import { CaseStudyMarkdown } from "./CaseStudyMarkdown";
import { ScrollArea } from "./ScrollArea";
import { Sheet } from "./Sheet";

function NeedfireMark() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 1.5c.4 2.3 3.4 3.6 3.4 7a3.4 3.4 0 0 1-6.8 0c0-1.6.8-2.5 1.6-3.3.2 1 .7 1.7 1.4 1.9-.4-2-.1-4 .4-5.6Z"
        className="fill-ember"
      />
    </svg>
  );
}

export function CaseStudyScreen() {
  const availability = getCaseStudyShotAvailability();
  const source = enrichCaseStudyMarkdown(readCaseStudyMarkdown(), availability);

  return (
    <div className="relative isolate box-border flex h-dvh max-h-dvh w-full max-w-none flex-col overflow-hidden p-[var(--nf-shell-margin)]">
      <CanvasWash />
      <Sheet showSidebar={false}>
        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-line px-[var(--nf-pad-x)] py-5">
            <div className="mx-auto flex w-full max-w-[680px] items-center justify-between gap-6">
              <div className="font-display flex items-center gap-[9px] text-xl font-normal tracking-[-0.01em] text-ink [font-variation-settings:'SOFT'_100,'opsz'_40]">
                <NeedfireMark />
                <span>Needfire</span>
              </div>
              <Link
                href="/"
                className="text-[14px] font-medium text-ink-3 transition-colors duration-200 hover:text-ink-2"
              >
                Open the app
              </Link>
            </div>
          </header>
          <ScrollArea className="min-h-0 flex-1">
            <div className="px-[var(--nf-pad-x)] pb-[var(--nf-pad-bottom)] pt-10">
              <CaseStudyFade>
                <div className="mx-auto w-full max-w-[680px]">
                  <CaseStudyMarkdown source={source} availability={availability} />
                </div>
              </CaseStudyFade>
            </div>
          </ScrollArea>
        </main>
      </Sheet>
    </div>
  );
}