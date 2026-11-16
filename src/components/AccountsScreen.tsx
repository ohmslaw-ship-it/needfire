"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  allAccounts,
  accountsTotalCount,
  getAccountsHeaderSummary,
  type Account,
  type AccountStatus,
} from "@/data/accounts";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { AccountDrawer } from "./AccountDrawer";
import { AppShell } from "./AppShell";

type StatusFilter = "all" | AccountStatus;
type SortKey = "risk" | "arr" | "renewal" | "lastActive";
type SortDir = "asc" | "desc";

const statusFilterLabels: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "watch", label: "Watch" },
  { id: "healthy", label: "Healthy" },
];

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "risk", label: "Risk" },
  { id: "arr", label: "ARR" },
  { id: "renewal", label: "Renewal" },
  { id: "lastActive", label: "Last active" },
];

function rise(reduced: boolean, delay: number) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay, ease: [0, 0, 0.2, 1] as const },
      };
}

function rowFade(reduced: boolean, index: number) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: {
          duration: 0.35,
          delay: Math.min(index * 0.02, 0.4),
          ease: [0, 0, 0.2, 1] as const,
        },
      };
}

function statusCounts(accounts: Account[]) {
  return {
    all: accounts.length,
    critical: accounts.filter((a) => a.status === "critical").length,
    watch: accounts.filter((a) => a.status === "watch").length,
    healthy: accounts.filter((a) => a.status === "healthy").length,
  };
}

function compareAccounts(a: Account, b: Account, key: SortKey, dir: SortDir) {
  let cmp = 0;
  switch (key) {
    case "risk":
      cmp = a.risk - b.risk;
      break;
    case "arr":
      cmp = a.arrLakhs - b.arrLakhs;
      break;
    case "renewal":
      cmp = a.renewalSort - b.renewalSort;
      break;
    case "lastActive":
      cmp = a.lastActiveSort - b.lastActiveSort;
      break;
    default:
      cmp = 0;
  }
  return dir === "asc" ? cmp : -cmp;
}

function StatusCell({ status }: { status: AccountStatus }) {
  const label =
    status === "critical"
      ? "Critical"
      : status === "watch"
        ? "Watch"
        : "Healthy";
  const dotClass =
    status === "critical"
      ? "bg-ember"
      : status === "watch"
        ? "bg-[rgba(22,24,29,0.45)]"
        : "bg-[rgba(22,24,29,0.22)]";
  const textClass =
    status === "critical" ? "text-ember font-medium" : "text-ink-3";

  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
      <span className={`nf-type-body ${textClass}`}>{label}</span>
    </span>
  );
}

function riskBarClass(status: AccountStatus) {
  if (status === "critical") return "bg-ink-2";
  if (status === "watch") return "bg-[rgba(22,24,29,0.32)]";
  return "bg-[rgba(22,24,29,0.18)]";
}

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return (
      <span className="nf-type-label ml-1 inline-block opacity-50">↕</span>
    );
  }
  return (
    <span className="nf-type-label ml-1 inline-block">
      {dir === "asc" ? "↑" : "↓"}
    </span>
  );
}

export function AccountsScreen() {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const counts = useMemo(() => statusCounts(allAccounts), []);
  const summary = useMemo(() => getAccountsHeaderSummary(allAccounts), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = allAccounts;
    if (statusFilter !== "all") {
      rows = rows.filter((a) => a.status === statusFilter);
    }
    if (q) {
      rows = rows.filter((a) => a.name.toLowerCase().includes(q));
    }
    return [...rows].sort((a, b) => compareAccounts(a, b, sortKey, sortDir));
  }, [search, statusFilter, sortKey, sortDir]);

  function toggleColumnSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "risk" || key === "arr" ? "desc" : "asc");
    }
  }

  function thClass(key: SortKey) {
    const sortable = ["risk", "arr", "renewal", "lastActive"].includes(key);
    return `nf-type-label nf-table-cell text-left font-medium ${
      sortable ? "cursor-pointer select-none hover:text-ink-2" : ""
    }`;
  }

  const fixedHeader = (
  <>
      <motion.header {...rise(reducedMotion, 0)} className="pb-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="nf-type-page-title">Accounts</h1>
          <span className="nf-type-secondary">
            {accountsTotalCount} accounts
          </span>
        </div>
        <p className="nf-type-body mt-3 text-ink-2">{summary}</p>
        <p className="nf-type-secondary mt-1.5">
          Showing {allAccounts.length} of {accountsTotalCount} in demo
        </p>
      </motion.header>

      <motion.div
        className="flex flex-wrap items-center gap-x-8 gap-y-4 pb-6"
        {...rise(reducedMotion, 0.15)}
      >
        <label className="flex min-w-[200px] flex-1 items-center gap-2">
          <span className="sr-only">Search accounts</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies"
            className="nf-type-body w-full max-w-[280px] border-0 border-b border-line bg-transparent py-1.5 text-ink outline-none placeholder:text-ink-3 focus:border-ink/25"
          />
        </label>

        <div
          className="nf-type-secondary flex flex-wrap items-center gap-1"
          role="tablist"
          aria-label="Filter by status"
        >
          {statusFilterLabels.map(({ id, label }) => {
            const active = statusFilter === id;
            const count = counts[id];
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatusFilter(id)}
                className={`rounded-sm px-2 py-1 transition-colors duration-200 ${
                  active ? "nf-type-body font-semibold text-ink" : "hover:text-ink-2"
                }`}
              >
                {label}
                <span className="ml-1 tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>

        <label className="nf-type-secondary flex items-center gap-2">
          <span>Sort</span>
          <select
            value={sortKey}
            onChange={(e) => {
              const key = e.target.value as SortKey;
              setSortKey(key);
              setSortDir(key === "risk" || key === "arr" ? "desc" : "asc");
            }}
            className="nf-type-body cursor-pointer border-0 bg-transparent py-1 font-medium text-ink outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </motion.div>
  </>
  );

  return (
    <AppShell
      fixedHeader={fixedHeader}
      drawer={(onScrollNode) => (
        <AccountDrawer
          accountId={selectedId}
          onClose={() => setSelectedId(null)}
          reducedMotion={reducedMotion}
          onScrollNode={onScrollNode}
        />
      )}
    >
      <motion.section className="min-h-0" {...rise(reducedMotion, 0.25)}>
        {filtered.length === 0 ? (
          <p className="nf-type-secondary py-8">
            No accounts match your search.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="nf-table-head">
              <tr>
                <th className="nf-type-label nf-table-cell text-left font-medium">
                  Company
                </th>
                <th
                  className={`${thClass("arr")} pr-4 text-right`}
                  onClick={() => toggleColumnSort("arr")}
                >
                  ARR
                  <SortArrow active={sortKey === "arr"} dir={sortDir} />
                </th>
                <th
                  className={`${thClass("risk")} pr-4 text-right`}
                  onClick={() => toggleColumnSort("risk")}
                >
                  Risk
                  <SortArrow active={sortKey === "risk"} dir={sortDir} />
                </th>
                <th className="nf-type-label nf-table-cell font-medium"> </th>
                <th className="nf-type-label nf-table-cell text-left font-medium">
                  Status
                </th>
                <th className="nf-type-label nf-table-cell text-left font-medium">
                  Reason
                </th>
                <th
                  className={thClass("lastActive")}
                  onClick={() => toggleColumnSort("lastActive")}
                >
                  Last active
                  <SortArrow active={sortKey === "lastActive"} dir={sortDir} />
                </th>
                <th
                  className={thClass("renewal")}
                  onClick={() => toggleColumnSort("renewal")}
                >
                  Renewal
                  <SortArrow active={sortKey === "renewal"} dir={sortDir} />
                </th>
                <th className="nf-type-label nf-table-cell text-left font-medium">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => {
                const selected = selectedId === row.id;
                return (
                  <motion.tr
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className="group cursor-pointer border-b border-line last:border-b-0"
                    {...rowFade(reducedMotion, index)}
                  >
                    <td
                      className={`nf-type-body nf-table-cell whitespace-nowrap font-medium transition-colors duration-200 ${
                        selected
                          ? "bg-ink/[0.035] shadow-[-12px_0_0_rgba(22,24,29,0.035)]"
                          : "group-hover:bg-ink/[0.02]"
                      }`}
                    >
                      {row.name}
                    </td>
                    <td
                      className={`nf-type-body nf-table-cell tabular-nums whitespace-nowrap pr-4 text-right transition-colors duration-200 ${
                        selected
                          ? "bg-ink/[0.035]"
                          : "group-hover:bg-ink/[0.02]"
                      }`}
                    >
                      {row.arr}
                    </td>
                    <td
                      className={`nf-type-body nf-table-cell tabular-nums whitespace-nowrap pr-4 text-right font-semibold transition-colors duration-200 ${
                        selected
                          ? "bg-ink/[0.035]"
                          : "group-hover:bg-ink/[0.02]"
                      }`}
                    >
                      {row.risk}
                    </td>
                    <td
                      className={`nf-table-cell w-[70px] transition-colors duration-200 ${
                        selected
                          ? "bg-ink/[0.035]"
                          : "group-hover:bg-ink/[0.02]"
                      }`}
                    >
                      <span className="block h-[3px] w-14 rounded-sm bg-[rgba(22,24,29,0.08)]">
                        <i
                          className={`block h-full rounded-sm ${riskBarClass(row.status)}`}
                          style={{ width: `${row.risk}%` }}
                        />
                      </span>
                    </td>
                    <td
                      className={`nf-table-cell whitespace-nowrap transition-colors duration-200 ${
                        selected
                          ? "bg-ink/[0.035]"
                          : "group-hover:bg-ink/[0.02]"
                      }`}
                    >
                      <StatusCell status={row.status} />
                    </td>
                    <td
                      className={`nf-type-secondary nf-table-cell whitespace-nowrap transition-colors duration-200 ${
                        selected
                          ? "bg-ink/[0.035]"
                          : "group-hover:bg-ink/[0.02]"
                      }`}
                    >
                      {row.reason}
                    </td>
                    <td
                      className={`nf-type-secondary nf-table-cell tabular-nums whitespace-nowrap transition-colors duration-200 ${
                        selected
                          ? "bg-ink/[0.035]"
                          : "group-hover:bg-ink/[0.02]"
                      }`}
                    >
                      {row.lastActive}
                    </td>
                    <td
                      className={`nf-type-body nf-table-cell tabular-nums whitespace-nowrap transition-colors duration-200 ${
                        selected
                          ? "bg-ink/[0.035]"
                          : "group-hover:bg-ink/[0.02]"
                      }`}
                    >
                      {row.renewal}
                    </td>
                    <td
                      className={`nf-type-secondary nf-table-cell whitespace-nowrap transition-colors duration-200 ${
                        selected
                          ? "bg-ink/[0.035] shadow-[12px_0_0_rgba(22,24,29,0.035)]"
                          : "group-hover:bg-ink/[0.02]"
                      }`}
                    >
                      {row.owner}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </motion.section>
    </AppShell>
  );
}