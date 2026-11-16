import type { Tone } from "@/data/sample";
import {
  DEFAULT_THRESHOLDS,
  DEFAULT_WEIGHTS,
  type RiskThresholds,
  type SignalWeights,
} from "@/lib/riskSignals";

export type { RiskThresholds } from "@/lib/riskSignals";

export type AiDraftMode = "demo" | "api";

export type NeedfireSettings = {
  weights: SignalWeights;
  thresholds: RiskThresholds;
  aiMode: AiDraftMode;
  apiKey: string;
  defaultTone: Tone;
  signOffName: string;
};

export const defaultSettings: NeedfireSettings = {
  weights: { ...DEFAULT_WEIGHTS },
  thresholds: { ...DEFAULT_THRESHOLDS },
  aiMode: "demo",
  apiKey: "",
  defaultTone: "warm",
  signOffName: "Meera",
};

export const STORAGE_KEY = "needfire-settings-v1";