import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RiskBadge } from "@/components/RiskBadge";
import { countries, getCountryById } from "@/data/countries";
import { AXIS_KEYS, AXIS_LABELS } from "@/lib/types";

export function generateStaticParams() {
  return countries.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const country = getCountryById(params.id);
  return { title: country ? `${country.nameJa} | 海外移住・留学診断` : "国が見つかりません" };
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const country = getCountryById(id);
  if (!country) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Link href="/diagnose" className="text-sm text-teal-600 hover:text-teal-700">
            ← 診断に戻る
          </Link>

          <div className="mt-4 flex items-center gap-4 mb-2">
            <span className="text-5xl leading-none">{country.flagEmoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{country.nameJa}</h1>
              <p className="text-sm text-slate-500">{country.region}</p>
            </div>
          </div>

          {country.riskFlag && (
            <div className="mb-4">
              <RiskBadge />
              <p className="mt-2 text-xs text-amber-700">
                この国・地域は制度変更や情勢の変化が比較的起こりやすいため、最新の一次情報をあわせてご確認ください。
              </p>
            </div>
          )}

          <p className="text-slate-600 mb-8">{country.notes}</p>

          <section className="mb-8">
            <h2 className="font-bold text-slate-900 mb-3">評価スコア(1〜5点)</h2>
            <div className="space-y-2">
              {AXIS_KEYS.map((axis) => (
                <div key={axis} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-sm text-slate-500">
                    {AXIS_LABELS[axis]}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${(country.scores[axis] / 5) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold text-slate-700">
                    {country.scores[axis]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400 mb-1">生活費目安(月額)</p>
              <p className="font-semibold text-slate-800">{country.costSummaryMonthlyJpy}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400 mb-1">最終更新日</p>
              <p className="font-semibold text-slate-800">{country.lastUpdated}</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-bold text-slate-900 mb-3">関連ビザ制度</h2>
            {country.visaPrograms.length === 0 ? (
              <p className="text-sm text-slate-500">現時点で登録されているビザ制度情報はありません。</p>
            ) : (
              <div className="space-y-3">
                {country.visaPrograms.map((v, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <p className="font-semibold text-slate-800">{v.name}</p>
                    <p className="text-sm text-slate-500 mt-1">要件: {v.requirements}</p>
                    {v.notes && <p className="text-sm text-slate-400 mt-1">{v.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="font-semibold text-slate-900 mb-2">
              {country.nameJa}への移住・留学を具体的に検討したい方へ
            </p>
            <p className="text-sm text-slate-500 mb-4">
              提携エージェントによる無料相談をご案内します(プレースホルダー)。
            </p>
            <Link
              href="/diagnose"
              className="inline-block rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
            >
              診断結果からお問い合わせする
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
