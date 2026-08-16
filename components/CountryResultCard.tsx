import Link from "next/link";
import { CountryResult, SegmentId } from "@/lib/types";
import { RiskBadge } from "@/components/RiskBadge";
import { AxisRadarChart } from "@/components/AxisRadarChart";

const RANK_COLORS = ["bg-amber-500", "bg-slate-400", "bg-orange-700"];

export function CountryResultCard({
  result,
  rank,
  segment,
}: {
  result: CountryResult;
  rank: number;
  segment: SegmentId;
}) {
  const { country } = result;
  const visaProgram = country.visaPrograms.find((v) => v.segment === segment);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${RANK_COLORS[rank]}`}
          >
            {rank + 1}
          </span>
          <span className="text-3xl leading-none">{country.flagEmoji}</span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{country.nameJa}</h3>
            <p className="text-xs text-slate-500">{country.region}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-teal-600">
            {result.matchPercent}
            <span className="text-sm font-semibold">%</span>
          </p>
          <p className="text-xs text-slate-400">マッチ度</p>
        </div>
      </div>

      {country.riskFlag && <div className="mb-3">{<RiskBadge />}</div>}

      <div className="mb-2">
        <AxisRadarChart scores={country.scores} />
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <dt className="text-slate-400">生活費目安(月額)</dt>
          <dd className="font-medium text-slate-800">{country.costSummaryMonthlyJpy}</dd>
        </div>
        <div>
          <dt className="text-slate-400">該当ビザ制度</dt>
          <dd className="font-medium text-slate-800">
            {visaProgram ? visaProgram.name : "―"}
          </dd>
        </div>
      </dl>

      <p className="text-sm text-slate-600 mb-4">{country.notes}</p>

      <Link
        href={`/countries/${country.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-teal-600 hover:text-teal-700"
      >
        {country.nameJa}の詳細を見る(別タブ) →
      </Link>
    </div>
  );
}
