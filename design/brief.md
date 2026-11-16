# Needfire — product brief

**Pitch:** See who's going quiet, why, and what to send them, before standup.
**For:** Om Raje, Pune. Sibling to AdsGPT Command Center.
**Date:** 16 Nov 2026 (Asia/Calcutta)

## The user

Meera Iyer co-founds Ledgerly, a Bengaluru B2B invoicing SaaS, ₹3.2 crore ARR, 186 accounts, no CS hire. Monday, 9:12am. Two renewals close this month. Stripe and a Notion board cannot tell her who is quietly leaving. She opens Needfire with chai, before Slack.

**The one question:** Who is going quiet, why, and what do I do about it this morning?

## Signals (sample / simulated)

A seeded book of ~40 accounts, all sample data. Risk is a weighted score, not a model guess, from: 14-day login drop; unused seats; support volume and sentiment; failed charges; a champion leaving; a drop in a key feature (invoice export, reports).

## Hero screen

Monday brief, above the fold: date, ARR at risk, Critical / Watch / Healthy counts, and three accounts that cannot wait — e.g. Northshore Legal, ₹18L ARR, champion left 11 days ago. Below: company, ARR, risk score, top reason, renewal date. Open a row for a "why" timeline, a short AI explanation, and a save-action draft (email or call script) in a warm, direct, or executive tone. Copy, don't send.

Two more screens: All accounts (filter by health) and Settings (demo vs API key).

## v1 scope

**In:** seeded book, brief, drawer, tones, demo mode, and an optional session-only API key (or serverless call) that writes the explanation and save draft. Next.js, TypeScript, Tailwind, Motion, on Vercel.

**Out:** no live Stripe, CRM or Mixpanel hooks; no sending email, playbooks, seats, SSO, billing or forecasting. Seed and session only.

**Honest AI:** scores are rule-based. Demo ships pre-generated explanations and drafts, marked Demo. A live key only rewrites the "why" and the save message — not a trained churn model.

## Success metrics (case study)

1. A visitor can name the top at-risk account, the reason, and a next step in under two minutes.
2. Lighthouse above 95 on the brief.
3. The live demo works with no API key.

Testing: heuristic review and AI persona walkthroughs, labelled honestly — not real user research.

## Competitors (checked 16 Nov 2026)

- **Gainsight** — enterprise CS platform, for CS orgs, not a founder on Monday morning.
- **ChurnZero** — CS growth platform (scores, plays, AI). Same suite shape.
- **Vitally** — mid-market CS platform. Quote-based; for dedicated CS teams.

Needfire is a founder-first Monday view, not an enterprise CS suite.

## Visual direction

Sibling to AdsGPT: lavender canvas `#EEF0FD`, white rounded-28px panels, navy `#050545` type, Plus Jakarta Sans, tinted status pills, soft navy shadows. Accent is ember `#E85A2A` (subtle `#FDECE6`), for critical scores and act-now actions. Healthy: green `#2F6B2E`. Watch: amber `#A26A00`. No generic SaaS chrome.
