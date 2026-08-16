import { QuestionDef, SegmentId, TravelType } from "@/lib/types";

// Step0: 渡航形態 — 要件定義書 2.1
export const travelTypeOptions: { value: TravelType; label: string }[] = [
  { value: "solo", label: "単身" },
  { value: "mother_child", label: "母子留学" },
  { value: "family", label: "家族帯同" },
  { value: "child_only", label: "子どものみ留学" },
];

// Step2: 目的別深掘り質問 — 要件定義書 3.2
export const step2Questions: Record<SegmentId, QuestionDef[]> = {
  education_migration: [
    {
      id: "edu_age",
      label: "お子様の年齢・学年は?",
      type: "single",
      options: [
        { value: "preschool", label: "未就学" },
        { value: "elementary", label: "小学生" },
        { value: "junior_high", label: "中学生" },
        { value: "high_school", label: "高校生" },
      ],
    },
    {
      id: "edu_type",
      label: "現地校/インターナショナルスクール/日本人学校のどれを希望しますか?",
      type: "single",
      options: [
        { value: "local_school", label: "現地校" },
        { value: "international_school", label: "インターナショナルスクール" },
        { value: "japanese_school", label: "日本人学校" },
      ],
    },
    {
      id: "edu_future",
      label: "将来の進学先イメージは?",
      type: "single",
      options: [
        { value: "overseas_univ", label: "海外大学" },
        { value: "japan_univ", label: "日本の大学" },
        { value: "undecided", label: "未定" },
      ],
    },
    {
      id: "edu_budget",
      label: "教育費予算(年間)はどのくらいですか?",
      type: "single",
      options: [
        { value: "under_1m", label: "100万円未満" },
        { value: "1_2m", label: "100万〜200万円" },
        { value: "2_4m", label: "200万〜400万円" },
        { value: "4_8m", label: "400万〜800万円" },
        { value: "over_8m", label: "800万円以上" },
      ],
    },
    {
      id: "edu_spouse",
      label: "配偶者の帯同はありますか?",
      type: "single",
      options: [
        { value: "yes", label: "帯同あり" },
        { value: "no", label: "帯同なし" },
        { value: "considering", label: "検討中" },
      ],
    },
    {
      id: "edu_lang",
      label: "英語以外の言語習得も検討しますか?",
      type: "yesno",
    },
  ],
  wealthy_migration: [
    {
      id: "wealth_assets",
      label: "想定される資産規模はどのくらいですか?",
      type: "single",
      options: [
        { value: "under_30m", label: "3,000万円未満" },
        { value: "30_100m", label: "3,000万〜1億円" },
        { value: "100_300m", label: "1億〜3億円" },
        { value: "300_1000m", label: "3億〜10億円" },
        { value: "over_1000m", label: "10億円以上" },
      ],
    },
    {
      id: "wealth_tax_priority",
      label: "税制メリットの優先度はどのくらいですか?",
      type: "scale5",
    },
    {
      id: "wealth_second_passport",
      label: "セカンドパスポートの取得は必要ですか?",
      type: "yesno",
    },
    {
      id: "wealth_offshore",
      label: "オフショア活用への抵抗感はどのくらいですか?",
      type: "scale5",
    },
    {
      id: "wealth_realestate",
      label: "現地不動産投資に関心はありますか?",
      type: "yesno",
    },
  ],
  working_holiday: [
    {
      id: "wh_age",
      label: "現在の年齢を入力してください",
      type: "number",
      min: 18,
      max: 45,
      placeholder: "例: 27",
    },
    {
      id: "wh_english",
      label: "現在の英語力は?",
      type: "single",
      options: [
        { value: "beginner", label: "初級" },
        { value: "intermediate", label: "中級" },
        { value: "advanced", label: "上級" },
      ],
    },
    {
      id: "wh_focus",
      label: "就労重視・生活体験重視のどちらですか?",
      type: "single",
      options: [
        { value: "work", label: "就労重視" },
        { value: "experience", label: "生活体験重視" },
      ],
    },
    {
      id: "wh_savings",
      label: "渡航前の貯蓄額はどのくらいですか?",
      type: "single",
      options: [
        { value: "under_500k", label: "50万円未満" },
        { value: "500k_1m", label: "50万〜100万円" },
        { value: "1_2m", label: "100万〜200万円" },
        { value: "over_2m", label: "200万円以上" },
      ],
    },
  ],
  overseas_job: [
    {
      id: "job_field",
      label: "職種・スキル領域は?",
      type: "single",
      options: [
        { value: "it", label: "IT" },
        { value: "finance", label: "金融" },
        { value: "medical", label: "医療" },
        { value: "construction", label: "建設" },
        { value: "other", label: "その他" },
      ],
    },
    {
      id: "job_income_current",
      label: "現在の年収は?",
      type: "single",
      options: [
        { value: "under_4m", label: "400万円未満" },
        { value: "4_6m", label: "400万〜600万円" },
        { value: "6_10m", label: "600万〜1,000万円" },
        { value: "over_10m", label: "1,000万円以上" },
      ],
    },
    {
      id: "job_income_target",
      label: "希望年収は?",
      type: "single",
      options: [
        { value: "under_4m", label: "400万円未満" },
        { value: "4_6m", label: "400万〜600万円" },
        { value: "6_10m", label: "600万〜1,000万円" },
        { value: "over_10m", label: "1,000万円以上" },
      ],
    },
    {
      id: "job_offer",
      label: "就労ビザ取得の見込み(オファーの有無)は?",
      type: "single",
      options: [
        { value: "yes", label: "オファーあり" },
        { value: "no", label: "オファーなし" },
        { value: "considering", label: "検討中" },
      ],
    },
  ],
  language_study: [
    {
      id: "lang_current_level",
      label: "現在の英語力の目安は?",
      type: "single",
      options: [
        { value: "beginner", label: "初級" },
        { value: "intermediate", label: "中級" },
        { value: "advanced", label: "上級" },
      ],
    },
    {
      id: "lang_duration",
      label: "留学期間はどのくらいを想定していますか?",
      type: "single",
      options: [
        { value: "under_1m", label: "1ヶ月未満" },
        { value: "1_3m", label: "1〜3ヶ月" },
        { value: "3_6m", label: "3〜6ヶ月" },
        { value: "over_6m", label: "6ヶ月以上" },
      ],
    },
    {
      id: "lang_priority",
      label: "費用重視・英語環境の質重視のどちらですか?",
      type: "single",
      options: [
        { value: "cost", label: "費用重視" },
        { value: "quality", label: "英語環境の質重視" },
      ],
    },
  ],
  early_retirement: [
    {
      id: "retire_age",
      label: "年齢層を教えてください",
      type: "single",
      options: [
        { value: "50s", label: "50代" },
        { value: "60s", label: "60代" },
        { value: "70s_plus", label: "70代以上" },
      ],
    },
    {
      id: "retire_medical",
      label: "医療水準の重視度はどのくらいですか?",
      type: "scale5",
    },
    {
      id: "retire_climate",
      label: "気候の好みは?",
      type: "single",
      options: [
        { value: "warm", label: "温暖" },
        { value: "four_seasons", label: "四季がある" },
        { value: "dry", label: "乾燥" },
      ],
    },
  ],
  entrepreneur: [
    {
      id: "biz_industry",
      label: "事業領域は?",
      type: "single",
      options: [
        { value: "it", label: "IT" },
        { value: "restaurant", label: "飲食" },
        { value: "trade", label: "貿易" },
        { value: "other", label: "その他" },
      ],
    },
    {
      id: "biz_capital",
      label: "起業資金規模はどのくらいですか?",
      type: "single",
      options: [
        { value: "under_3m", label: "300万円未満" },
        { value: "3_10m", label: "300万〜1,000万円" },
        { value: "10_30m", label: "1,000万〜3,000万円" },
        { value: "30_100m", label: "3,000万〜1億円" },
        { value: "over_100m", label: "1億円以上" },
      ],
    },
    {
      id: "biz_remote",
      label: "リモートでの事業運営は可能ですか?",
      type: "yesno",
    },
  ],
};

// Step3: 共通制約条件(全セグメント共通) — 要件定義書 3.3
export const step3Questions: QuestionDef[] = [
  {
    id: "common_english",
    label: "英語力(現状)は?",
    type: "single",
    options: [
      { value: "beginner", label: "初級" },
      { value: "intermediate", label: "中級" },
      { value: "advanced", label: "上級" },
    ],
  },
  {
    id: "common_climate",
    label: "気候の好みは?",
    type: "single",
    options: [
      { value: "warm", label: "温暖" },
      { value: "four_seasons", label: "四季がある" },
      { value: "cold", label: "寒冷" },
      { value: "dry", label: "乾燥" },
    ],
  },
  {
    id: "common_safety",
    label: "治安への感度は?",
    type: "single",
    options: [
      { value: "high", label: "高い(最重視したい)" },
      { value: "medium", label: "中程度" },
      { value: "low", label: "低い(あまり気にしない)" },
    ],
  },
  {
    id: "common_duration",
    label: "滞在期間のイメージは?",
    type: "single",
    options: [
      { value: "under_1y", label: "1年未満" },
      { value: "1_3y", label: "1〜3年" },
      { value: "4_10y", label: "4〜10年" },
      { value: "permanent", label: "永住志向" },
    ],
  },
];
