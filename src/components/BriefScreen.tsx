"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { defaultSelectedAccountId } from "@/data/sample";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { AccountDrawer } from "./AccountDrawer";
import { AtRiskTable } from "./AtRiskTable";
import { BriefHeader } from "./BriefHeader";
import { CanvasWash } from "./CanvasWash";
import { CantWaitSection } from "./CantWaitSection";
import { KpiRow } from "./KpiRow";
import { ScrollCapsule } from "./ScrollCapsule";
import { Sheet } from "./Sheet";
import { Sidebar } from "./Sidebar";

function rise(reduced: boolean, delay: number) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay, ease: [0, 0, 0.2, 1] as const },
      };
}

export function BriefScreen() {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultSelectedAccountId,
  );
  const mainScrollRef = useRef<HTMLElement>(null);
  const drawerAnchorRef = useRef<HTMLElement>(null);
  const drawerScrollRef = useRef<HTMLElement>(null);

  return (
    <div className="relative isolate box-border flex min-h-dvh w-full max-w-none flex-col p-[var(--nf-shell-margin)]">
      <CanvasWash />
      <ScrollCapsule scrollRef={mainScrollRef} reducedMotion={reducedMotion} />
      <ScrollCapsule
        scrollRef={drawerScrollRef}
        anchorRef={drawerAnchorRef}
        reducedMotion={reducedMotion}
      />
      <Sheet>
        <Sidebar />
        <main
          ref={mainScrollRef}
          className="nf-scrollbar-hide min-h-0 min-w-0 overflow-y-auto px-11 pb-11 pt-[38px]"
        >
          <motion.div {...rise(reducedMotion, 0)}>
            <BriefHeader />
          </motion.div>
          <motion.div {...rise(reducedMotion, 0.2)}>
            <KpiRow />
          </motion.div>
          <motion.div {...rise(reducedMotion, 0.4)}>
            <CantWaitSection
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </motion.div>
          <motion.div {...rise(reducedMotion, 0.6)}>
            <AtRiskTable selectedId={selectedId} onSelect={setSelectedId} />
          </motion.div>
        </main>
        <AccountDrawer
          accountId={selectedId}
          onClose={() => setSelectedId(null)}
          reducedMotion={reducedMotion}
          anchorRef={drawerAnchorRef}
          scrollRef={drawerScrollRef}
        />
      </Sheet>
    </div>
  );
}