"use client";

import { useMemo } from "react";
import { cantWaitAccounts } from "@/data/sample";
import { useComputedAccounts } from "@/lib/useComputedAccounts";
import { CantWaitCard } from "./CantWaitCard";

type CantWaitSectionProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function CantWaitSection({ selectedId, onSelect }: CantWaitSectionProps) {
  const accounts = useComputedAccounts();
  const cards = useMemo(() => {
    const byId = new Map(accounts.map((a) => [a.id, a]));
    return cantWaitAccounts.map((seed) => {
      const live = byId.get(seed.id);
      return {
        ...seed,
        score: live?.risk ?? seed.score,
      };
    });
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