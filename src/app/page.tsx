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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Idea Board</h1>
        <Link
          href="/submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Submit Idea
        </Link>
      </div>

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
        />
      </div>

      {isLoading && (
        <div className="py-12 text-center text-gray-500">Loading ideas...</div>
      )}

      {error && (
        <div className="py-12 text-center text-red-500">Failed to load ideas. Try refreshing.</div>
      )}

      {filtered.length === 0 && !isLoading && !error && (
        <div className="py-12 text-center text-gray-500">No ideas match your filters.</div>
      )}

      <div className="space-y-4">
        {filtered.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}
