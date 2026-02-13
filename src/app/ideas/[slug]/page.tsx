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
import { SCORE_LABELS, VERDICT_CONFIG } from "@/lib/constants";
import type { Idea, Note } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface DetailData {
  idea: Idea;
  notes: Note[];
  _ideaSha: string;
  _notesSha: string | null;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
      <h2 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">{title}</h2>
      {children}
    </section>
  );
}

export default function IdeaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, error, isLoading, mutate } = useSWR<DetailData>(`/api/ideas/${slug}`, fetcher);
  const [summaryOpen, setSummaryOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-4">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-80" />
          <div className="skeleton mt-6 h-40 w-full rounded-xl" />
          <div className="skeleton h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data?.idea) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-[var(--text-tertiary)]">Idea not found.</p>
        <Link href="/" className="mt-2 inline-block text-sm text-[var(--accent)] hover:underline">Back to board</Link>
      </div>
    );
  }

  const { idea, notes } = data;
  const config = VERDICT_CONFIG[idea.verdict];
  const isDraft = idea.status === "draft";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </Link>

      {/* Hero header */}
      <div className="mb-8 animate-card-in">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{idea.name}</h1>
            <p className="mt-1.5 text-[15px] text-[var(--text-secondary)]">{idea.one_liner}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {isDraft ? (
              <span className="rounded-full bg-[var(--bg-surface-raised)] px-3 py-1.5 text-xs font-semibold text-[var(--text-tertiary)]">
                Unscored
              </span>
            ) : (
              <>
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
                  style={{ backgroundColor: `color-mix(in srgb, ${config.cssColor} 12%, transparent)`, color: config.cssColor }}
                >
                  {idea.composite_score}
                </div>
                <VerdictBadge verdict={idea.verdict} size="lg" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Tags */}
        <Section title="Details">
          <TagEditor idea={idea} onUpdated={mutate} />
          <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-[var(--text-tertiary)]">
            <span>Submitter: <span className="text-[var(--text-primary)]">{idea.submitter}</span></span>
            <span>Created: <span className="text-[var(--text-primary)]">{idea.created}</span></span>
            {idea.updated !== idea.created && (
              <span>Updated: <span className="text-[var(--text-primary)]">{idea.updated}</span></span>
            )}
          </div>
        </Section>

        {/* Scores */}
        {!isDraft && (
          <Section title="Scores">
            <div className="space-y-3.5">
              {Object.entries(idea.scores).map(([key, val]) => (
                <ScoreBar
                  key={key}
                  scoreKey={key}
                  label={SCORE_LABELS[key] ?? key}
                  score={val.score}
                  reasoning={val.reasoning}
                />
              ))}
            </div>
            <p className="mt-3 text-[11px] text-[var(--text-tertiary)]">Hover any score to see reasoning</p>
          </Section>
        )}

        {/* Summary */}
        {idea.summary && (
          <Section title="Summary">
            <p className={`text-[15px] leading-relaxed text-[var(--text-primary)] ${!summaryOpen ? "line-clamp-3" : ""}`}>
              {idea.summary}
            </p>
            <button
              onClick={() => setSummaryOpen(!summaryOpen)}
              className="mt-3 text-[13px] font-medium text-[var(--accent)] hover:underline"
            >
              {summaryOpen ? "Collapse" : "Read full report"}
            </button>
          </Section>
        )}

        {/* Brief */}
        {idea.brief && idea.brief.problem && (
          <Section title="Brief">
            <dl className="space-y-4">
              {Object.entries(idea.brief).map(([key, val]) => {
                if (!val) return null;
                return (
                  <div key={key}>
                    <dt className="text-[12px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">{key.replace(/_/g, " ")}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-[var(--text-primary)]">{val}</dd>
                  </div>
                );
              })}
            </dl>
          </Section>
        )}

        {/* Notes */}
        <Section title={`Notes (${notes.length})`}>
          <NotesList notes={notes} />
          <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Add Note</p>
            <AddNoteForm slug={slug} onNoteAdded={mutate} />
          </div>
        </Section>

        {/* Eval History */}
        {idea.evaluation_history && idea.evaluation_history.length > 0 && (
          <Section title="Evaluation History">
            <EvalHistory entries={idea.evaluation_history} />
          </Section>
        )}
      </div>
    </div>
  );
}
