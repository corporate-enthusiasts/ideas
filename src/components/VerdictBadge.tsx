import { VERDICT_CONFIG } from "@/lib/constants";
import type { Verdict } from "@/lib/types";

export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const config = VERDICT_CONFIG[verdict];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
      {config.emoji} {verdict}
    </span>
  );
}
