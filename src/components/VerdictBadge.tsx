import { VERDICT_CONFIG } from "@/lib/constants";
import type { Verdict } from "@/lib/types";

export default function VerdictBadge({ verdict, size = "sm" }: { verdict: Verdict; size?: "sm" | "lg" }) {
  const config = VERDICT_CONFIG[verdict];
  const isLg = size === "lg";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide uppercase ${config.bg} ${config.color} ${
        isLg ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-0.5 text-[10px]"
      }`}
      style={{ borderLeft: `2px solid ${config.cssColor}` }}
    >
      {verdict}
    </span>
  );
}
