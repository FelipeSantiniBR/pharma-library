import type { Asset, DataVizAsset } from "@/types/asset";
import { InteractiveChart } from "../InteractiveChart";
import { BusinessQuestions, ModalSection, PreviewCanvas, RelatedAssetRow } from "../parts";

export function DataVizDetails({
  asset,
  related,
  onOpen,
}: {
  asset: DataVizAsset;
  related: Asset[];
  onOpen: (id: string) => void;
}) {
  return (
    <>
      <PreviewCanvas label={`${asset.name} preview`}>
        <InteractiveChart series={asset.series} unit={asset.unit} defaultType={asset.chartType} title={asset.name} />
      </PreviewCanvas>

      <ModalSection title="About this data">
        <p className="text-xs leading-5 text-slate-600">{asset.context}</p>
      </ModalSection>

      <ModalSection title="Applicable KPIs">
        <p className="mb-2 text-xs text-slate-500">Save the KPIs you want to track with this chart.</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {related.map((kpi) => (
            <RelatedAssetRow key={kpi.id} asset={kpi} onOpen={onOpen} showFavorite meta={kpi.subtitle} />
          ))}
        </ul>
      </ModalSection>

      <BusinessQuestions questions={asset.businessQuestions} />
    </>
  );
}
