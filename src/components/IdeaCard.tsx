import Link from "next/link";
import VerdictBadge from "./VerdictBadge";
import { VERDICT_CONFIG, TYPE_LABELS, EFFORT_LABELS } from "@/lib/constants";
import type { Idea, IdeaType } from "@/lib/types";

interface IdeaCardProps {
  idea: Idea & { _noteCount: number };
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const verdictEmoji = VERDICT_CONFIG[idea.verdict]?.emoji ?? "";

  return (
    <Link href={`/ideas/${idea.id}`} className="block">
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{verdictEmoji}</span>
            <span className="text-xl font-bold text-gray-900">{idea.composite_score}</span>
            <h3 className="text-lg font-semibold text-gray-900">{idea.name}</h3>
          </div>
          <VerdictBadge verdict={idea.verdict} />
        </div>

        <p className="mt-1.5 text-sm text-gray-600">{idea.one_liner}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
            {TYPE_LABELS[idea.type as IdeaType] ?? idea.type}
          </span>
          <span className="rounded bg-purple-50 px-2 py-0.5 font-medium text-purple-700">
            {EFFORT_LABELS[idea.effort_level] ?? idea.effort_level}
          </span>
          {idea.status === "draft" && (
            <span className="rounded bg-orange-50 px-2 py-0.5 font-medium text-orange-700">Draft</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span>by {idea.submitter}</span>
          <span>{idea.created}</span>
          <span>{idea._noteCount} {idea._noteCount === 1 ? "note" : "notes"}</span>
        </div>
      </div>
    </Link>
  );
}
