import type { Asset, LayoutAsset } from "@/types/asset";
import { BusinessQuestions, KpiRow, ModalSection, PreviewCanvas } from "../parts";

// Layout modal: amount of pages (in the stats row), KPIs used and a preview.
// There are no real thumbnails in the mock data, so the preview is a wireframe-style placeholder.
export function LayoutDetails({ asset, kpis }: { asset: LayoutAsset; kpis: Asset[] }) {
  return (
    <>
      <PreviewCanvas>
        <p className="mb-3 text-xs text-slate-500">Preview · {asset.pages} pages</p>
        <div aria-hidden="true" className="grid aspect-[16/9] grid-cols-4 grid-rows-3 gap-2 rounded bg-white p-2 ring-1 ring-slate-200">
          {kpis.slice(0, 4).map((kpi) => (
            <div key={kpi.id} className="flex flex-col justify-center gap-1 rounded bg-slate-100 px-2">
              <div className="h-1.5 w-2/3 rounded bg-slate-300" />
              <div className="h-3 w-1/2 rounded bg-slate-400" />
            </div>
          ))}
          <div className="col-span-4 row-span-2 flex items-end gap-1 rounded bg-slate-100 p-2">
            {[40, 65, 50, 80, 70, 90].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-slate-300" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </PreviewCanvas>

      <BusinessQuestions questions={asset.businessQuestions} />

      <ModalSection title="KPIs used">
        <ul className="grid gap-2 sm:grid-cols-2">
          {kpis.map((kpi) => (
            <KpiRow key={kpi.id} kpi={kpi} />
          ))}
        </ul>
      </ModalSection>
    </>
  );
}
