import type { Asset, StoryboardAsset } from "@/types/asset";
import { Badge } from "@/components/ui/Badge";
import { AffiliateList, BusinessQuestions, ModalSection, RelatedAssetRow } from "../parts";

export function StoryboardDetails({
  asset,
  byId,
  onOpen,
}: {
  asset: StoryboardAsset;
  byId: Record<string, Asset>;
  onOpen: (id: string) => void;
}) {
  return (
    <>
      <BusinessQuestions questions={asset.businessQuestions} />

      <ModalSection title="KPIs and filters">
        <ul className="grid gap-2">
          {asset.coupledKpis.map(({ kpiId, filters }) => {
            const kpi = byId[kpiId];
            if (!kpi) return null;
            return (
              <RelatedAssetRow
                key={kpiId}
                asset={kpi}
                onOpen={onOpen}
                meta={
                  <span className="flex flex-wrap gap-1 pt-0.5">
                    {filters.map((f) => (
                      <Badge key={f} tone="outline">{f}</Badge>
                    ))}
                  </span>
                }
              />
            );
          })}
        </ul>
      </ModalSection>

      <ModalSection title="Applicable affiliates">
        <AffiliateList applicable={asset.affiliates} />
      </ModalSection>
    </>
  );
}
