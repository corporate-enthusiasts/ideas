import { VERDICT_CONFIG } from "@/lib/constants";
import type { EvalHistoryEntry } from "@/lib/types";

export default function EvalHistory({ entries }: { entries: EvalHistoryEntry[] }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="space-y-0">
      {entries.map((entry, i) => {
        const config = VERDICT_CONFIG[entry.verdict];
        const prev = i > 0 ? entries[i - 1] : null;
        const delta = prev ? entry.score - prev.score : 0;
        const isLast = i === entries.length - 1;

        return (
          <div key={`${entry.date}-${i}`} className="relative flex gap-3 pb-4">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[5px] top-[14px] h-full w-px bg-[var(--border)]" />
            )}
            {/* Timeline dot */}
            <div
              className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2"
              style={{ borderColor: config?.cssColor, backgroundColor: isLast ? config?.cssColor : "var(--bg-surface)" }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-[var(--text-tertiary)]">{entry.date}</span>
                <span className="font-semibold" style={{ color: config?.cssColor }}>{entry.score}</span>
                <span className="text-[11px] font-medium" style={{ color: config?.cssColor }}>{entry.verdict}</span>
                {delta !== 0 && (
                  <span className={`text-[11px] font-bold ${delta > 0 ? "text-[var(--verdict-strong)]" : "text-[var(--verdict-pass)]"}`}>
                    {delta > 0 ? "+" : ""}{delta}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">{entry.trigger}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
