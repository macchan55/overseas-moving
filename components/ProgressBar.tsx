export function ProgressBar({
  current,
  total,
  sectionLabel,
}: {
  current: number;
  total: number;
  sectionLabel: string;
}) {
  const percent = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2 text-xs text-slate-500">
        <span>{sectionLabel}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
