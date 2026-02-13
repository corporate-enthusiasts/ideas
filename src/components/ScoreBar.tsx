import { SCORE_WEIGHTS } from "@/lib/constants";

interface ScoreBarProps {
  label: string;
  scoreKey: string;
  score: number;
  reasoning?: string;
}

function getScoreColor(score: number): string {
  if (score >= 4) return "var(--verdict-strong)";
  if (score >= 3) return "var(--verdict-promising)";
  if (score >= 2) return "var(--verdict-meh)";
  return "var(--verdict-pass)";
}

export default function ScoreBar({ label, scoreKey, score, reasoning }: ScoreBarProps) {
  const pct = (score / 5) * 100;
  const color = getScoreColor(score);
  const weight = SCORE_WEIGHTS[scoreKey];

  return (
    <div className="group">
      <div className="flex items-center justify-between text-[13px]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--text-primary)]">{label}</span>
          {weight && weight !== 1 && (
            <span className="rounded bg-[var(--bg-surface-raised)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--text-tertiary)]">
              {weight}x
            </span>
          )}
        </div>
        <span className="font-semibold tabular-nums" style={{ color }}>
          {score}/5
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface-raised)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {reasoning && (
        <p className="mt-1.5 max-h-0 overflow-hidden text-[13px] leading-relaxed text-[var(--text-secondary)] transition-all duration-200 group-hover:max-h-24">
          {reasoning}
        </p>
      )}
    </div>
  );
}
