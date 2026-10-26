import type { Asset, StoryboardAsset } from "@/types/asset";
import { AffiliateList, BusinessQuestions, KpiRow, ModalSection } from "../parts";

// Storyboard modal: coupled KPIs/filters and applicable affiliates.
// "Request access" lives in the modal footer, since any asset type can be locked.
export function StoryboardDetails({ asset, assets }: { asset: StoryboardAsset; assets: Asset[] }) {
  return (
    <>
      <BusinessQuestions questions={asset.businessQuestions} />

      <ModalSection title="KPIs and filters">
        <ul className="grid gap-2">
          {asset.coupledKpis.map(({ kpiId, filters }) => {
            const kpi = assets.find((a) => a.id === kpiId);
            return kpi ? <KpiRow key={kpiId} kpi={kpi} meta={`Filters: ${filters.join(", ")}`} /> : null;
          })}
        </ul>
      </ModalSection>

      <ModalSection title="Applicable affiliates">
        <AffiliateList affiliates={asset.affiliates} />
      </ModalSection>
    </>
  );
}
