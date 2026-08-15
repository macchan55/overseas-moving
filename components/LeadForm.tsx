"use client";

import { useState } from "react";
import { SegmentId } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

export function LeadForm({
  segment,
  top1CountryId,
}: {
  segment: SegmentId;
  top1CountryId: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, segment, top1CountryId }),
      });
      if (!res.ok) throw new Error("failed");
      trackEvent({ name: "lead_submit", segment, top1CountryId });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center">
        <p className="font-semibold text-teal-800 mb-1">送信が完了しました</p>
        <p className="text-sm text-teal-700">
          詳しい移住・留学プランについて、提携エージェントよりご案内いたします。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-bold text-slate-900 mb-1">診断結果をメールで受け取る</h3>
      <p className="text-sm text-slate-500 mb-4">
        あわせて、あなたの条件に合う移住・留学の無料相談(提携エージェント)をご案内します。
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-teal-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "送信中…" : "結果を受け取る"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">
          送信に失敗しました。時間をおいて再度お試しください。
        </p>
      )}
      <p className="mt-3 text-xs text-slate-400">
        ※本フォームはMVP版のプレースホルダーです。送信内容は提携先への送客導線として利用されます。
      </p>
    </div>
  );
}
