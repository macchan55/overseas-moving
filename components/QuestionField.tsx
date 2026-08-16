"use client";

import { useState } from "react";
import { AnswerValue, NO_PREFERENCE, QuestionDef } from "@/lib/types";

const NO_PREFERENCE_LABEL = "特にこだわらない(他の条件を優先)";

function NoPreferenceButton({ onAnswer }: { onAnswer: (value: AnswerValue) => void }) {
  return (
    <button
      type="button"
      onClick={() => onAnswer(NO_PREFERENCE)}
      className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-3 text-center text-sm font-medium text-slate-500 hover:border-teal-400 hover:text-teal-700 transition-colors"
    >
      {NO_PREFERENCE_LABEL}
    </button>
  );
}

export function QuestionField({
  question,
  onAnswer,
}: {
  question: QuestionDef;
  onAnswer: (value: AnswerValue) => void;
}) {
  const [numberValue, setNumberValue] = useState("");

  if (question.type === "single" && question.options) {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onAnswer(opt.value)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-left font-medium text-slate-800 hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
        <NoPreferenceButton onAnswer={onAnswer} />
      </div>
    );
  }

  if (question.type === "yesno") {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onAnswer("yes")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-medium text-slate-800 hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            はい
          </button>
          <button
            type="button"
            onClick={() => onAnswer("no")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-medium text-slate-800 hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            いいえ
          </button>
        </div>
        <NoPreferenceButton onAnswer={onAnswer} />
      </div>
    );
  }

  if (question.type === "scale5") {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onAnswer(n)}
              className="aspect-square rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              {n}
            </button>
          ))}
          <div className="col-span-5 flex justify-between text-xs text-slate-400 px-1">
            <span>低い</span>
            <span>高い</span>
          </div>
        </div>
        <NoPreferenceButton onAnswer={onAnswer} />
      </div>
    );
  }

  if (question.type === "number") {
    return (
      <div className="flex flex-col gap-3">
        <form
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(numberValue);
            if (Number.isFinite(n) && numberValue.trim() !== "") onAnswer(n);
          }}
        >
          <input
            type="number"
            inputMode="numeric"
            min={question.min}
            max={question.max}
            placeholder={question.placeholder}
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-5 py-4 text-slate-900 focus:border-teal-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={numberValue.trim() === ""}
            className="rounded-xl bg-teal-600 px-6 py-4 font-semibold text-white hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            次へ
          </button>
        </form>
        <NoPreferenceButton onAnswer={onAnswer} />
      </div>
    );
  }

  return null;
}
