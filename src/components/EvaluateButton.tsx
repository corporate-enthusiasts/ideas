"use client";

import { useState, useEffect, useRef } from "react";
import type { IdeaStatus } from "@/lib/types";

interface EvaluateButtonProps {
  slug: string;
  status: IdeaStatus;
  currentScore: number;
  onEvaluated: () => void;
  autoEvaluate?: boolean;
}

export default function EvaluateButton({ slug, status, currentScore, onEvaluated, autoEvaluate }: EvaluateButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [delta, setDelta] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const autoFiredRef = useRef(false);

  const isDraft = status === "draft";
  const label = isDraft ? "Evaluate" : "Re-evaluate";

  useEffect(() => {
    if (autoEvaluate && isDraft && !autoFiredRef.current) {
      autoFiredRef.current = true;
      handleClick();
    }
  }, [autoEvaluate]);

  async function handleClick() {
    setState("loading");
    setDelta(null);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/ideas/${slug}/evaluate`, { method: "POST" });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Evaluation failed");
      }

      const data = await res.json();

      if (!isDraft && currentScore > 0) {
        setDelta(data.composite_score - currentScore);
      }

      setState("success");
      onEvaluated();

      // Reset to idle after showing result
      setTimeout(() => {
        setState("idle");
        setDelta(null);
      }, 4000);
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={state === "loading"}
        className={`
          rounded-lg px-4 py-2 text-sm font-semibold transition-all
          ${state === "loading"
            ? "cursor-wait bg-[var(--bg-surface-raised)] text-[var(--text-tertiary)]"
            : state === "success"
              ? "bg-[color-mix(in_srgb,var(--verdict-promising)_15%,transparent)] text-[var(--verdict-promising)]"
              : state === "error"
                ? "bg-[color-mix(in_srgb,var(--verdict-pass)_15%,transparent)] text-[var(--verdict-pass)]"
                : "cursor-pointer bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
          }
          disabled:opacity-60
        `}
      >
        {state === "loading" && "Evaluating..."}
        {state === "idle" && label}
        {state === "success" && "Done!"}
        {state === "error" && "Failed"}
      </button>

      {state === "success" && delta !== null && (
        <span className={`text-sm font-semibold ${delta >= 0 ? "text-[var(--verdict-promising)]" : "text-[var(--verdict-pass)]"}`}>
          {delta >= 0 ? "+" : ""}{delta} points
        </span>
      )}

      {state === "error" && errorMsg && (
        <span className="text-xs text-[var(--verdict-pass)]">{errorMsg}</span>
      )}
    </div>
  );
}
