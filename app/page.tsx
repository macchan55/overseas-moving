import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { segments } from "@/data/segments";
import { countries } from "@/data/countries";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 text-center">
          <p className="text-sm font-semibold text-teal-600 mb-3">
            移住・留学・ワーホリ・海外就職
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">
            あなたに合う国は、どこ?
            <br className="hidden sm:block" />
            5〜15問でわかる、海外移住・留学診断
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            あなたの属性・目的・優先条件を診断し、{countries.length}
            カ国・地域の中からマッチ度の高いTOP3をスコアリングで提示します。
            ビザ制度や費用感もあわせてチェックできます。
          </p>
          <Link
            href="/diagnose"
            className="inline-block rounded-full bg-teal-600 px-8 py-4 text-base font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
          >
            無料で診断を始める(3分)
          </Link>
        </section>

        <section className="bg-white border-y border-slate-200">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">
              こんな目的の方におすすめです
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {segments.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-slate-200 p-5 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-slate-900 mb-1">{s.label}</h3>
                  <p className="text-sm text-slate-500">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">
            診断の流れ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: "1", title: "渡航形態を選択", desc: "単身・母子留学・家族帯同 等" },
              { step: "2", title: "目的を選択", desc: "移住・留学・ワーホリ・就職 等" },
              { step: "3", title: "質問に回答", desc: "目的別の深掘り質問+共通条件" },
              { step: "4", title: "TOP3の国が判明", desc: "マッチ度・ビザ・費用感を表示" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/diagnose"
              className="inline-block rounded-full bg-teal-600 px-8 py-4 text-base font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
            >
              診断を始める
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
