# **Needfire**

A Monday brief for SaaS founders: who is going quiet, why, and what to send them.

**Role:** Solo. I defined the product, designed the interface, and built the working app with AI coding tools in Cursor.

**Timeline:** November 2026

**Live demo:** [needfire.vercel.app](https://needfire.vercel.app)

## **The problem**

Most early SaaS founders find out a customer is leaving after the decision is already made. Payments, renewal dates and support tickets live in different tools. None of them answers the only question that matters on a Monday morning: who is going quiet, why, and what should I do about it today?

The tools that do try to answer this, Gainsight, ChurnZero and Vitally, are built for customer success organisations. They are large, quote-based platforms. A founder with no CS hire does not need a suite. She needs a short brief she can act on before standup.

## **Who it's for**

I designed Needfire around Meera Iyer, co-founder of Ledgerly, a Bengaluru invoicing SaaS with ₹3.2 crore ARR and 186 accounts. There is no customer success person on the team. Two renewals close this month. She opens the product with chai, before Slack, and should leave the brief able to name the accounts that cannot wait, the reason for each, and a next step.

The app uses a seeded book of 40 realistic accounts, all sample data. On Accounts, the header names the full 186, with a quiet note — “Showing 40 of 186 in demo”.

## **Key product decisions**

**Scores you can see, not a black box.** The obvious alternative was a predicted churn score from a model. I rejected that. A founder will not email a customer because a model said 82 and offered no reason she can check. Needfire uses a weighted, rule-based score from signals she already understands: a 14-day login drop, unused seats, support sentiment, failed payments, a champion leaving, and a renewal inside 30 days. In Settings she can change each weight and the Critical and Watch thresholds, and the lists on Brief and Accounts update immediately. The product should be honest about how it thinks.

**A Monday brief, not a dashboard.** The other alternative was a busy command center: trends, playbooks, health over time, a wall of charts. I cut all of that. Meera has about ten minutes. The home screen is a brief: a few KPIs, three "Can't wait" cards, and a short at-risk table. Click a row and a drawer opens with the timeline, a short read, and a draft. Accounts is the full list, for when she wants to search or sort.

**Drafted emails she sends herself.** I also considered alerts, and a button that sends the email from inside Needfire. Alerts become noise. Sending mail on her behalf is a trust problem. Needfire writes an email draft in three tones, Warm, Direct and Executive, and she copies it into her own inbox. The product drafts. It does not send.

**A demo that works without a key.** Requiring an API key before anyone can try the product would have killed the walkthrough. Demo mode ships with pre-written explanations and drafts, clearly marked as demo. If she wants, she can paste her own API key. It stays in the session only, never on a server, and it only rewrites the "why" and the email draft. It does not change the scores, and it is not a trained churn model.

## **Design process**

The first mockup round came back cluttered and "AI-generated looking". Too many chips, too little air, and a visual style that felt generic.

The second round offered three directions: Air, a frosted sheet over a dusk photo; Ink, a denser typographic treatment; and Smoked glass. Air felt the most balanced, so I took it forward. I kept Smoked glass for a future customer-facing project.

I built the app locally in Cursor with Next.js, Tailwind and Motion. Once it was running in the browser, the photo backdrop stopped earning its place. The sheet covered almost the entire screen, so the photo only showed as odd white or edge strips. I dropped it and replaced it with a solid warm-grey frame (#ECEAE6) around a solid #FAF9F7 sheet. The frame is even on every side, and the product finally felt calm.

Type was the other early miss. Almost everything was 11 or 12 pixels, which read like fine print. I defined a shared type scale, Fraunces for titles and figures, Figtree for the interface, and locked the app shell so the sidebar, header and toolbar stay put while only the main column scrolls. Ember (#D9461F) is used sparingly, for critical risk and the actions that matter.

A later polish pass made the numbers consistent across Brief, Accounts and Settings, hid the Accounts drawer until a row is selected, and added tabular numerals and visible focus states.

## **What's in the product**

Three screens, all live at [needfire.vercel.app](https://needfire.vercel.app).

**Brief.** The Monday view. KPIs for ARR at risk and Critical, Watch and Healthy counts, three accounts that cannot wait, and an at-risk table. Opening a row shows a why timeline, a short "Needfire's read", and the email draft, with a tone toggle and Copy.

**Accounts.** The full demo list, 40 of 186 accounts, with search, a status filter, sorting, and the same drawer.

**Settings.** Workspace details, the scoring rules and thresholds (these update the other screens live), AI draft mode (demo or a session API key), and data sources marked "coming later".

The first version does not connect to Stripe, Intercom or a CRM, and it does not send email. I wanted a complete, honest walkthrough before adding live integrations.

## **What I'd build next**

The next real step is connecting live sources, starting with Stripe and Intercom, so the brief is about Meera's actual book, not a seeded one. After that I would add a scheduled Monday email of the brief, and a simple record of which drafts were copied and whether those accounts renewed.

I have not run this with real customers yet, so everything here is a design hypothesis, not user research. The targets I would set for a real launch are below. These are targets, not results I have measured.

- **Activation:** a new workspace can name a top at-risk account, the reason, and a next step within two minutes of opening the brief. For this demo, a visitor should be able to do the same with no API key.
- **Saves per week:** at least three copied and sent email drafts each week from a founder who has 150 or more accounts.
- **Churn prevented:** over a quarter, a drop in logo churn or at-risk ARR among accounts that received a drafted email, compared with a baseline period. I would instrument this only after live data is connected.

Needfire is a founder-first Monday view, not an enterprise CS platform. The job is to make the quiet accounts visible in time to do something about them.