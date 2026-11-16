"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
  type PointerEvent as ReactPointerEvent,
} from "react";

const MIN_THUMB = 40;
const MAX_THUMB = 80;
const CAPSULE_W = 4;
const CAPSULE_W_HOVER = 6;
const FADE_OUT_MS = 1000;

type Metrics = {
  scrollable: boolean;
  thumb: number;
  trackHeight: number;
  trackTop: number;
};

export type ScrollCapsuleProps = {
  scrollRef: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  /** Pin horizontally to this element’s right gutter (e.g. drawer column). */
  anchorRef?: RefObject<HTMLElement | null>;
};

function measureScrollEl(el: HTMLElement): Omit<Metrics, "scrollable"> & { scrollable: boolean } {
  const trackHeight = el.clientHeight;
  const thumb = Math.min(
    MAX_THUMB,
    Math.max(MIN_THUMB, (trackHeight * trackHeight) / Math.max(el.scrollHeight, 1)),
  );
  const scrollable = el.scrollHeight > el.clientHeight + 1;
  const rect = el.getBoundingClientRect();
  return { scrollable, thumb, trackHeight, trackTop: rect.top };
}

export function ScrollCapsule({
  scrollRef,
  reducedMotion = false,
  anchorRef,
}: ScrollCapsuleProps) {
  const { scrollYProgress } = useScroll({
    container: scrollRef,
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reducedMotion ? 1000 : 380,
    damping: reducedMotion ? 100 : 36,
    mass: 0.35,
  });

  const [metrics, setMetrics] = useState<Metrics>({
    scrollable: false,
    thumb: MIN_THUMB,
    trackHeight: 0,
    trackTop: 0,
  });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [rightOffset, setRightOffset] = useState(6);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const dragRef = useRef<{ startY: number; startScroll: number } | null>(null);

  const bumpVisibility = useCallback(() => {
    setVisible(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    if (!hovered) {
      fadeTimer.current = setTimeout(() => setVisible(false), FADE_OUT_MS);
    }
  }, [hovered]);

  const refresh = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const next = measureScrollEl(el);
    setMetrics((m) => ({ ...m, ...next }));

    if (anchorRef?.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      setRightOffset(window.innerWidth - anchorRect.right + 6);
    } else {
      setRightOffset(6);
    }
  }, [scrollRef, anchorRef]);

  useEffect(() => {
    refresh();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      bumpVisibility();
      refresh();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", refresh, { passive: true });

    const ro = new ResizeObserver(refresh);
    ro.observe(el);
    if (anchorRef?.current) ro.observe(anchorRef.current);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", refresh);
      ro.disconnect();
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [scrollRef, anchorRef, bumpVisibility, refresh]);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    setProgress(v);
    bumpVisibility();
  });

  const thumbTravel = Math.max(metrics.trackHeight - metrics.thumb, 0);
  const thumbTop = metrics.trackTop + progress * thumbTravel;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !metrics.scrollable) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startY: event.clientY, startScroll: el.scrollTop };
    setVisible(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const drag = dragRef.current;
    if (!el || !drag) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    const travel = Math.max(metrics.trackHeight - metrics.thumb, 1);
    const deltaY = event.clientY - drag.startY;
    const ratio = scrollable / travel;
    el.scrollTop = drag.startScroll + deltaY * ratio;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    fadeTimer.current = setTimeout(() => setVisible(false), FADE_OUT_MS);
  };

  if (!metrics.scrollable) return null;

  const opacity = visible || hovered ? 1 : 0;
  const width = hovered ? CAPSULE_W_HOVER : CAPSULE_W;

  return (
    <motion.div
      role="presentation"
      aria-hidden
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={() => {
        setHovered(true);
        setVisible(true);
        if (fadeTimer.current) clearTimeout(fadeTimer.current);
      }}
      onMouseLeave={() => {
        setHovered(false);
        fadeTimer.current = setTimeout(() => setVisible(false), FADE_OUT_MS);
      }}
      className="fixed z-[60] cursor-grab touch-none rounded-full bg-ink/25 shadow-[0_2px_8px_rgba(22,24,29,0.12)] backdrop-blur-[6px] active:cursor-grabbing"
      style={{
        right: rightOffset,
        top: thumbTop,
        width,
        height: metrics.thumb,
        pointerEvents: "auto",
        opacity: reducedMotion ? (visible || hovered ? 1 : 0.35) : opacity,
        transition: reducedMotion
          ? "opacity 0.15s linear, width 0.15s linear"
          : "opacity 0.35s ease-out, width 0.2s ease-out",
      }}
    />
  );
}