"use client";

import { use, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import VerdictBadge from "@/components/VerdictBadge";
import ScoreBar from "@/components/ScoreBar";
import NotesList from "@/components/NotesList";
import EvalHistory from "@/components/EvalHistory";
import AddNoteForm from "@/components/AddNoteForm";
import TagEditor from "@/components/TagEditor";
import { SCORE_LABELS, TYPE_LABELS, EFFORT_LABELS, STATUS_LABELS, VERDICT_CONFIG } from "@/lib/constants";
import type { Idea, Note } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface DetailData {
  idea: Idea;
  notes: Note[];
  _ideaSha: string;
  _notesSha: string | null;
}

export default function IdeaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, error, isLoading, mutate } = useSWR<DetailData>(`/api/ideas/${slug}`, fetcher);
  const [summaryOpen, setSummaryOpen] = useState(false);

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-12 text-center text-gray-500">Loading...</div>;
  if (error || !data?.idea) return <div className="mx-auto max-w-3xl px-4 py-12 text-center text-red-500">Idea not found.</div>;

  const { idea, notes } = data;
  const verdictEmoji = VERDICT_CONFIG[idea.verdict]?.emoji ?? "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-sm text-blue-600 hover:underline">&larr; Back</Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{verdictEmoji}</span>
          <h1 className="text-2xl font-bold text-gray-900">{idea.name}</h1>
          <span className="text-xl font-semibold text-gray-500">{idea.composite_score}</span>
          <VerdictBadge verdict={idea.verdict} />
        </div>
        <p className="mt-1 text-gray-600">{idea.one_liner}</p>
      </div>

      {/* Tags */}
      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Tags</h2>
        <TagEditor idea={idea} onUpdated={mutate} />
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
          <span>Submitter: {idea.submitter}</span>
          <span>Created: {idea.created}</span>
          {idea.updated !== idea.created && <span>Updated: {idea.updated}</span>}
        </div>
      </section>

      {/* Scores */}
      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Scores</h2>
        <div className="space-y-3">
          {Object.entries(idea.scores).map(([key, val]) => (
            <ScoreBar
              key={key}
              label={SCORE_LABELS[key] ?? key}
              score={val.score}
              reasoning={val.reasoning}
            />
          ))}
        </div>
      </section>

      {/* Summary */}
      {idea.summary && (
        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Summary</h2>
          <p className={`text-sm text-gray-700 ${!summaryOpen ? "line-clamp-3" : ""}`}>
            {idea.summary}
          </p>
          <button
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="mt-1 text-xs text-blue-600 hover:underline"
          >
            {summaryOpen ? "Collapse" : "Expand Full Report"}
          </button>
        </section>
      )}

      {/* Brief */}
      {idea.brief && (
        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Brief</h2>
          <dl className="space-y-2 text-sm">
            {Object.entries(idea.brief).map(([key, val]) => (
              <div key={key}>
                <dt className="font-medium text-gray-700 capitalize">{key.replace(/_/g, " ")}</dt>
                <dd className="text-gray-600">{val}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Notes */}
      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Team Notes</h2>
        <NotesList notes={notes} />
        <div className="mt-4 border-t border-gray-100 pt-4">
          <AddNoteForm slug={slug} onNoteAdded={mutate} />
        </div>
      </section>

      {/* Eval History */}
      {idea.evaluation_history && idea.evaluation_history.length > 0 && (
        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Evaluation History</h2>
          <EvalHistory entries={idea.evaluation_history} />
        </section>
      )}
    </div>
  );
}
