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
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="group cursor-pointer rounded-[18px] bg-card p-5 pb-[18px] shadow-[0_1px_2px_rgba(22,24,29,0.05),0_8px_24px_-16px_rgba(22,24,29,0.16)] transition-[transform,box-shadow] duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_8px_18px_-8px_rgba(22,24,29,0.14),0_18px_36px_-18px_rgba(22,24,29,0.24)]"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="nf-type-body font-semibold">{account.name}</h3>
        <span className="nf-type-body tabular-nums font-semibold text-ink-2">
          {account.score}
        </span>
      </div>
      <div className="nf-type-figure my-2.5">{account.arr}</div>
      <p className="nf-type-body text-ink-2">{account.reason}</p>
      <p className="nf-type-secondary mt-[18px] tabular-nums">{account.whenLabel}</p>
      <div className="mt-5 flex justify-start">
        <span className="nf-draft-link" data-active={selected ? "" : undefined}>
          Draft save email
        </span>
      </div>
    </article>
  );
}
