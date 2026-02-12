import Link from "next/link";
import SubmitForm from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-sm text-blue-600 hover:underline">&larr; Back</Link>

      <h1 className="mb-2 text-2xl font-bold text-gray-900">Submit an Idea</h1>
      <p className="mb-6 text-sm text-gray-500">Log a new idea as a draft. The team can discuss and evaluate it later.</p>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <SubmitForm />
      </div>
    </div>
  );
}
