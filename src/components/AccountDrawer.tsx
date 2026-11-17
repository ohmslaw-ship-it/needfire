"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  accountDrawerDetails,
  getAccountName,
  type Tone,
} from "@/data/sample";
import { buildGeneratedDrawerDetail, type Account } from "@/data/accounts";
import { useSettings } from "@/context/SettingsContext";
import { useComputedAccountById } from "@/lib/useComputedAccounts";
import { ScrollArea } from "./ScrollArea";

type AccountDrawerProps = {
  accountId: string | null;
  onClose: () => void;
  reducedMotion: boolean;
};

const toneLabels: { id: Tone; label: string }[] = [
  { id: "warm", label: "Warm" },
  { id: "direct", label: "Direct" },
  { id: "executive", label: "Executive" },
];

function resolveDrawerDetail(
  accountId: string,
  signOffName: string,
  liveAccount?: Account,
) {
  const stored = accountDrawerDetails[accountId];
  const signoff = signOffName.trim() || "Meera";
  if (stored) {
    return {
      ...stored,
      risk: liveAccount?.risk ?? stored.risk,
      drafts: Object.fromEntries(
        Object.entries(stored.drafts).map(([tone, draft]) => [
          tone,
          { ...draft, signoff },
        ]),
      ) as typeof stored.drafts,
    };
  }
  if (!liveAccount) return undefined;
  return buildGeneratedDrawerDetail(liveAccount, signoff);
}

function AccountDrawerBody({
  accountId,
  reducedMotion,
}: {
  accountId: string;
  reducedMotion: boolean;
}) {
  const { defaultTone, signOffName } = useSettings();
  const [pickedTone, setPickedTone] = useState<Tone | null>(null);
  const tone = pickedTone ?? defaultTone;
  const [copied, setCopied] = useState(false);
  const meta = useComputedAccountById(accountId);

  const detail = useMemo(
    () => resolveDrawerDetail(accountId, signOffName, meta),
    [accountId, signOffName, meta],
  );
  const name = getAccountName(accountId);
  const draft = detail?.drafts[tone];

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copyDraft = useCallback(async () => {
    const current = detail?.drafts[tone];
    if (!current) return;
    const text = [
      current.subject,
      "",
      ...current.paragraphs,
      "",
      current.signoff,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [detail, tone]);

  const crossFade = reducedMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0, 0, 0.2, 1] as const };

  return (
    <>
      <h2 className="nf-type-drawer-title mt-3.5 mb-2.5">{name}</h2>
      {meta && (
        <div className="nf-type-secondary flex gap-4">
          <span className="tabular-nums">{meta.arr} ARR</span>
          <span>
            Risk{" "}
            <b className="tabular-nums font-semibold text-ink">{meta.risk}</b>
          </span>
          <span className="tabular-nums">
            {detail?.renewal ?? `Renews ${meta.renewal}`}
          </span>
        </div>
      )}

      {detail && (
        <>
          <section className="mt-[30px]">
            <h4 className="nf-type-label mb-3.5 font-semibold text-ink">Why</h4>
            <ol className="flex flex-col gap-3.5">
              {detail.why.map((event) => (
                <li
                  key={`${event.date}-${event.title}`}
                  className="grid grid-cols-[56px_1fr] gap-2"
                >
                  <span className="nf-type-secondary tabular-nums">
                    {event.date}
                  </span>
                  <div>
                    <div className="nf-type-body font-medium">{event.title}</div>
                    <div className="nf-type-secondary">{event.body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-[30px]">
            <h4 className="nf-type-label mb-3.5 font-semibold text-ink">
              Needfire&apos;s read
            </h4>
            <p className="nf-type-body text-ink-2">{detail.read}</p>
          </section>

          <section className="mt-[30px] flex flex-1 flex-col">
            <div className="flex items-baseline justify-between">
              <h4 className="nf-type-label font-semibold text-ink">Save email</h4>
              <div className="nf-type-secondary flex gap-3.5">
                {toneLabels.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={tone === id}
                    onClick={() => setPickedTone(id)}
                    className={
                      tone === id
                        ? "nf-type-body font-semibold text-ink underline decoration-ink decoration-[1.5px] underline-offset-[5px]"
                        : undefined
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait">
              {draft && (
                <motion.div
                  key={tone}
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0 }}
                  transition={crossFade}
                  className="flex flex-1 flex-col"
                >
                  <div className="nf-email-preview">
                    <div className="nf-type-body mb-1.5 font-semibold text-ink">
                      {draft.subject}
                    </div>
                    {draft.paragraphs.map((p) => (
                      <p key={p.slice(0, 24)} className="mt-2 first:mt-0">
                        {p}
                      </p>
                    ))}
                    <p className="mt-2">{draft.signoff}</p>
                  </div>
                  <div className="nf-type-label mt-auto flex items-center justify-between pt-[18px]">
                    <span>Copied, never sent</span>
                    <button
                      type="button"
                      onClick={copyDraft}
                      className="nf-type-body rounded-full bg-ink px-4 py-2 font-semibold text-white"
                    >
                      {copied ? "Copied" : "Copy draft"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </>
      )}
    </>
  );
}

export function AccountDrawer({
  accountId,
  onClose,
  reducedMotion,
}: AccountDrawerProps) {
  const [shownId, setShownId] = useState(accountId);
  if (accountId !== null && accountId !== shownId) {
    setShownId(accountId);
  }
  const displayId = shownId;
  const open = accountId !== null;

  const crossFade = reducedMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0, 0, 0.2, 1] as const };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <aside
      className="flex h-full min-h-0 w-[376px] min-w-[376px] flex-col overflow-hidden border-l border-line bg-drawer"
      aria-hidden={!open}
      inert={!open}
    >
      {displayId ? (
        <>
          <div className="nf-type-secondary flex shrink-0 justify-between px-8 pt-[30px]">
            <span>Account</span>
            <button type="button" onClick={onClose} aria-label="Close account">
              Close
            </button>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="px-8 pb-[30px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayId}
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0 }}
                  transition={crossFade}
                  className="flex min-h-0 flex-col"
                >
                  <AccountDrawerBody
                    key={displayId}
                    accountId={displayId}
                    reducedMotion={reducedMotion}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollArea>
        </>
      ) : null}
    </aside>
  );
}