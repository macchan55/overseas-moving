import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DiagnoseFlow } from "@/components/DiagnoseFlow";

export const metadata = {
  title: "診断スタート | 海外移住・留学診断",
};

export default function DiagnosePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="px-4 py-12">
          <DiagnoseFlow />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
