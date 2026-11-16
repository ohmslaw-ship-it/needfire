export function Background() {
  return (
    <div
      className="fixed inset-0 z-0 bg-[url('/img/sky.jpg')] bg-cover bg-[center_30%] bg-no-repeat"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-white/[0.12]"
        aria-hidden="true"
      />
    </div>
  );
}