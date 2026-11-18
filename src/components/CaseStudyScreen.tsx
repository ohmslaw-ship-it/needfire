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
import { NeedfireWordmark } from "./NeedfireWordmark";
import { Sheet } from "./Sheet";

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
              <NeedfireWordmark size={20} className="shrink-0" />
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