"use client";

import { useMemo } from "react";
import { allAccounts, type Account } from "@/data/accounts";
import { useSettings } from "@/context/SettingsContext";
import { computeAccountRisk, statusFromRisk } from "@/lib/riskSignals";

export function useComputedAccounts(): Account[] {
  const { weights, thresholds } = useSettings();
  return useMemo(
    () =>
      allAccounts.map((base) => {
        const risk = computeAccountRisk(base.risk, base, weights);
        const status = statusFromRisk(risk, thresholds);
        return { ...base, risk, status };
      }),
    [weights, thresholds],
  );
}

export function useComputedAccountById(id: string | null): Account | undefined {
  const accounts = useComputedAccounts();
  return useMemo(
    () => (id ? accounts.find((a) => a.id === id) : undefined),
    [accounts, id],
  );
}