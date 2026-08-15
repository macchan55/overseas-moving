// 簡易イベント計測スタブ — 要件定義書 8章「分析」
// MVPでは外部analytics基盤を持たないため、コンソール出力 + window.dataLayer への
// pushのみ行う。将来GA4等を導入する際はここを差し替えるだけでよい構成にしている。

export type AnalyticsEvent =
  | { name: "diagnose_start" }
  | { name: "step_view"; step: string }
  | { name: "step_abandon"; step: string }
  | { name: "diagnose_complete"; segment: string }
  | { name: "lead_submit"; segment: string; top1CountryId: string }
  | { name: "country_detail_view"; countryId: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: event.name, ...event });
  }
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event);
  }
}
