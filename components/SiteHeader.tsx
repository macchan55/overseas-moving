import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight text-slate-900">
          海外移住・留学診断<span className="text-teal-600">.</span>
        </Link>
        <Link
          href="/diagnose"
          className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          診断を始める
        </Link>
      </div>
    </header>
  );
}
