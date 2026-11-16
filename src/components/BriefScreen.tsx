"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { defaultSelectedAccountId } from "@/data/sample";
import { AccountDrawer } from "./AccountDrawer";
import { AtRiskTable } from "./AtRiskTable";
import { Background } from "./Background";
import { BriefHeader } from "./BriefHeader";
import { CantWaitSection } from "./CantWaitSection";
import { KpiRow } from "./KpiRow";
import { Sheet } from "./Sheet";
import { Sidebar } from "./Sidebar";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

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

  return (
  <>
    <Background />
    <Sheet>
      <Sidebar />
      <main className="min-w-0 px-11 pb-11 pt-[38px]">
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
      />
    </Sheet>
  </>
  );
}