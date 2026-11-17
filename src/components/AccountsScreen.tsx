"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import {
  accountsTotalCount,
  type Account,
  type AccountStatus,
} from "@/data/accounts";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useBookSummary } from "@/lib/useBookSummary";
import { useRowIntro } from "@/lib/useRowIntro";
import { AccountDrawer } from "./AccountDrawer";
import { AppShell } from "./AppShell";
import { RiskBar, tableCellClass } from "./RiskBar";

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
  const { accounts: allAccounts, sentence } = useBookSummary();
  const rowMotion = useRowIntro();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const counts = useMemo(() => statusCounts(allAccounts), [allAccounts]);

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
  }, [allAccounts, search, statusFilter, sortKey, sortDir]);

  function toggleColumnSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "risk" || key === "arr" ? "desc" : "asc");
    }
  }

  function onSortKey(key: SortKey) {
    return (event: KeyboardEvent<HTMLTableCellElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleColumnSort(key);
      }
    };
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
        <p className="nf-type-body mt-3 text-ink-2">{sentence}</p>
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
            className="nf-type-body w-full max-w-[280px] border-0 border-b border-line bg-transparent py-1.5 text-ink placeholder:text-ink-3 focus:border-ink/25"
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
            className="nf-type-body cursor-pointer border-0 bg-transparent py-1 font-medium text-ink"
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
      drawerOpen={selectedId !== null}
      drawer={
        <AccountDrawer
          accountId={selectedId}
          onClose={() => setSelectedId(null)}
          reducedMotion={reducedMotion}
        />
      }
    >
      <motion.section className="min-h-0" {...rise(reducedMotion, 0.25)}>
        {filtered.length === 0 ? (
          <p className="nf-type-secondary py-8">
            No accounts match your search.
          </p>
        ) : (
          <table className="nf-table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "5%" }} />
            </colgroup>
            <thead className="nf-table-head">
              <tr>
                <th className="nf-type-label nf-table-cell text-left font-medium">
                  Company
                </th>
                <th
                  className={`${thClass("arr")} pr-4 text-right`}
                  tabIndex={0}
                  aria-sort={
                    sortKey === "arr"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  onClick={() => toggleColumnSort("arr")}
                  onKeyDown={onSortKey("arr")}
                >
                  ARR
                  <SortArrow active={sortKey === "arr"} dir={sortDir} />
                </th>
                <th
                  className={`${thClass("risk")} pr-4 text-right`}
                  tabIndex={0}
                  aria-sort={
                    sortKey === "risk"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  onClick={() => toggleColumnSort("risk")}
                  onKeyDown={onSortKey("risk")}
                >
                  Risk
                  <SortArrow active={sortKey === "risk"} dir={sortDir} />
                </th>
                <th className="nf-type-label nf-table-cell font-medium"> </th>
                <th className="nf-type-label nf-table-cell nf-table-cell-inset text-left font-medium">
                  Status
                </th>
                <th className="nf-type-label nf-table-cell text-left font-medium">
                  Reason
                </th>
                <th
                  className={`${thClass("lastActive")} nf-table-cell-inset`}
                  tabIndex={0}
                  aria-sort={
                    sortKey === "lastActive"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  onClick={() => toggleColumnSort("lastActive")}
                  onKeyDown={onSortKey("lastActive")}
                >
                  Last active
                  <SortArrow active={sortKey === "lastActive"} dir={sortDir} />
                </th>
                <th
                  className={`${thClass("renewal")} nf-table-cell-inset`}
                  tabIndex={0}
                  aria-sort={
                    sortKey === "renewal"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  onClick={() => toggleColumnSort("renewal")}
                  onKeyDown={onSortKey("renewal")}
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
                const openRow = () => setSelectedId(row.id);
                return (
                  <motion.tr
                    key={row.id}
                    tabIndex={0}
                    aria-selected={selected}
                    onClick={openRow}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openRow();
                      }
                    }}
                    className="group cursor-pointer border-b border-line last:border-b-0"
                    {...rowMotion(row.id, index)}
                  >
                    <td
                      className={`nf-type-body whitespace-nowrap ${selected ? "font-semibold" : "font-medium"} ${tableCellClass(selected)}`}
                    >
                      {row.name}
                    </td>
                    <td
                      className={`nf-type-body tabular-nums whitespace-nowrap pr-4 text-right ${tableCellClass(selected)}`}
                    >
                      {row.arr}
                    </td>
                    <td
                      className={`nf-type-body tabular-nums whitespace-nowrap pr-4 text-right font-semibold ${tableCellClass(selected)}`}
                    >
                      {row.risk}
                    </td>
                    <td className={tableCellClass(selected)}>
                      <RiskBar risk={row.risk} status={row.status} />
                    </td>
                    <td
                      className={`nf-table-cell-inset whitespace-nowrap ${tableCellClass(selected)}`}
                    >
                      <StatusCell status={row.status} />
                    </td>
                    <td
                      className={`nf-type-body nf-table-cell-reason text-ink-3 ${tableCellClass(selected)}`}
                      title={row.reason}
                    >
                      {row.reason}
                    </td>
                    <td
                      className={`nf-type-body nf-table-cell-inset tabular-nums whitespace-nowrap text-ink-3 ${tableCellClass(selected)}`}
                    >
                      {row.lastActive}
                    </td>
                    <td
                      className={`nf-type-body nf-table-cell-inset tabular-nums whitespace-nowrap ${tableCellClass(selected)}`}
                    >
                      {row.renewal}
                    </td>
                    <td
                      className={`nf-type-body whitespace-nowrap text-ink-3 ${tableCellClass(selected)}`}
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