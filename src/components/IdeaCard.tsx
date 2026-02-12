import Link from "next/link";
import VerdictBadge from "./VerdictBadge";
import { VERDICT_CONFIG, TYPE_LABELS, EFFORT_LABELS } from "@/lib/constants";
import type { Idea, IdeaType } from "@/lib/types";

interface IdeaCardProps {
  idea: Idea & { _noteCount: number };
  index: number;
}

export default function IdeaCard({ idea, index }: IdeaCardProps) {
  const config = VERDICT_CONFIG[idea.verdict];
  const isDraft = idea.status === "draft";

  return (
    <Link href={`/ideas/${idea.id}`} className={`animate-card-in stagger-${Math.min(index + 1, 8)} block`}>
      <div
        className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] transition-all duration-200 hover:border-[var(--border-focus)] hover:bg-[var(--bg-surface-hover)]"
        style={{ borderLeftWidth: "3px", borderLeftColor: isDraft ? "var(--text-tertiary)" : config.cssColor }}
      >
        <div className="p-5">
          {/* Top row: score + name + verdict */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Score circle */}
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                style={{
                  background: isDraft ? "var(--bg-surface-raised)" : config.cssColor.replace(")", ", 0.12)").replace("var(--verdict-", "rgba(").replace(")", ""),
                  color: isDraft ? "var(--text-tertiary)" : config.cssColor,
                  backgroundColor: isDraft ? "var(--bg-surface-raised)" : undefined,
                }}
              >
                {isDraft ? "?" : idea.composite_score}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]  transition-colors">
                  {idea.name}
                </h3>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)] line-clamp-1">{idea.one_liner}</p>
              </div>
            </div>
            {isDraft ? (
              <span className="shrink-0 rounded-full bg-[var(--bg-surface-raised)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                Unscored
              </span>
            ) : (
              <VerdictBadge verdict={idea.verdict} />
            )}
          </div>

          {/* Tags + meta row */}
          <div className="mt-3.5 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-[var(--bg-surface-raised)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
                {TYPE_LABELS[idea.type as IdeaType] ?? idea.type}
              </span>
              <span className="rounded-md bg-[var(--bg-surface-raised)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
                {EFFORT_LABELS[idea.effort_level] ?? idea.effort_level}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[var(--text-tertiary)]">
              <span>{idea.submitter}</span>
              <span>{idea.created}</span>
              {idea._noteCount > 0 && (
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="opacity-60">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  {idea._noteCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
