const FLAME_PATH =
  "M8 1.5c.4 2.3 3.4 3.6 3.4 7a3.4 3.4 0 0 1-6.8 0c0-1.6.8-2.5 1.6-3.3.2 1 .7 1.7 1.4 1.9-.4-2-.1-4 .4-5.6Z";

type NeedfireWordmarkProps = {
  /** Wordmark cap height in pixels */
  size?: number;
  className?: string;
};

export function NeedfireWordmark({ size = 26, className = "" }: NeedfireWordmarkProps) {
  const sizePx = `${size}px`;

  return (
    <div
      className={`font-display leading-none font-normal tracking-[-0.01em] text-ink [font-variation-settings:'SOFT'_100,'opsz'_40] ${className}`.trim()}
      style={{ fontSize: sizePx }}
      aria-label="Needfire"
    >
      <span className="leading-none" style={{ fontSize: sizePx }} aria-hidden>
        Needf
        <span className="relative inline-block">
          ı
          <svg
            className="pointer-events-none absolute top-[-0.02em] left-1/2 h-[0.42em] w-[0.34em] -translate-x-1/2 fill-ember"
            viewBox="0 0 16 16"
            aria-hidden
          >
            <path d={FLAME_PATH} />
          </svg>
        </span>
        re
      </span>
    </div>
  );
}