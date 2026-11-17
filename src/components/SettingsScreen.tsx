"use client";

import { useMemo, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Tone } from "@/data/sample";
import { useSettings } from "@/context/SettingsContext";
import { SIGNAL_META } from "@/lib/riskSignals";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { AppShell } from "./AppShell";

const teamOwners = ["Meera", "Arjun", "Ritika"] as const;

const toneOptions: { id: Tone; label: string }[] = [
  { id: "warm", label: "Warm" },
  { id: "direct", label: "Direct" },
  { id: "executive", label: "Executive" },
];

function rise(reduced: boolean) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const },
      };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10 first:border-t-0 first:pt-0">
      <h2 className="nf-type-section mb-5">{title}</h2>
      {children}
    </section>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <span className="nf-type-body shrink-0 text-ink-2 sm:w-40">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function SignalRow({
  name,
  description,
  weight,
  onWeight,
}: {
  name: string;
  description: string;
  weight: number;
  onWeight: (n: number) => void;
}) {
  return (
    <div className="grid gap-3 border-b border-line py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_140px] sm:items-center sm:gap-6">
      <div>
        <div className="nf-type-body font-medium text-ink">{name}</div>
        <p className="nf-type-secondary mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={3}
          step={1}
          value={weight}
          onChange={(e) => onWeight(Number(e.target.value))}
          className="h-1 w-full max-w-[96px] cursor-pointer accent-ink"
          aria-label={`${name} weight`}
          aria-valuetext={`${weight} of 3`}
        />
        <span className="nf-type-body tabular-nums w-4 text-right font-medium">
          {weight}
        </span>
      </div>
    </div>
  );
}

export function SettingsScreen() {
  const reducedMotion = usePrefersReducedMotion();
  const {
    weights,
    thresholds,
    aiMode,
    apiKey,
    defaultTone,
    signOffName,
    savedVisible,
    setWeight,
    setThreshold,
    setAiMode,
    setApiKey,
    setDefaultTone,
    setSignOffName,
    resetRiskToDefaults,
  } = useSettings();

  const fixedHeader = useMemo(
    () => (
      <header className="pb-6">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="nf-type-page-title">Settings</h1>
          <AnimatePresence>
            {savedVisible && (
              <motion.span
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="nf-type-secondary text-ink-3"
              >
                Saved
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </header>
    ),
    [reducedMotion, savedVisible],
  );

  return (
    <AppShell fixedHeader={fixedHeader} contentMaxWidth={720}>
      <motion.div {...rise(reducedMotion)}>
        <Section title="Workspace">
          <FieldRow label="Company">
            <span className="nf-type-body font-medium">Ledgerly</span>
          </FieldRow>
          <FieldRow label="Brief arrives">
            <span className="nf-type-body">Monday 9:00 AM IST</span>
          </FieldRow>
          <FieldRow label="Team owners">
            <ul className="nf-type-body m-0 list-none p-0">
              {teamOwners.map((name) => (
                <li key={name} className="py-0.5">
                  {name}
                </li>
              ))}
            </ul>
          </FieldRow>
        </Section>

        <Section title="How risk is scored">
          <p className="nf-type-body mb-6 text-ink-2">
            Risk scores are rule-based: each signal adds points from your
            weights. Nothing is hidden or model-guessed — you can see every
            input and tune what matters for Ledgerly.
          </p>
          <div>
            {SIGNAL_META.map((signal) => (
              <SignalRow
                key={signal.id}
                name={signal.name}
                description={signal.description}
                weight={weights[signal.id]}
                onWeight={(n) => setWeight(signal.id, n)}
              />
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-10">
            <label className="flex flex-col gap-1.5">
              <span className="nf-type-label">Critical threshold</span>
              <input
                type="number"
                min={0}
                max={100}
                value={thresholds.critical}
                onChange={(e) => setThreshold("critical", Number(e.target.value))}
                className="nf-type-body tabular-nums w-24 rounded-lg border border-line bg-card px-3 py-2 focus:border-ink/25"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="nf-type-label">Watch threshold</span>
              <input
                type="number"
                min={0}
                max={100}
                value={thresholds.watch}
                onChange={(e) => setThreshold("watch", Number(e.target.value))}
                className="nf-type-body tabular-nums w-24 rounded-lg border border-line bg-card px-3 py-2 focus:border-ink/25"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={resetRiskToDefaults}
            className="nf-type-body mt-6 font-medium text-ink-2 underline decoration-line underline-offset-[5px] transition-colors hover:text-ink"
          >
            Reset to defaults
          </button>
        </Section>

        <Section title="AI drafts">
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              type="button"
              aria-pressed={aiMode === "demo"}
              onClick={() => setAiMode("demo")}
              className={`nf-type-body font-medium transition-colors ${
                aiMode === "demo"
                  ? "text-ink underline decoration-ink decoration-[1.5px] underline-offset-[5px]"
                  : "text-ink-3 hover:text-ink-2"
              }`}
            >
              Demo (pre-written drafts)
            </button>
            <button
              type="button"
              aria-pressed={aiMode === "api"}
              onClick={() => setAiMode("api")}
              className={`nf-type-body font-medium transition-colors ${
                aiMode === "api"
                  ? "text-ink underline decoration-ink decoration-[1.5px] underline-offset-[5px]"
                  : "text-ink-3 hover:text-ink-2"
              }`}
            >
              Use my API key
            </button>
          </div>
          {aiMode === "api" && (
            <div className="mb-6">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-…"
                autoComplete="off"
                aria-label="API key"
                className="nf-type-body w-full max-w-md rounded-lg border border-line bg-card px-3 py-2 focus:border-ink/25"
              />
              <p className="nf-type-secondary mt-2">
                Stored for this session only, never sent to our servers. This
                key only rewrites the read and the email draft. It does not
                change risk scores.
              </p>
            </div>
          )}
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <span className="nf-type-label shrink-0 font-semibold text-ink">
              Default tone
            </span>
            <div className="nf-type-secondary flex flex-wrap gap-3.5">
              {toneOptions.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={defaultTone === id}
                  onClick={() => setDefaultTone(id)}
                  className={
                    defaultTone === id
                      ? "nf-type-body font-semibold text-ink underline decoration-ink decoration-[1.5px] underline-offset-[5px]"
                      : "hover:text-ink-2"
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-6 flex flex-col gap-1.5">
            <span className="nf-type-label">Sign-off name</span>
            <input
              type="text"
              value={signOffName}
              onChange={(e) => setSignOffName(e.target.value)}
              aria-label="Sign-off name"
              className="nf-type-body max-w-md rounded-lg border border-line bg-card px-3 py-2 focus:border-ink/25"
            />
          </label>
        </Section>

        <Section title="Data">
          <p className="nf-type-body text-ink-2">
            Demo data · Connected sources: none (sample data)
          </p>
          <div className="nf-type-secondary mt-4 flex flex-wrap gap-6">
            <button
              type="button"
              disabled
              className="cursor-not-allowed font-medium text-ink-3 line-through decoration-ink-3/40"
            >
              Connect Stripe
            </button>
            <button
              type="button"
              disabled
              className="cursor-not-allowed font-medium text-ink-3 line-through decoration-ink-3/40"
            >
              Connect Intercom
            </button>
            <span className="nf-type-label">Coming later</span>
          </div>
        </Section>
      </motion.div>
    </AppShell>
  );
}