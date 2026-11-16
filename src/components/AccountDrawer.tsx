"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  accountDrawerDetails,
  atRiskAccounts,
  getAccountName,
  type Tone,
} from "@/data/sample";

type AccountDrawerProps = {
  accountId: string | null;
  onClose: () => void;
  reducedMotion: boolean;
  onScrollNode: (node: HTMLDivElement | null) => void;
};

const toneLabels: { id: Tone; label: string }[] = [
  { id: "warm", label: "Warm" },
  { id: "direct", label: "Direct" },
  { id: "executive", label: "Executive" },
];

function drawerMeta(id: string) {
  return atRiskAccounts.find((a) => a.id === id);
}

function AccountDrawerBody({
  accountId,
  reducedMotion,
}: {
  accountId: string;
  reducedMotion: boolean;
}) {
  const [tone, setTone] = useState<Tone>("warm");
  const [copied, setCopied] = useState(false);

  const detail = accountDrawerDetails[accountId];
  const meta = drawerMeta(accountId);
  const name = getAccountName(accountId);
  const draft = detail?.drafts[tone];

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copyDraft = useCallback(async () => {
    if (!draft) return;
    const text = [
      draft.subject,
      "",
      ...draft.paragraphs,
      "",
      draft.signoff,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [draft]);

  const crossFade = reducedMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0, 0, 0.2, 1] as const };

  return (
    <>
      <h2 className="font-display mt-3.5 mb-2.5 text-[32px] font-[350] leading-[1.1] tracking-[-0.02em] [font-variation-settings:'SOFT'_100,'opsz'_72]">
        {name}
      </h2>
      {meta && (
        <div className="flex gap-4 text-[13px] text-ink-3">
          <span className="tabular-nums">{meta.arr} ARR</span>
          <span>
            Risk{" "}
            <b className="tabular-nums font-semibold text-ink">
              {meta.risk}
            </b>
          </span>
          <span className="tabular-nums">
            {detail?.renewal ?? `Renews ${meta.renewal}`}
          </span>
        </div>
      )}

      {detail ? (
        <>
          <section className="mt-[30px]">
            <h4 className="mb-3.5 text-[13px] font-semibold">Why</h4>
            <ol className="flex flex-col gap-3.5">
              {detail.why.map((event) => (
                <li
                  key={`${event.date}-${event.title}`}
                  className="grid grid-cols-[56px_1fr] gap-2"
                >
                  <span className="tabular-nums text-[13px] text-ink-3">
                    {event.date}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{event.title}</div>
                    <div className="text-[13px] text-ink-3">{event.body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-[30px]">
            <h4 className="mb-3.5 text-[13px] font-semibold">
              Needfire&apos;s read
            </h4>
            <p className="text-[14.5px] leading-[1.6] text-ink-2">
              {detail.read}
            </p>
          </section>

          <section className="mt-[30px] flex flex-1 flex-col">
            <div className="flex items-baseline justify-between">
              <h4 className="text-[13px] font-semibold">Save email</h4>
              <div className="flex gap-3.5 text-[13px] text-ink-3">
                {toneLabels.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTone(id)}
                    className={
                      tone === id
                        ? "font-semibold text-ink underline decoration-ink decoration-[1.5px] underline-offset-[5px]"
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
                    <div className="mb-1.5 font-semibold text-ink">
                      {draft.subject}
                    </div>
                    {draft.paragraphs.map((p) => (
                      <p key={p.slice(0, 24)} className="mt-2 first:mt-0">
                        {p}
                      </p>
                    ))}
                    <p className="mt-2">{draft.signoff}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-[18px] text-[12.5px]">
                    <span className="text-ink-3">Copied, never sent</span>
                    <button
                      type="button"
                      onClick={copyDraft}
                      className="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white"
                    >
                      {copied ? "Copied" : "Copy draft"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </>
      ) : (
        <p className="mt-[30px] text-sm text-ink-3">Draft coming soon</p>
      )}
    </>
  );
}

export function AccountDrawer({
  accountId,
  onClose,
  reducedMotion,
  onScrollNode,
}: AccountDrawerProps) {
  const crossFade = reducedMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0, 0, 0.2, 1] as const };

  return (
    <aside className="flex min-h-0 flex-col border-l border-line bg-drawer">
      <div className="flex shrink-0 justify-between px-8 pt-[30px] text-[13px]">
        <span className="text-ink-3">Account</span>
        <button type="button" onClick={onClose} className="text-ink-3">
          Close
        </button>
      </div>

      <div
        ref={onScrollNode}
        className="nf-scrollbar-hide min-h-0 flex-1 overflow-y-auto px-8 pb-[30px]"
      >
        <AnimatePresence mode="wait">
          {!accountId ? (
            <motion.div
              key="empty"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={crossFade}
              className="mt-6 text-sm text-ink-3"
            >
              Select an account from the table or Can&apos;t wait cards.
            </motion.div>
          ) : (
            <motion.div
              key={accountId}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={crossFade}
              className="flex min-h-0 flex-col"
            >
              <AccountDrawerBody
                accountId={accountId}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}