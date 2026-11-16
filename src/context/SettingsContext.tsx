"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Tone } from "@/data/sample";
import {
  DEFAULT_WEIGHTS,
  type SignalId,
  type SignalWeights,
} from "@/lib/riskSignals";
import {
  STORAGE_KEY,
  defaultSettings,
  type AiDraftMode,
  type NeedfireSettings,
  type RiskThresholds,
} from "./settingsDefaults";
import { DEFAULT_THRESHOLDS } from "@/lib/riskSignals";

type SettingsContextValue = {
  settings: NeedfireSettings;
  weights: SignalWeights;
  thresholds: RiskThresholds;
  defaultTone: Tone;
  signOffName: string;
  aiMode: AiDraftMode;
  apiKey: string;
  savedVisible: boolean;
  setWeight: (id: SignalId, value: number) => void;
  setThreshold: (key: keyof RiskThresholds, value: number) => void;
  setAiMode: (mode: AiDraftMode) => void;
  setApiKey: (key: string) => void;
  setDefaultTone: (tone: Tone) => void;
  setSignOffName: (name: string) => void;
  resetRiskToDefaults: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function loadPersistedSettings(): NeedfireSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<NeedfireSettings>;
    return {
      weights: { ...DEFAULT_WEIGHTS, ...parsed.weights },
      thresholds: { ...DEFAULT_THRESHOLDS, ...parsed.thresholds },
      aiMode: parsed.aiMode === "api" ? "api" : "demo",
      apiKey: "",
      defaultTone:
        parsed.defaultTone === "direct" || parsed.defaultTone === "executive"
          ? parsed.defaultTone
          : "warm",
      signOffName:
        typeof parsed.signOffName === "string" && parsed.signOffName.trim()
          ? parsed.signOffName
          : defaultSettings.signOffName,
    };
  } catch {
    return defaultSettings;
  }
}

function persistSlice(settings: NeedfireSettings) {
  const { apiKey, ...rest } = settings;
  void apiKey;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NeedfireSettings>(() =>
    typeof window !== "undefined" ? loadPersistedSettings() : defaultSettings,
  );
  const [hydrated, setHydrated] = useState(() => typeof window !== "undefined");
  const [savedVisible, setSavedVisible] = useState(false);
  const saveTimer = useRef<number | null>(null);
  const skipNextPersist = useRef(true);

  useEffect(() => {
    // Hydrate persisted settings after SSR (client-only).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time hydration
    setSettings(loadPersistedSettings());
    setHydrated(true);
  }, []);

  const markSaved = useCallback(() => {
    setSavedVisible(true);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSavedVisible(false), 2000);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<NeedfireSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
      markSaved();
    },
    [markSaved],
  );

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    persistSlice(settings);
  }, [settings, hydrated]);

  const setWeight = useCallback(
    (id: SignalId, value: number) => {
      const clamped = Math.min(3, Math.max(0, Math.round(value)));
      setSettings((prev) => {
        const next = {
          ...prev,
          weights: { ...prev.weights, [id]: clamped },
        };
        return next;
      });
      markSaved();
    },
    [markSaved],
  );

  const setThreshold = useCallback(
    (key: keyof RiskThresholds, value: number) => {
      setSettings((prev) => {
        const n = Number.isFinite(value)
          ? Math.min(100, Math.max(0, Math.round(value)))
          : prev.thresholds[key];
        return {
          ...prev,
          thresholds: { ...prev.thresholds, [key]: n },
        };
      });
      markSaved();
    },
    [markSaved],
  );

  const resetRiskToDefaults = useCallback(() => {
    updateSettings({
      weights: { ...DEFAULT_WEIGHTS },
      thresholds: { ...DEFAULT_THRESHOLDS },
    });
  }, [updateSettings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      weights: settings.weights,
      thresholds: settings.thresholds,
      defaultTone: settings.defaultTone,
      signOffName: settings.signOffName,
      aiMode: settings.aiMode,
      apiKey: settings.apiKey,
      savedVisible,
      setWeight,
      setThreshold,
      setAiMode: (mode) => updateSettings({ aiMode: mode }),
      setApiKey: (key) => {
        setSettings((prev) => ({ ...prev, apiKey: key }));
      },
      setDefaultTone: (tone) => updateSettings({ defaultTone: tone }),
      setSignOffName: (name) => updateSettings({ signOffName: name }),
      resetRiskToDefaults,
    }),
    [
      settings,
      savedVisible,
      setWeight,
      setThreshold,
      resetRiskToDefaults,
      updateSettings,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}