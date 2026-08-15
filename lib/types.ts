// 評価軸(10軸・共通) — 要件定義書 5.2
export type AxisKey =
  | "education" // 教育水準
  | "tax" // 税制優遇
  | "cost" // 生活費の安さ
  | "safety" // 治安
  | "climate" // 気候
  | "visaEase" // ビザ取得易しさ
  | "jobMarket" // 就労機会
  | "english" // 英語通用度
  | "lowJpCommunity" // 日本人少なさ(語学向上度合い)
  | "stability"; // 制度安定性

export const AXIS_KEYS: AxisKey[] = [
  "education",
  "tax",
  "cost",
  "safety",
  "climate",
  "visaEase",
  "jobMarket",
  "english",
  "lowJpCommunity",
  "stability",
];

export const AXIS_LABELS: Record<AxisKey, string> = {
  education: "教育水準",
  tax: "税制優遇",
  cost: "生活費の安さ",
  safety: "治安",
  climate: "気候",
  visaEase: "ビザ取得易しさ",
  jobMarket: "就労機会",
  english: "英語通用度",
  lowJpCommunity: "日本人少なさ(語学向上度)",
  stability: "制度安定性",
};

// 目的セグメント(Step1) — 要件定義書 2.2
export type SegmentId =
  | "wealthy_migration"
  | "early_retirement"
  | "language_study"
  | "working_holiday"
  | "overseas_job"
  | "education_migration"
  | "entrepreneur";

// 渡航形態(Step0) — 要件定義書 2.1
export type TravelType = "solo" | "mother_child" | "family" | "child_only";

export interface Segment {
  id: SegmentId;
  label: string;
  description: string;
  weights: Record<AxisKey, number>; // 各軸 0-1、合計1
}

export interface VisaProgram {
  segment: SegmentId;
  name: string;
  requirements: string;
  notes: string;
}

export interface Country {
  id: string;
  nameJa: string;
  region: string;
  flagEmoji: string;
  scores: Record<AxisKey, number>; // 1-5点
  riskFlag: boolean; // 情勢・制度変更リスク高
  lastUpdated: string;
  notes: string;
  costSummaryMonthlyJpy: string; // 生活費目安(月額、概算)
  visaPrograms: VisaProgram[];
  // ハード条件(足切り)用の付随データ。すべてドラフト値であり公開前に要検証(要件定義書9章)
  hardFilterData: {
    hasWorkingHolidayWithJapan: boolean;
    workingHolidayAgeLimit?: number; // ワーホリ協定の年齢上限
    minAssetTierJpy?: number; // 投資移住等に必要な想定資産額の目安(円)
    minCapitalTierJpy?: number; // 起業ビザに必要な想定資本金の目安(円)
    annualEducationBudgetTierJpy?: number; // インター/現地校の年間教育費目安(円)
    visaFriendlyJobFields?: string[]; // 就労ビザが比較的取得しやすい職種
  };
}

export type QuestionType = "single" | "yesno" | "scale5" | "number";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionDef {
  id: string;
  label: string;
  type: QuestionType;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export type AnswerValue = string | number;
export type AnswerMap = Record<string, AnswerValue>;

export interface DiagnosisInput {
  travelType: TravelType;
  segment: SegmentId;
  step2Answers: AnswerMap;
  step3Answers: AnswerMap;
}

export interface CountryResult {
  country: Country;
  score: number; // 0-5
  matchPercent: number; // 0-100
  axisBreakdown: { axis: AxisKey; weighted: number }[];
}

export interface DiagnosisResult {
  candidates: CountryResult[];
  top3: CountryResult[];
  excludedByHardFilter: { country: Country; reason: string }[];
  diffExplanations: string[];
}
