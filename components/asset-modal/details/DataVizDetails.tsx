import type { Asset, DataVizAsset } from "@/types/asset";
import { InteractiveChart } from "../InteractiveChart";
import { BusinessQuestions, KpiRow, ModalSection, PreviewCanvas } from "../parts";

// Data viz modal: interactive chart, info context, applicable KPI favorites
export function DataVizDetails({ asset, kpis }: { asset: DataVizAsset; kpis: Asset[] }) {
  return (
    <>
      <PreviewCanvas>
        <InteractiveChart series={asset.series} unit={asset.unit} type={asset.chartType} title={asset.name} />
      </PreviewCanvas>

      <ModalSection title="About this data">
        <p className="text-xs leading-5 text-slate-600">{asset.context}</p>
      </ModalSection>

      <ModalSection title="Applicable KPIs">
        <p className="mb-2 text-xs text-slate-500">Save the KPIs you want to track with this chart.</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {kpis.map((kpi) => (
            <KpiRow key={kpi.id} kpi={kpi} showFavorite />
          ))}
        </ul>
      </ModalSection>

      <BusinessQuestions questions={asset.businessQuestions} />
    </>
  );
}
