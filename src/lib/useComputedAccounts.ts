"use client";

import { useMemo } from "react";
import { allAccounts, type Account } from "@/data/accounts";
import { useSettings } from "@/context/SettingsContext";
import { scoreAccounts } from "@/lib/book";

export function useComputedAccounts(): Account[] {
  const { weights, thresholds } = useSettings();
  return useMemo(
    () => scoreAccounts(allAccounts, weights, thresholds),
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