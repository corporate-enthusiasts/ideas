import Link from "next/link";
import SubmitForm from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </Link>

      <div className="mb-6 animate-card-in">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">New Idea</h1>
        <p className="mt-1.5 text-sm text-[var(--text-tertiary)]">Log an idea as a draft. Run <code className="rounded bg-[var(--bg-surface-raised)] px-1.5 py-0.5 text-[var(--accent)]">/validate-idea</code> in Claude Code to score it.</p>
      </div>

      <div className="animate-card-in stagger-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
        <SubmitForm />
      </div>
    </div>
  );
}
