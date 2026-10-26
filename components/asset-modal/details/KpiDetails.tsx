import type { KpiAsset } from "@/types/asset";
import { Badge } from "@/components/ui/Badge";
import { AffiliateList, BusinessQuestions, ModalSection } from "../parts";

// KPI modal: business questions, metric IDs, calculation, visuals available, affiliate applicability
export function KpiDetails({ asset }: { asset: KpiAsset }) {
  return (
    <>
      <section className="mt-6 rounded-md bg-slate-50 p-4">
        <h3 className="text-xs font-medium text-slate-500">Calculation</h3>
        <code className="mt-1.5 block whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-slate-900">
          {asset.calculation}
        </code>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500">Metric IDs</span>
          {asset.metricIds.map((id) => (
            <Badge key={id} tone="outline" className="font-mono">
              {id}
            </Badge>
          ))}
        </div>
      </section>

      <BusinessQuestions questions={asset.businessQuestions} />

      <ModalSection title="Visuals available">
        <ul className="flex flex-wrap gap-1.5">
          {asset.visualsAvailable.map((v) => (
            <li key={v}>
              <Badge>{v}</Badge>
            </li>
          ))}
        </ul>
      </ModalSection>

      <ModalSection title="Affiliate applicability">
        <AffiliateList affiliates={asset.affiliates} />
      </ModalSection>
    </>
  );
}
