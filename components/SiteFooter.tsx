export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-xs leading-relaxed text-slate-500">
        <p>
          本サイトの診断結果は簡易的なスコアリングに基づく参考情報であり、ビザ・税制等の正式な要件を保証するものではありません。
          国マスタのスコアおよび費用感は初期ドラフト値を含み、一次情報での検証が完了していない項目があります。
          実際の移住・留学のご判断にあたっては、必ず最新の公的情報および専門家へご確認ください。
        </p>
        <p className="mt-2">© {new Date().getFullYear()} 海外移住・留学診断</p>
      </div>
    </footer>
  );
}
