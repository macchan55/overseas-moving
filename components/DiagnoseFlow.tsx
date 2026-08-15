"use client";

import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionField } from "@/components/QuestionField";
import { ResultView } from "@/components/ResultView";
import { travelTypeOptions, step2Questions, step3Questions } from "@/data/questions";
import { segments } from "@/data/segments";
import { runDiagnosis } from "@/lib/scoring";
import { trackEvent } from "@/lib/analytics";
import { AnswerMap, AnswerValue, DiagnosisResult, SegmentId, TravelType } from "@/lib/types";

type Screen =
  | { kind: "travel" }
  | { kind: "segment" }
  | { kind: "question"; section: "step2" | "step3"; questionId: string };

export function DiagnoseFlow() {
  const [travelType, setTravelType] = useState<TravelType | null>(null);
  const [segment, setSegment] = useState<SegmentId | null>(null);
  const [step2Answers, setStep2Answers] = useState<AnswerMap>({});
  const [step3Answers, setStep3Answers] = useState<AnswerMap>({});
  const [screenIndex, setScreenIndex] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const screens: Screen[] = useMemo(() => {
    const s2 = segment ? step2Questions[segment] : [];
    return [
      { kind: "travel" },
      { kind: "segment" },
      ...s2.map((q) => ({ kind: "question", section: "step2", questionId: q.id }) as const),
      ...step3Questions.map(
        (q) => ({ kind: "question", section: "step3", questionId: q.id }) as const
      ),
    ];
  }, [segment]);

  const currentScreen = result ? null : screens[screenIndex];

  useEffect(() => {
    if (screenIndex === 0 && !result) trackEvent({ name: "diagnose_start" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentScreen) return;
    const label =
      currentScreen.kind === "travel"
        ? "step0"
        : currentScreen.kind === "segment"
          ? "step1"
          : `${currentScreen.section}:${currentScreen.questionId}`;
    trackEvent({ name: "step_view", step: label });
  }, [currentScreen]);

  function handleBack() {
    setScreenIndex((i) => Math.max(0, i - 1));
  }

  function handleTravelSelect(v: TravelType) {
    setTravelType(v);
    setScreenIndex(1);
  }

  function handleSegmentSelect(v: SegmentId) {
    if (v !== segment) setStep2Answers({});
    setSegment(v);
    setScreenIndex(2);
  }

  function handleQuestionAnswer(section: "step2" | "step3", id: string, value: AnswerValue) {
    const nextStep2 = section === "step2" ? { ...step2Answers, [id]: value } : step2Answers;
    const nextStep3 = section === "step3" ? { ...step3Answers, [id]: value } : step3Answers;
    if (section === "step2") setStep2Answers(nextStep2);
    else setStep3Answers(nextStep3);

    const next = screenIndex + 1;
    if (next >= screens.length) {
      if (!travelType || !segment) return;
      const diagnosisResult = runDiagnosis({
        travelType,
        segment,
        step2Answers: nextStep2,
        step3Answers: nextStep3,
      });
      setResult(diagnosisResult);
      trackEvent({ name: "diagnose_complete", segment });
    } else {
      setScreenIndex(next);
    }
  }

  function handleRestart() {
    setTravelType(null);
    setSegment(null);
    setStep2Answers({});
    setStep3Answers({});
    setScreenIndex(0);
    setResult(null);
    trackEvent({ name: "diagnose_start" });
  }

  if (result && segment) {
    return <ResultView result={result} segment={segment} onRestart={handleRestart} />;
  }

  if (!currentScreen) return null;

  const sectionLabel =
    currentScreen.kind === "travel"
      ? "Step0: 渡航形態"
      : currentScreen.kind === "segment"
        ? "Step1: 目的"
        : currentScreen.section === "step2"
          ? "Step2: 詳しい条件"
          : "Step3: 共通の条件";

  return (
    <div>
      <ProgressBar current={screenIndex + 1} total={screens.length} sectionLabel={sectionLabel} />

      {screenIndex > 0 && (
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 text-sm text-slate-400 hover:text-slate-600"
        >
          ← 戻る
        </button>
      )}

      {currentScreen.kind === "travel" && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">渡航形態を教えてください</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {travelTypeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleTravelSelect(opt.value)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-left font-medium text-slate-800 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentScreen.kind === "segment" && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            海外に出る目的を教えてください
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {segments.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSegmentSelect(s.id)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-left hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                <span className="block font-medium text-slate-800">{s.label}</span>
                <span className="block text-xs text-slate-400 mt-0.5">{s.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentScreen.kind === "question" &&
        (() => {
          const pool = currentScreen.section === "step2" ? step2Questions[segment!] : step3Questions;
          const q = pool.find((x) => x.id === currentScreen.questionId);
          if (!q) return null;
          return (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">{q.label}</h2>
              <QuestionField
                question={q}
                onAnswer={(v) => handleQuestionAnswer(currentScreen.section, q.id, v)}
              />
            </div>
          );
        })()}

    </div>
  );
}
