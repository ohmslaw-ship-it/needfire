import { cantWaitAccounts } from "@/data/sample";
import { CantWaitCard } from "./CantWaitCard";

type CantWaitSectionProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function CantWaitSection({ selectedId, onSelect }: CantWaitSectionProps) {
  return (
    <section>
      <h2 className="nf-type-section">Can’t wait</h2>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {cantWaitAccounts.map((account) => (
          <CantWaitCard
            key={account.id}
            account={account}
            selected={selectedId === account.id}
            onSelect={() => onSelect(account.id)}
          />
        ))}
      </div>
    </section>
  );
}