"use client";

import { useMemo } from "react";
import { useComputedAccounts } from "@/lib/useComputedAccounts";
import { CantWaitCard } from "./CantWaitCard";

type CantWaitSectionProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function CantWaitSection({ selectedId, onSelect }: CantWaitSectionProps) {
  const accounts = useComputedAccounts();
  const cards = useMemo(() => {
    return [...accounts]
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 3)
      .map((account) => ({
        id: account.id,
        name: account.name,
        score: account.risk,
        arr: account.arr,
        reason: account.reason,
        whenLabel: `Renews ${account.renewal}`,
      }));
  }, [accounts]);

  return (
    <section>
      <h2 className="nf-type-section">Can’t wait</h2>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {cards.map((account) => (
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