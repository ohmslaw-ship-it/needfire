import type { Account } from "@/data/accounts";

export type RiskThresholds = {
  critical: number;
  watch: number;
};

export const DEFAULT_THRESHOLDS: RiskThresholds = {
  critical: 75,
  watch: 50,
};

export const SIGNAL_IDS = [
  "loginDrop",
  "championLeft",
  "failedPayment",
  "supportSentiment",
  "seatUsage",
  "renewalWithin30",
] as const;

export type SignalId = (typeof SIGNAL_IDS)[number];

export type SignalWeights = Record<SignalId, number>;

export const DEFAULT_WEIGHTS: SignalWeights = {
  loginDrop: 2,
  championLeft: 3,
  failedPayment: 2,
  supportSentiment: 2,
  seatUsage: 1,
  renewalWithin30: 2,
};

export const SIGNAL_META: {
  id: SignalId;
  name: string;
  description: string;
}[] = [
  {
    id: "loginDrop",
    name: "Login drop",
    description: "Active users down versus the prior 14 days.",
  },
  {
    id: "championLeft",
    name: "Champion left",
    description: "Primary admin or owner left the company.",
  },
  {
    id: "failedPayment",
    name: "Failed payment",
    description: "Card or invoice charge failed on the last attempt.",
  },
  {
    id: "supportSentiment",
    name: "Support sentiment",
    description: "Recent tickets skew negative or urgent.",
  },
  {
    id: "seatUsage",
    name: "Seat usage",
    description: "Paid seats sitting idle beyond your threshold.",
  },
  {
    id: "renewalWithin30",
    name: "Renewal within 30 days",
    description: "Contract renewal date is inside the next month.",
  },
];

type SignalStrengths = Record<SignalId, number>;

function emptyStrengths(): SignalStrengths {
  return {
    loginDrop: 0,
    championLeft: 0,
    failedPayment: 0,
    supportSentiment: 0,
    seatUsage: 0,
    renewalWithin30: 0,
  };
}

function strengthTotal(strengths: SignalStrengths): number {
  return SIGNAL_IDS.reduce((sum, id) => sum + strengths[id], 0);
}

export function deriveSignalStrengths(account: Account): SignalStrengths {
  const s = emptyStrengths();
  const r = account.reason.toLowerCase();

  if (r.includes("champion") || (r.includes("left") && !r.includes("unassigned"))) {
    s.championLeft = 1;
  }
  if (
    r.includes("fail") ||
    r.includes("charge") ||
    r.includes("payment") ||
    r.includes("late payment")
  ) {
    s.failedPayment = 1;
  }
  if (r.includes("login")) {
    s.loginDrop = 1;
  }
  if (r.includes("usage") || r.includes("flat")) {
    s.loginDrop = Math.max(s.loginDrop, 0.7);
  }
  if (
    r.includes("support") ||
    r.includes("sentiment") ||
    r.includes("negative") ||
    r.includes("ticket")
  ) {
    s.supportSentiment = 0.9;
  }
  if (r.includes("seat") || r.includes("idle")) {
    s.seatUsage = 1;
  } else {
    const idle = 1 - account.seatsUsed / account.seatsTotal;
    if (idle > 0.28) s.seatUsage = Math.min(1, idle);
  }
  if (account.renewalSort <= 30) {
    s.renewalWithin30 = 0.45 + (30 - account.renewalSort) / 50;
  }

  if (strengthTotal(s) < 0.2) {
    const ambient = account.risk / 100;
    s.seatUsage = Math.min(0.35, ambient * 0.4);
    s.renewalWithin30 = Math.min(0.35, ambient * 0.35);
    if (account.risk >= 50) {
      s.supportSentiment = Math.min(0.7, ambient * 0.75);
    }
    if (account.risk >= 75) {
      s.loginDrop = Math.min(0.5, ambient * 0.55);
    }
  }

  return s;
}

function weightedSum(strengths: SignalStrengths, weights: SignalWeights): number {
  return SIGNAL_IDS.reduce((acc, id) => acc + strengths[id] * weights[id], 0);
}

export function computeAccountRisk(
  baselineRisk: number,
  account: Account,
  weights: SignalWeights,
): number {
  const strengths = deriveSignalStrengths(account);
  const baseSum = weightedSum(strengths, DEFAULT_WEIGHTS);
  const currentSum = weightedSum(strengths, weights);
  if (baseSum < 0.15) {
    return baselineRisk;
  }
  const scaled = baselineRisk * (currentSum / baseSum);
  return Math.min(100, Math.max(0, Math.round(scaled)));
}

export function statusFromRisk(
  risk: number,
  thresholds: RiskThresholds = DEFAULT_THRESHOLDS,
): "critical" | "watch" | "healthy" {
  if (risk >= thresholds.critical) return "critical";
  if (risk >= thresholds.watch) return "watch";
  return "healthy";
}