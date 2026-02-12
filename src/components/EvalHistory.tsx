import { VERDICT_CONFIG } from "@/lib/constants";
import type { EvalHistoryEntry } from "@/lib/types";

export default function EvalHistory({ entries }: { entries: EvalHistoryEntry[] }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="space-y-2">
      {entries.map((entry, i) => {
        const config = VERDICT_CONFIG[entry.verdict];
        const prev = i > 0 ? entries[i - 1] : null;
        const delta = prev ? entry.score - prev.score : 0;

        return (
          <div key={`${entry.date}-${i}`} className="flex items-center gap-3 text-sm">
            <span className="w-20 text-gray-500">{entry.date}</span>
            <span className={`font-medium ${config?.color ?? "text-gray-700"}`}>
              {entry.score} ({entry.verdict})
            </span>
            {delta !== 0 && (
              <span className={delta > 0 ? "text-green-600" : "text-red-600"}>
                {delta > 0 ? "+" : ""}{delta}
              </span>
            )}
            <span className="text-gray-400">{entry.trigger}</span>
          </div>
        );
      })}
    </div>
  );
}
