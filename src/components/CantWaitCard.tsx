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
        <h3 className="nf-type-body font-semibold">{account.name}</h3>
        <span className="nf-type-body tabular-nums font-semibold text-ink-2">
          {account.score}
        </span>
      </div>
      <div className="nf-type-drawer-title tabular-nums my-2.5">
        {account.arr}
      </div>
      <p className="nf-type-body text-ink-2">{account.reason}</p>
      <p className="nf-type-secondary mt-[18px]">{account.whenLabel}</p>
      <div className="mt-5 flex justify-start">
        <span
          className={
            selected
              ? "nf-type-body rounded-full bg-ember px-3 py-[7px] font-semibold text-white"
              : "nf-type-secondary font-semibold text-ink-2"
          }
        >
          Draft save email
        </span>
      </div>
    </article>
  );
}