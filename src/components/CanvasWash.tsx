export function CanvasWash() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse 120% 90% at 12% 8%, rgba(217, 70, 31, 0.06) 0%, transparent 58%)",
      }}
    />
  );
}