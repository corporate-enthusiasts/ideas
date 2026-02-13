"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import IdeaCard from "@/components/IdeaCard";
import FilterBar from "@/components/FilterBar";
import type { Idea, SortOption } from "@/lib/types";
import Link from "next/link";

type IdeaWithNotes = Idea & { _noteCount: number };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_ORDER: Record<string, number> = {
  building: 0,
  evaluated: 1,
  "re-evaluated": 2,
  draft: 3,
  archived: 4,
};

function SkeletonCard({ index }: { index: number }) {
  return (
    <div className={`animate-card-in stagger-${index + 1} rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5`}>
      <div className="flex items-center gap-3">
        <div className="skeleton h-11 w-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-36" />
          <div className="skeleton h-3 w-64" />
        </div>
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="skeleton h-4 w-20 rounded-md" />
        <div className="skeleton h-4 w-20 rounded-md" />
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { data: ideas, error, isLoading } = useSWR<IdeaWithNotes[]>("/api/ideas", fetcher, {
    refreshInterval: 60000,
  });

  const [type, setType] = useState("");
  const [effort, setEffort] = useState("");
  const [status, setStatus] = useState("");
  const [verdict, setVerdict] = useState("");
  const [sort, setSort] = useState<SortOption>("score");

  const filtered = useMemo(() => {
    if (!ideas) return [];
    let list = [...ideas];

    if (type) list = list.filter((i) => i.type === type);
    if (effort) list = list.filter((i) => i.effort_level === effort);
    if (status) list = list.filter((i) => i.status === status);
    if (verdict) list = list.filter((i) => i.verdict === verdict);

    switch (sort) {
      case "score":
        list.sort((a, b) => b.composite_score - a.composite_score);
        break;
      case "newest":
        list.sort((a, b) => b.created.localeCompare(a.created));
        break;
      case "most_notes":
        list.sort((a, b) => b._noteCount - a._noteCount);
        break;
      case "status":
        list.sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
        break;
    }

    return list;
  }, [ideas, type, effort, status, verdict, sort]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            The Lab
          </h1>
          <p className="mt-1 text-[15px] text-[var(--text-tertiary)]">Corporate Enthusiasts idea pipeline</p>
        </div>
        <Link
          href="/submit"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          + New Idea
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          type={type}
          effort={effort}
          status={status}
          verdict={verdict}
          sort={sort}
          onTypeChange={setType}
          onEffortChange={setEffort}
          onStatusChange={setStatus}
          onVerdictChange={setVerdict}
          onSortChange={setSort}
          totalCount={ideas?.length ?? 0}
          filteredCount={filtered.length}
        />
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} index={i} />)}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-[var(--verdict-pass)] bg-[var(--verdict-pass-bg)] p-6 text-center text-sm text-[var(--verdict-pass)]">
          Failed to load ideas. Try refreshing.
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && !isLoading && !error && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-12 text-center">
          <p className="text-sm text-[var(--text-tertiary)]">
            {ideas?.length ? "No ideas match your filters." : "No ideas yet. Submit the first one."}
          </p>
        </div>
      )}

      {/* Idea cards */}
      <div className="space-y-3">
        {filtered.map((idea, i) => (
          <IdeaCard key={idea.id} idea={idea} index={i} />
        ))}
      </div>
    </div>
  );
}
