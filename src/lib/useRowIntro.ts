"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type RowMotion =
  | { initial: false; animate: { opacity: number } }
  | {
      initial: { opacity: number };
      animate: { opacity: number };
      transition: {
        duration: number;
        delay: number;
        ease: readonly [number, number, number, number];
      };
    };

const still: RowMotion = { initial: false, animate: { opacity: 1 } };

/** Fade each row in once, 20ms apart. Later mounts (filters, sorts) stay still. */
export function useRowIntro() {
  const reduced = usePrefersReducedMotion();
  const locked = useRef(false);
  const propsById = useRef(new Map<string, RowMotion>());

  useEffect(() => {
    locked.current = true;
  }, []);

  return function rowMotion(id: string, index: number): RowMotion {
    const cached = propsById.current.get(id);
    if (cached) return cached;

    if (locked.current || reduced) {
      propsById.current.set(id, still);
      return still;
    }

    const intro: RowMotion = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: {
        duration: 0.32,
        delay: index * 0.02,
        ease: [0, 0, 0.2, 1],
      },
    };
    propsById.current.set(id, intro);
    return intro;
  };
}
