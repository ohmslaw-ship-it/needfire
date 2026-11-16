"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { defaultSelectedAccountId } from "@/data/sample";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { AccountDrawer } from "./AccountDrawer";
import { AppShell } from "./AppShell";
import { AtRiskTable } from "./AtRiskTable";
import { BriefHeader } from "./BriefHeader";
import { CantWaitSection } from "./CantWaitSection";
import { KpiRow } from "./KpiRow";

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
    <AppShell
      fixedHeader={
        <motion.div {...rise(reducedMotion, 0)}>
          <BriefHeader />
        </motion.div>
      }
      drawer={(onScrollNode) => (
        <AccountDrawer
          accountId={selectedId}
          onClose={() => setSelectedId(null)}
          reducedMotion={reducedMotion}
          onScrollNode={onScrollNode}
        />
      )}
    >
      <motion.div {...rise(reducedMotion, 0.2)}>
        <KpiRow />
      </motion.div>
      <motion.div {...rise(reducedMotion, 0.4)}>
        <CantWaitSection selectedId={selectedId} onSelect={setSelectedId} />
      </motion.div>
      <motion.div {...rise(reducedMotion, 0.6)}>
        <AtRiskTable selectedId={selectedId} onSelect={setSelectedId} />
      </motion.div>
    </AppShell>
  );
}