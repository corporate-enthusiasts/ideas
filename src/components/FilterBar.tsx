"use client";

import { TYPE_LABELS, EFFORT_LABELS, STATUS_LABELS, VERDICT_CONFIG } from "@/lib/constants";
import type { IdeaType, EffortLevel, IdeaStatus, Verdict, SortOption } from "@/lib/types";

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
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select label="All Types" value={props.type} onChange={props.onTypeChange} options={typeOptions} />
      <Select label="All Effort" value={props.effort} onChange={props.onEffortChange} options={effortOptions} />
      <Select label="All Status" value={props.status} onChange={props.onStatusChange} options={statusOptions} />
      <Select label="All Verdicts" value={props.verdict} onChange={props.onVerdictChange} options={verdictOptions} />

      <div className="ml-auto">
        <select
          value={props.sort}
          onChange={(e) => props.onSortChange(e.target.value as SortOption)}
          aria-label="Sort by"
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          <option value="score">Sort: Score</option>
          <option value="newest">Sort: Newest</option>
          <option value="most_notes">Sort: Most Notes</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>
    </div>
  );
}
