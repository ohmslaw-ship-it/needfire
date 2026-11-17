import { getAccountById } from "./accounts";

export type Tone = "warm" | "direct" | "executive";

export type Workspace = {
  name: string;
  userFirstName: string;
};

export type BriefHeader = {
  dateLabel: string;
};

export type Kpi = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type CantWaitAccount = {
  id: string;
  name: string;
  score: number;
  arr: string;
  reason: string;
  whenLabel: string;
};

export type AtRiskAccount = {
  id: string;
  name: string;
  arr: string;
  risk: number;
  reason: string;
  renewal: string;
  owner: string;
  tier: "crit" | "watch";
};

export type WhyEvent = {
  date: string;
  title: string;
  body: string;
  critical?: boolean;
};

export type EmailDraft = {
  subject: string;
  paragraphs: string[];
  signoff: string;
};

export type AccountDrawerDetail = {
  id: string;
  arr: string;
  risk: number;
  renewal: string;
  why: WhyEvent[];
  read: string;
  drafts: Record<Tone, EmailDraft>;
};

export const workspace: Workspace = {
  name: "Ledgerly",
  userFirstName: "Meera",
};

export const briefHeader: BriefHeader = {
  dateLabel: "Monday, 16 Nov",
};

export const kpis: Kpi[] = [
  {
    id: "arr-risk",
    label: "ARR at risk",
    value: "₹41.6L",
    detail: "+₹9.2L since last Monday",
  },
  {
    id: "critical",
    label: "Critical",
    value: "3",
    detail: "+2 this week",
  },
  {
    id: "watch",
    label: "Watch",
    value: "14",
    detail: "−1 this week",
  },
  {
    id: "renewals",
    label: "Renewals in 30 days",
    value: "7",
    detail: "₹58.3L up for renewal",
  },
];

export const cantWaitAccounts: CantWaitAccount[] = [
  {
    id: "northshore-legal",
    name: "Northshore Legal",
    score: 87,
    arr: "₹18.0L",
    reason: "Champion left 11 days ago",
    whenLabel: "Renews 5 Dec",
  },
  {
    id: "kavya-logistics",
    name: "Kavya Logistics",
    score: 81,
    arr: "₹12.4L",
    reason: "Annual charge failed twice",
    whenLabel: "Grace ends 22 Nov",
  },
  {
    id: "brightline-clinics",
    name: "Brightline Clinics",
    score: 78,
    arr: "₹11.2L",
    reason: "Logins down 62% in 14 days",
    whenLabel: "Renews 27 Dec",
  },
];

export const atRiskAccounts: AtRiskAccount[] = [
  {
    id: "northshore-legal",
    name: "Northshore Legal",
    arr: "₹18.0L",
    risk: 87,
    reason: "Champion left",
    renewal: "5 Dec",
    owner: "Meera",
    tier: "crit",
  },
  {
    id: "kavya-logistics",
    name: "Kavya Logistics",
    arr: "₹12.4L",
    risk: 81,
    reason: "Failed charge",
    renewal: "22 Nov",
    owner: "Arjun",
    tier: "crit",
  },
  {
    id: "brightline-clinics",
    name: "Brightline Clinics",
    arr: "₹11.2L",
    risk: 78,
    reason: "Logins down 62%",
    renewal: "27 Dec",
    owner: "Meera",
    tier: "crit",
  },
  {
    id: "halden-co",
    name: "Halden & Co.",
    arr: "₹9.5L",
    risk: 64,
    reason: "Support tickets up",
    renewal: "14 Jan",
    owner: "Ritika",
    tier: "watch",
  },
  {
    id: "orbitpay",
    name: "Orbitpay",
    arr: "₹7.1L",
    risk: 61,
    reason: "Negative sentiment",
    renewal: "9 Dec",
    owner: "Arjun",
    tier: "watch",
  },
  {
    id: "tessaract-studio",
    name: "Tessaract Studio",
    arr: "₹6.8L",
    risk: 58,
    reason: "9 of 20 seats idle",
    renewal: "2 Feb",
    owner: "Ritika",
    tier: "watch",
  },
];

export const atRiskTotalLabel = "17 accounts";

const northshoreDrafts: Record<Tone, EmailDraft> = {
  warm: {
    subject: "Picking up where Priya left off",
    paragraphs: [
      "Hi Rahul, Priya set Ledgerly up for your billing team last year. Could I take 20 minutes on Thursday to walk you through it and hand over her saved reports?",
    ],
    signoff: "Meera",
  },
  direct: {
    subject: "Ledgerly handover before 5 Dec renewal",
    paragraphs: [
      "Hi Rahul — Priya was your Ledgerly champion. Her login has been inactive for 11 days, and your team opened a ticket about exporting all data.",
      "Can we do 20 minutes this week to transfer her saved reports and make sure billing is covered before your 5 Dec renewal?",
    ],
    signoff: "Meera",
  },
  executive: {
    subject: "Northshore × Ledgerly — continuity before renewal",
    paragraphs: [
      "Rahul — With Priya's departure, nobody at Northshore has picked up Ledgerly since, and an associate (not an admin) asked how to export all data.",
      "I'd like 20 minutes to align on a new owner and confirm you're set before renewal moves to procurement on 5 Dec.",
    ],
    signoff: "Meera",
  },
};

export const accountDrawerDetails: Record<string, AccountDrawerDetail> = {
  "northshore-legal": {
    id: "northshore-legal",
    arr: "₹18.0L",
    risk: 87,
    renewal: "Renews 5 Dec",
    why: [
      {
        date: "24 Oct",
        title: "Priya Nair’s last login",
        body: "Head of Ops and Ledgerly’s only power user.",
      },
      {
        date: "5 Nov",
        title: "Priya left Northshore",
        body: "Her email now bounces.",
      },
      {
        date: "14 Nov",
        title: "Ticket: “How do we export all our data?”",
        body: "Raised by an associate, not an admin.",
        critical: true,
      },
    ],
    read: "Ledgerly at Northshore ran through Priya, and nobody has picked it up since she left. The export ticket suggests they are looking elsewhere, so reach Rahul Mehta before the renewal reaches procurement.",
    drafts: northshoreDrafts,
  },
};

export const defaultSelectedAccountId = "northshore-legal";

export function getAccountName(id: string): string {
  const row =
    getAccountById(id) ??
    atRiskAccounts.find((a) => a.id === id) ??
    cantWaitAccounts.find((a) => a.id === id);
  return row?.name ?? "Account";
}