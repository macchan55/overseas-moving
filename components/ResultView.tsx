"use client";

import { useState } from "react";
import { DiagnosisResult, SegmentId } from "@/lib/types";
import { getSegmentById } from "@/data/segments";
import { CountryResultCard } from "@/components/CountryResultCard";
import { LeadForm } from "@/components/LeadForm";

export function ResultView({
  result,
  segment,
  onRestart,
}: {
  result: DiagnosisResult;
  segment: SegmentId;
  onRestart: () => void;
}) {
  const [showExcluded, setShowExcluded] = useState(result.top3.length === 0);
  const segmentDef = getSegmentById(segment);

  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-teal-600 mb-2">
          {segmentDef.label}の診断結果
        </p>
        <h2 className="text-2xl font-bold text-slate-900">あなたに合う国 TOP3</h2>
      </div>

      <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
        本診断のスコアは初期ドラフト値の国マスタに基づく参考情報です。ビザ要件・費用等の正式な数値は今後の一次情報検証により変わる可能性があります。
      </div>

      {result.diffExplanations.length > 0 && (
        <div className="mb-8 space-y-2">
          {result.diffExplanations.map((text, i) => (
            <p
              key={i}
              className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-800"
            >
              💡 {text}
            </p>
          ))}
        </div>
      )}

      {result.top3.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {result.top3.map((r, i) => (
              <CountryResultCard key={r.country.id} result={r} rank={i} segment={segment} />
            ))}
          </div>
          <div className="mb-10">
            <LeadForm segment={segment} top1CountryId={result.top3[0].country.id} />
          </div>
        </>
      ) : (
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-semibold text-slate-800 mb-2">
            条件に完全一致する国が見つかりませんでした
          </p>
          <p className="text-sm text-slate-500">
            年齢や資産規模などの条件により、今回はすべての国が対象外となりました。下記の「対象外となった国」から理由をご確認いただくか、条件を変えてもう一度お試しください。
          </p>
        </div>
      )}

      {result.excludedByHardFilter.length > 0 && (
        <div className="mb-10">
          <button
            type="button"
            onClick={() => setShowExcluded((v) => !v)}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            {showExcluded ? "▲" : "▼"} 対象外となった国を見る(
            {result.excludedByHardFilter.length}カ国)
          </button>
          {showExcluded && (
            <ul className="mt-3 space-y-1 text-sm text-slate-500">
              {result.excludedByHardFilter.map(({ country, reason }) => (
                <li key={country.id}>
                  {country.flagEmoji} {country.nameJa}: {reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={onRestart}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700 underline underline-offset-4"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
