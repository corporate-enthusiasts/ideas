interface ScoreBarProps {
  label: string;
  score: number;
  reasoning?: string;
}

export default function ScoreBar({ label, score, reasoning }: ScoreBarProps) {
  const pct = (score / 5) * 100;

  return (
    <div className="group">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{score}/5</span>
      </div>
      <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {reasoning && (
        <p className="mt-1 hidden text-xs text-gray-500 group-hover:block">{reasoning}</p>
      )}
    </div>
  );
}
