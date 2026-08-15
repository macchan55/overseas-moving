# 海外移住・留学診断サイト

要件定義書(`海外移住・留学診断サイト_要件定義書_v1.0.md`)に基づくMVP実装。
ユーザーの属性・目的・優先条件を5〜15問の質問で診断し、18カ国・地域の中からマッチ度スコア上位3カ国を算出・表示する。

## 技術スタック

- [Next.js](https://nextjs.org) 16 (App Router) / React 19 / TypeScript
- Tailwind CSS v4
- データはリポジトリ内のTypeScriptファイル(`data/`)で管理。DBなしのMVP構成

## セットアップ

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。

```bash
npm run build   # 本番ビルド
npm run lint    # ESLint
```

## ディレクトリ構成

```
app/
  page.tsx                 トップページ(サービス説明+診断開始CTA)
  diagnose/page.tsx         診断フロー画面
  countries/[id]/page.tsx   国詳細ページ
  api/lead/route.ts         リード獲得フォームの送信先(MVPはログ出力のみのプレースホルダー)
components/
  DiagnoseFlow.tsx          診断フローの状態管理(Step0〜3を1問1画面で進行)
  ResultView.tsx            結果画面(TOP3カード・差分説明・リード獲得フォーム)
  CountryResultCard.tsx     国カードUI
  QuestionField.tsx         質問タイプ別の入力UI(単一選択/Yes-No/5段階/数値)
  LeadForm.tsx               リード獲得フォーム
data/
  countries.ts              国マスタ(18カ国・地域、評価スコア1-5点、ハード条件用データ)
  segments.ts                目的セグメント別の重みマトリクス(7セグメント×10軸)
  questions.ts                Step0/Step1/Step2(セグメント別)/Step3(共通)の質問定義
lib/
  types.ts                   型定義
  scoring.ts                  スコアリングエンジン(ハード条件フィルタ→加重スコア→TOP3→差分説明)
  analytics.ts                簡易イベント計測スタブ
```

## マスタデータの出典

`data/countries.ts` と `data/segments.ts` は、添付の
`移住留学診断_マスタデータ_v0.1.xlsx`(重み付けマトリクス・18カ国評価スコア)から
値を転記している。**スコアは未検証のドラフト値であり、公開launch前に一次情報での検証が必須**
(xlsx「READ ME」シート、要件定義書 5.4・8章を参照)。

## 実装済み機能(MVP)

- Step0(渡航形態)→ Step1(目的)→ Step2(目的別深掘り質問、Step1の回答で分岐)→
  Step3(共通制約条件)の1問1画面診断フロー、進捗バー表示
- ハード条件(足切り)フィルタ:ワーホリの年齢上限、投資移住/起業ビザの資産・資本要件、
  教育移住の予算対タイプ費用。全て `data/countries.ts` の `hardFilterData` に集約し
  差し替えやすい構成
- 加重スコアリング(10評価軸 × セグメント別重み)によるTOP3算出、僅差(スコア差0.3未満)時の
  差分説明の自動生成
- 結果画面:TOP3国カード(マッチ度%・国旗・該当ビザ・費用感)、情勢リスク国への注記バッジ
  (香港・中国・インドネシア(バリ))、対象外となった国の一覧(ハード条件による除外理由)
- リード獲得フォーム(メールアドレス取得、`/api/lead` へ送信)
- 国詳細ページ(評価スコア内訳、関連ビザ制度、最終更新日)
- 簡易イベント計測スタブ(診断開始/各Step閲覧/診断完了/リード送信、`window.dataLayer` push)

## 未実装・今後の検討事項(要件定義書 9章に準拠)

- ハード条件の具体的な閾値(ワーホリ年齢上限の国別正式値、投資移住の資産要件額等)は
  ドラフト値。正式な数値マスタが必要
- リード獲得後の提携先送客フローの詳細(即時表示 or メール送付)は未確定。現状は
  `/api/lead` がログ出力するのみのプレースホルダー
- 管理画面(国マスタ・重みマトリクスのCRUD)は未実装。当面は `data/*.ts` の直接編集 +
  半年ごとの棚卸し運用を想定
- 多言語対応は範囲外(日本語のみ)
