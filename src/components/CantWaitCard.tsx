import type { CantWaitAccount } from "@/data/sample";

type CantWaitCardProps = {
  account: CantWaitAccount;
  selected: boolean;
  onSelect: () => void;
};

export function CantWaitCard({ account, selected, onSelect }: CantWaitCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="cursor-pointer rounded-[18px] bg-card p-5 pb-[18px] shadow-[0_1px_2px_rgba(20,24,30,0.05),0_8px_24px_-16px_rgba(20,24,30,0.18)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(20,24,30,0.08),0_12px_28px_-12px_rgba(20,24,30,0.22)]"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-[15.5px] font-semibold">{account.name}</h3>
        <span className="tabular-nums text-sm font-semibold text-ink-2">
          {account.score}
        </span>
      </div>
      <div className="font-display tabular-nums my-2.5 text-[28px] font-[350] tracking-[-0.02em] [font-variation-settings:'SOFT'_100,'opsz'_60]">
        {account.arr}
      </div>
      <p className="text-[13.5px] text-ink-2">{account.reason}</p>
      <p className="mt-[18px] text-[13px] text-ink-3">{account.whenLabel}</p>
      <div className="mt-5 flex justify-start">
        <span
          className={
            selected
              ? "rounded-full bg-ember px-3 py-[7px] text-[13px] font-semibold text-white"
              : "text-[13px] font-semibold text-ink-2"
          }
        >
          Draft save email
        </span>
      </div>
    </article>
  );
}