import { AXIS_KEYS, AXIS_LABELS, AxisKey, Country, Segment } from "@/lib/types";

const STRONG_SCORE_THRESHOLD = 4;

/**
 * セグメントの重みが高い評価軸を優先度順に返す。
 * スコアリング(lib/scoring.ts)が実際に使う重みそのものから導出するため、
 * 「あなたが求めていること」の文言と診断結果が矛盾しない。
 */
export function getPriorityAxes(segment: Segment, count = 3): AxisKey[] {
  return AXIS_KEYS.filter((axis) => (segment.weights[axis] ?? 0) > 0)
    .sort((a, b) => segment.weights[b] - segment.weights[a])
    .slice(0, count);
}

export interface RecommendationSummary {
  priorityAxes: AxisKey[];
  priorityLabels: string[];
  strengthLabels: string[];
}

export function buildRecommendationSummary(
  segment: Segment,
  topCountry: Country
): RecommendationSummary {
  const priorityAxes = getPriorityAxes(segment);
  const priorityLabels = priorityAxes.map((axis) => AXIS_LABELS[axis]);
  const strengthLabels = priorityAxes
    .filter((axis) => topCountry.scores[axis] >= STRONG_SCORE_THRESHOLD)
    .map((axis) => AXIS_LABELS[axis]);
  return { priorityAxes, priorityLabels, strengthLabels };
}
