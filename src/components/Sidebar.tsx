import { workspace } from "@/data/sample";

function NeedfireMark() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 1.5c.4 2.3 3.4 3.6 3.4 7a3.4 3.4 0 0 1-6.8 0c0-1.6.8-2.5 1.6-3.3.2 1 .7 1.7 1.4 1.9-.4-2-.1-4 .4-5.6Z"
        className="fill-ember"
      />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className="flex flex-col border-r border-line px-6 py-[30px]">
      <div className="font-display flex items-center gap-[9px] text-xl font-normal tracking-[-0.01em] [font-variation-settings:'SOFT'_100,'opsz'_40]">
        <NeedfireMark />
        <span>Needfire</span>
      </div>
      <div className="mt-11 mb-2.5 text-[12.5px] text-ink-3">
        {workspace.name}
      </div>
      <nav className="flex flex-col gap-0.5">
        <span className="py-[7px] text-[15px] font-medium text-ink">Brief</span>
        <span className="py-[7px] text-[15px] font-medium text-ink-3">
          Accounts
        </span>
        <span className="py-[7px] text-[15px] font-medium text-ink-3">
          Settings
        </span>
      </nav>
      <div className="mt-auto text-xs text-ink-3">Demo data</div>
    </aside>
  );
}