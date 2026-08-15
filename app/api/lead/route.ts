import { NextRequest, NextResponse } from "next/server";

// リード獲得フォームの送信先プレースホルダー — 要件定義書 1.2 / 7章 / 9章
// MVPでは提携先送客フローの詳細(即時表示 or フォーム送信後にメール送付)が未確定のため、
// 受信内容をログ出力するのみのスタブとする。本番導入時はCRM/メール配信基盤への連携に差し替える。
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (
    !body ||
    typeof body.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  ) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  console.log("[lead:submit]", {
    email: body.email,
    segment: body.segment,
    top1CountryId: body.top1CountryId,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
