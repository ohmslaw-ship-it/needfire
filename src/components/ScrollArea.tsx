"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const THUMB_MIN = 32;
const THUMB_COLOR = "rgba(22,24,29,0.18)";
const FADE_OUT_MS = 800;
const FADE_IN_MS = 150;

type ScrollAreaProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Owns one scrollport. Native scrollbar is hidden; a thumb sits on the
 * right edge of this component and only renders when the content overflows.
 */
export function ScrollArea({ children, className }: ScrollAreaProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const fadeTimer = useRef<number | null>(null);
  const dragRef = useRef<{ y: number; scroll: number } | null>(null);
  const frame = useRef(0);
  const [geom, setGeom] = useState({ height: 0, top: 0, overflow: false });
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const placeThumb = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { clientHeight, scrollHeight, scrollTop } = el;
    const overflow = scrollHeight > clientHeight + 1;
    const rawHeight = overflow
      ? (clientHeight / scrollHeight) * clientHeight
      : 0;
    const height = overflow ? Math.max(THUMB_MIN, rawHeight) : 0;
    const maxScroll = scrollHeight - clientHeight;
    const travel = Math.max(clientHeight - height, 0);
    const top = maxScroll > 0 ? (scrollTop / maxScroll) * travel : 0;
    setGeom((prev) => {
      if (
        prev.overflow === overflow &&
        Math.abs(prev.height - height) < 0.5 &&
        Math.abs(prev.top - top) < 0.5
      ) {
        return prev;
      }
      return { height, top, overflow };
    });
  }, []);

  const scheduleFadeOut = useCallback(() => {
    if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
    if (dragRef.current) return;
    fadeTimer.current = window.setTimeout(() => {
      if (!dragRef.current) setVisible(false);
    }, FADE_OUT_MS);
  }, []);

  const reveal = useCallback(() => {
    setVisible(true);
    scheduleFadeOut();
  }, [scheduleFadeOut]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    placeThumb();

    const onScroll = () => {
      reveal();
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0;
        placeThumb();
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => placeThumb());
    ro.observe(el);
    const content = el.firstElementChild;
    if (content) ro.observe(content);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (frame.current) window.cancelAnimationFrame(frame.current);
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
    };
  }, [placeThumb, reveal]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { y: event.clientY, scroll: el.scrollTop };
    setVisible(true);
    if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const drag = dragRef.current;
    if (!el || !drag) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const rawThumb =
      (el.clientHeight / el.scrollHeight) * el.clientHeight;
    const thumbHeight = Math.max(THUMB_MIN, rawThumb);
    const travel = Math.max(el.clientHeight - thumbHeight, 1);
    const delta = event.clientY - drag.y;
    el.scrollTop = drag.scroll + (delta / travel) * maxScroll;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    scheduleFadeOut();
  };

  const thumbShown = visible || hovered;

  return (
    <div
      className={`relative flex min-h-0 flex-1 flex-col ${className ?? ""}`}
      onMouseEnter={() => {
        setHovered(true);
        setVisible(true);
        if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
      }}
      onMouseLeave={() => {
        setHovered(false);
        scheduleFadeOut();
      }}
    >
      <div
        ref={scrollerRef}
        className="nf-scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {children}
      </div>
      {geom.overflow ? (
        <div
          aria-hidden
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="absolute top-0 z-20 w-1 cursor-grab touch-none rounded-full active:cursor-grabbing"
          style={{
            right: 6,
            height: geom.height,
            transform: `translateY(${geom.top}px)`,
            background: THUMB_COLOR,
            opacity: thumbShown ? 1 : 0,
            transition: `opacity ${thumbShown ? FADE_IN_MS : FADE_OUT_MS}ms ease`,
          }}
        />
      ) : null}
    </div>
  );
}