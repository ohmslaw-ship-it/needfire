"use client";

import { useMemo } from "react";
import { allAccounts } from "@/data/accounts";
import {
  attentionSentence,
  baselineBook,
  formatLakhs,
  renewingDetail,
  sinceMondayArr,
  sinceMondayCount,
  snapshotBook,
} from "@/lib/book";
import { useComputedAccounts } from "@/lib/useComputedAccounts";

export function useBookSummary() {
  const accounts = useComputedAccounts();

  return useMemo(() => {
    const live = snapshotBook(accounts);
    const baseline = baselineBook(allAccounts);
    return {
      accounts,
      live,
      sentence: attentionSentence(live),
      arrLabel: formatLakhs(live.arrAtRisk),
      arrDetail: sinceMondayArr(live.arrAtRisk - baseline.arrAtRisk),
      criticalDetail: sinceMondayCount(live.critical - baseline.critical),
      watchDetail: sinceMondayCount(live.watch - baseline.watch),
      renewingDetail: renewingDetail(live),
    };
  }, [accounts]);
}
