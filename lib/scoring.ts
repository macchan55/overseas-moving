import { countries } from "@/data/countries";
import { getSegmentById } from "@/data/segments";
import {
  AXIS_KEYS,
  AXIS_LABELS,
  Country,
  CountryResult,
  DiagnosisInput,
  DiagnosisResult,
} from "@/lib/types";

// スコアリングロジック — 要件定義書 5.1〜5.3
// 1) ハード条件(足切り)を適用し対象国リストを絞り込む
// 2) 残った国について 国スコア = Σ(評価軸スコア[1-5] × セグメント別重み[%]) を算出
// 3) スコア降順でTOP3を返す
// 4) 僅差(スコア差0.3未満)の場合、差分説明を生成する
//
// 注意: ハード条件の閾値(資産額・年齢上限・教育費等)は要件定義書9章に記載の通り
// 未確定のドラフト値。country.hardFilterData 側で管理し、正式な数値マスタが
// 決まり次第 data/countries.ts のみ更新すれば足りるように分離している。

const DIFF_THRESHOLD = 0.3;

function toNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

// 資産レンジ回答 → 下限額(円)
const ASSET_TIER_FLOOR_JPY: Record<string, number> = {
  under_30m: 0,
  "30_100m": 30_000_000,
  "100_300m": 100_000_000,
  "300_1000m": 300_000_000,
  over_1000m: 1_000_000_000,
};

// 起業資金レンジ回答 → 下限額(円)
const CAPITAL_TIER_FLOOR_JPY: Record<string, number> = {
  under_3m: 0,
  "3_10m": 3_000_000,
  "10_30m": 10_000_000,
  over_30m: 30_000_000,
};

// 教育費レンジ回答 → 上限額(円、その予算で許容できる年間教育費の目安)
const EDU_BUDGET_CEILING_JPY: Record<string, number> = {
  under_1m: 1_000_000,
  "1_2m": 2_000_000,
  "2_4m": 4_000_000,
  "4_8m": 8_000_000,
  over_8m: 999_000_000,
};

/**
 * ハード条件(足切り)に抵触する場合、除外理由の文字列を返す。抵触しなければ null。
 */
function hardFilterReason(input: DiagnosisInput, country: Country): string | null {
  const { hardFilterData } = country;

  if (input.segment === "working_holiday") {
    if (!hardFilterData.hasWorkingHolidayWithJapan) {
      return "日本とのワーキングホリデー協定がありません";
    }
    const age = toNumber(input.step2Answers.wh_age);
    if (
      age !== undefined &&
      hardFilterData.workingHolidayAgeLimit !== undefined &&
      age > hardFilterData.workingHolidayAgeLimit
    ) {
      return `ワーキングホリデー協定の年齢上限(${hardFilterData.workingHolidayAgeLimit}歳)を超えています`;
    }
  }

  if (input.segment === "wealthy_migration") {
    const answer = input.step2Answers.wealth_assets;
    const userFloor = typeof answer === "string" ? ASSET_TIER_FLOOR_JPY[answer] : undefined;
    if (
      userFloor !== undefined &&
      hardFilterData.minAssetTierJpy !== undefined &&
      userFloor < hardFilterData.minAssetTierJpy
    ) {
      return "この国の投資移住制度が想定する資産規模に届いていません";
    }
  }

  if (input.segment === "entrepreneur") {
    const answer = input.step2Answers.biz_capital;
    const userFloor = typeof answer === "string" ? CAPITAL_TIER_FLOOR_JPY[answer] : undefined;
    if (
      userFloor !== undefined &&
      hardFilterData.minCapitalTierJpy !== undefined &&
      userFloor < hardFilterData.minCapitalTierJpy
    ) {
      return "この国の起業ビザが想定する資本金規模に届いていません";
    }
  }

  if (input.segment === "education_migration") {
    const answer = input.step2Answers.edu_budget;
    const userCeiling = typeof answer === "string" ? EDU_BUDGET_CEILING_JPY[answer] : undefined;
    if (
      userCeiling !== undefined &&
      hardFilterData.annualEducationBudgetTierJpy !== undefined &&
      userCeiling < hardFilterData.annualEducationBudgetTierJpy
    ) {
      return "この国の教育費水準が予算を上回っています";
    }
  }

  return null;
}

function buildDiffExplanations(
  top: CountryResult[],
  weights: Record<string, number>
): string[] {
  const explanations: string[] = [];

  for (let i = 0; i < top.length - 1; i++) {
    const a = top[i];
    const b = top[i + 1];
    if (Math.abs(a.score - b.score) >= DIFF_THRESHOLD) continue;

    let aBestAxis: (typeof AXIS_KEYS)[number] | null = null;
    let aBestDiff = 0;
    let bBestAxis: (typeof AXIS_KEYS)[number] | null = null;
    let bBestDiff = 0;

    for (const axis of AXIS_KEYS) {
      const weight = weights[axis] ?? 0;
      if (weight === 0) continue;
      const weightedDiff = (a.country.scores[axis] - b.country.scores[axis]) * weight;
      if (weightedDiff > aBestDiff) {
        aBestDiff = weightedDiff;
        aBestAxis = axis;
      }
      if (-weightedDiff > bBestDiff) {
        bBestDiff = -weightedDiff;
        bBestAxis = axis;
      }
    }

    if (aBestAxis && bBestAxis) {
      explanations.push(
        `${a.country.nameJa}と${b.country.nameJa}は総合スコアが僅差です。${AXIS_LABELS[bBestAxis]}では${b.country.nameJa}が、${AXIS_LABELS[aBestAxis]}では${a.country.nameJa}がそれぞれ優位です。`
      );
    }
  }

  return explanations;
}

export function runDiagnosis(input: DiagnosisInput): DiagnosisResult {
  const segment = getSegmentById(input.segment);

  const excludedByHardFilter: { country: Country; reason: string }[] = [];
  const candidateCountries = countries.filter((country) => {
    const reason = hardFilterReason(input, country);
    if (reason) {
      excludedByHardFilter.push({ country, reason });
      return false;
    }
    return true;
  });

  const candidates: CountryResult[] = candidateCountries.map((country) => {
    const axisBreakdown = AXIS_KEYS.map((axis) => ({
      axis,
      weighted: country.scores[axis] * (segment.weights[axis] ?? 0),
    }));
    const score = axisBreakdown.reduce((sum, a) => sum + a.weighted, 0);
    return {
      country,
      score,
      matchPercent: Math.round((score / 5) * 1000) / 10,
      axisBreakdown,
    };
  });

  candidates.sort((a, b) => b.score - a.score);
  const top3 = candidates.slice(0, 3);
  const diffExplanations = buildDiffExplanations(top3, segment.weights);

  return { candidates, top3, excludedByHardFilter, diffExplanations };
}
