"use client";

import { TYPE_LABELS, EFFORT_LABELS, STATUS_LABELS, VERDICT_CONFIG } from "@/lib/constants";
import type { Verdict, SortOption } from "@/lib/types";

interface FilterBarProps {
  type: string;
  effort: string;
  status: string;
  verdict: string;
  sort: SortOption;
  onTypeChange: (v: string) => void;
  onEffortChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onVerdictChange: (v: string) => void;
  onSortChange: (v: SortOption) => void;
  totalCount: number;
  filteredCount: number;
}

function Select({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={`cursor-pointer appearance-none rounded-lg border bg-[var(--bg-input)] px-3 py-1.5 pr-7 text-xs font-medium transition-colors focus:border-[var(--border-focus)] focus:outline-none ${
        value ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--text-secondary)]"
      }`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235c5f73' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export default function FilterBar(props: FilterBarProps) {
  const typeOptions = Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const effortOptions = Object.entries(EFFORT_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const statusOptions = Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const verdictOptions = (Object.keys(VERDICT_CONFIG) as Verdict[]).map((v) => ({
    value: v,
    label: `${VERDICT_CONFIG[v].emoji} ${v}`,
  }));

  const hasFilters = props.type || props.effort || props.status || props.verdict;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select label="Type" value={props.type} onChange={props.onTypeChange} options={typeOptions} />
      <Select label="Effort" value={props.effort} onChange={props.onEffortChange} options={effortOptions} />
      <Select label="Status" value={props.status} onChange={props.onStatusChange} options={statusOptions} />
      <Select label="Verdict" value={props.verdict} onChange={props.onVerdictChange} options={verdictOptions} />

      {hasFilters && (
        <button
          onClick={() => {
            props.onTypeChange("");
            props.onEffortChange("");
            props.onStatusChange("");
            props.onVerdictChange("");
          }}
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
        >
          Clear
        </button>
      )}

      <div className="ml-auto flex items-center gap-3">
        {props.totalCount > 0 && (
          <span className="text-xs text-[var(--text-tertiary)]">
            {props.filteredCount === props.totalCount
              ? `${props.totalCount} ideas`
              : `${props.filteredCount} of ${props.totalCount}`}
          </span>
        )}
        <select
          value={props.sort}
          onChange={(e) => props.onSortChange(e.target.value as SortOption)}
          aria-label="Sort by"
          className="cursor-pointer appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-1.5 pr-7 text-xs font-medium text-[var(--text-secondary)] transition-colors focus:border-[var(--border-focus)] focus:outline-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235c5f73' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
          }}
        >
          <option value="score">Score</option>
          <option value="newest">Newest</option>
          <option value="most_notes">Most Notes</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>
  );
}
