"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function CaseStudyFade({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className="w-full"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}