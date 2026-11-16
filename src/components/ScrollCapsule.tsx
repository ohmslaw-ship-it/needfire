"use client";

import {
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const MIN_THUMB = 40;
const MAX_THUMB = 80;
const CAPSULE_W = 4;
const CAPSULE_W_HOVER = 6;
const GUTTER = 6;
const FADE_OUT_MS = 800;

type Metrics = {
  scrollable: boolean;
  thumb: number;
  trackHeight: number;
  trackTop: number;
  trackRight: number;
};

function measure(el: HTMLElement): Metrics {
  const trackHeight = el.clientHeight;
  const scrollable = el.scrollHeight > el.clientHeight + 1;
  const thumb = scrollable
    ? Math.min(
        MAX_THUMB,
        Math.max(MIN_THUMB, (trackHeight / el.scrollHeight) * trackHeight),
      )
    : MIN_THUMB;
  const rect = el.getBoundingClientRect();
  return {
    scrollable,
    thumb,
    trackHeight,
    trackTop: rect.top,
    trackRight: rect.right,
  };
}

function scrollProgress(el: HTMLElement): number {
  const max = el.scrollHeight - el.clientHeight;
  if (max <= 0) return 0;
  return el.scrollTop / max;
}

export type ScrollCapsuleProps = {
  scrollElement: HTMLElement | null;
  reducedMotion?: boolean;
};

export function ScrollCapsule({
  scrollElement,
  reducedMotion = false,
}: ScrollCapsuleProps) {
  const [metrics, setMetrics] = useState<Metrics>({
    scrollable: false,
    thumb: MIN_THUMB,
    trackHeight: 0,
    trackTop: 0,
    trackRight: 0,
  });
  const [thumbTop, setThumbTop] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const dragRef = useRef<{ startY: number; startScroll: number } | null>(null);
  const scrollNodeRef = useRef<HTMLElement | null>(null);

  const progressMv = useMotionValue(0);
  const smoothProgress = useSpring(progressMv, {
    stiffness: reducedMotion ? 900 : 420,
    damping: reducedMotion ? 90 : 40,
    mass: 0.28,
  });

  const syncThumbPosition = useCallback(
    (el: HTMLElement, progress: number, m: Metrics) => {
      const travel = Math.max(m.trackHeight - m.thumb, 0);
      setThumbTop(m.trackTop + progress * travel);
      progressMv.set(progress);
    },
    [progressMv],
  );

  const scheduleFadeOut = useCallback(() => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    if (hovered || dragRef.current) return;
    fadeTimer.current = setTimeout(() => setVisible(false), FADE_OUT_MS);
  }, [hovered]);

  const bumpVisible = useCallback(() => {
    setVisible(true);
    scheduleFadeOut();
  }, [scheduleFadeOut]);

  useMotionValueEvent(smoothProgress, "change", (p) => {
    if (!scrollElement || reducedMotion) return;
    const m = measure(scrollElement);
    const travel = Math.max(m.trackHeight - m.thumb, 0);
    setThumbTop(m.trackTop + p * travel);
    setMetrics(m);
  });

  useEffect(() => {
    scrollNodeRef.current = scrollElement;
  }, [scrollElement]);

  useEffect(() => {
    const el = scrollElement;
    if (!el) return;

    const update = () => {
      const m = measure(el);
      setMetrics(m);
      const p = scrollProgress(el);
      if (reducedMotion) {
        syncThumbPosition(el, p, m);
      } else {
        progressMv.set(p);
        const travel = Math.max(m.trackHeight - m.thumb, 0);
        setThumbTop(m.trackTop + p * travel);
      }
    };

    const onScroll = () => {
      bumpVisible();
      update();
    };

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      ro.disconnect();
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [scrollElement, bumpVisible, progressMv, reducedMotion, syncThumbPosition]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollNodeRef.current;
    if (!el || !metrics.scrollable) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startY: event.clientY, startScroll: el.scrollTop };
    setVisible(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollNodeRef.current;
    const drag = dragRef.current;
    if (!el || !drag) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    const travel = Math.max(metrics.trackHeight - metrics.thumb, 1);
    const deltaY = event.clientY - drag.startY;
    el.scrollTop = drag.startScroll + (deltaY / travel) * scrollable;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    scheduleFadeOut();
  };

  if (!scrollElement || !metrics.scrollable) return null;

  const width = hovered ? CAPSULE_W_HOVER : CAPSULE_W;
  const left = metrics.trackRight - GUTTER - width;
  const opacity = visible || hovered ? 1 : 0;

  return (
    <div
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
        scheduleFadeOut();
      }}
      className="fixed z-[60] cursor-grab touch-none rounded-full bg-[rgba(22,24,29,0.22)] active:cursor-grabbing"
      style={{
        left,
        top: thumbTop,
        width,
        height: metrics.thumb,
        pointerEvents: "auto",
        opacity: reducedMotion ? (visible || hovered ? 1 : 0) : opacity,
        transition: "opacity 0.25s ease-out, width 0.2s ease-out",
      }}
    />
  );
}