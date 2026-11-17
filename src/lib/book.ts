import type { Account } from "@/data/accounts";
import {
  computeAccountRisk,
  DEFAULT_THRESHOLDS,
  DEFAULT_WEIGHTS,
  statusFromRisk,
  type RiskThresholds,
  type SignalWeights,
} from "@/lib/riskSignals";

export type BookSnapshot = {
  critical: number;
  watch: number;
  healthy: number;
  attention: number;
  arrAtRisk: number;
  renewals: number;
  renewalArr: number;
};

/** Re-score the seeded book with the live Settings weights and thresholds. */
export function scoreAccounts(
  accounts: readonly Account[],
  weights: SignalWeights,
  thresholds: RiskThresholds,
): Account[] {
  return accounts.map((base) => {
    const risk = computeAccountRisk(base.risk, base, weights);
    const status = statusFromRisk(risk, thresholds);
    return { ...base, risk, status };
  });
}

export function snapshotBook(accounts: readonly Account[]): BookSnapshot {
  let critical = 0;
  let watch = 0;
  let healthy = 0;
  let arrAtRisk = 0;
  let renewals = 0;
  let renewalArr = 0;

  for (const account of accounts) {
    if (account.status === "critical") {
      critical += 1;
      arrAtRisk += account.arrLakhs;
    } else if (account.status === "watch") {
      watch += 1;
      arrAtRisk += account.arrLakhs;
    } else {
      healthy += 1;
    }
    if (account.renewalSort <= 30) {
      renewals += 1;
      renewalArr += account.arrLakhs;
    }
  }

  return {
    critical,
    watch,
    healthy,
    attention: critical + watch,
    arrAtRisk,
    renewals,
    renewalArr,
  };
}

/** Last Monday's brief: the same book scored with the default weights. */
export function baselineBook(accounts: readonly Account[]): BookSnapshot {
  return snapshotBook(
    scoreAccounts(accounts, DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS),
  );
}

export function formatLakhs(lakhs: number): string {
  return `₹${lakhs.toFixed(1)}L`;
}

/** One sentence shared by Brief, Accounts, and anywhere else the book is named. */
export function attentionSentence(snapshot: BookSnapshot): string {
  return `${snapshot.critical} critical, ${snapshot.watch} on watch. ${formatLakhs(snapshot.arrAtRisk)} ARR at risk`;
}

export function sinceMondayCount(delta: number): string {
  if (delta === 0) return "Unchanged since last Monday";
  const sign = delta > 0 ? "+" : "−";
  return `${sign}${Math.abs(delta)} since last Monday`;
}

export function sinceMondayArr(delta: number): string {
  if (Math.abs(delta) < 0.05) return "Unchanged since last Monday";
  const sign = delta > 0 ? "+" : "−";
  return `${sign}${formatLakhs(Math.abs(delta))} since last Monday`;
}

export function renewingDetail(snapshot: BookSnapshot): string {
  if (snapshot.renewals === 0) return "None renewing";
  return `${formatLakhs(snapshot.renewalArr)} renewing`;
}
