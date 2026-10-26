export type AssetType = "kpi" | "dataviz" | "layout" | "storyboard";

export type BusinessQuestion = {
  title: string;
  description: string;
};

type AssetBase = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  updatedAt: string;
  usageCount: number;
  featured: boolean;
  hasAccess: boolean;
  businessQuestions: BusinessQuestion[];
};

export type KpiAsset = AssetBase & {
  type: "kpi";
  metricIds: string[];
  calculation: string;
  visualsAvailable: string[];
  affiliates: string[];
};

export type DataVizAsset = AssetBase & {
  type: "dataviz";
  chartType: "bar" | "line";
  applicableKpiIds: string[];
  context: string;
  series: { label: string; value: number }[];
  unit: string;
};

export type LayoutAsset = AssetBase & {
  type: "layout";
  pages: number;
  kpiIds: string[];
  layoutType: "Universal" | "Custom";
};

export type StoryboardAsset = AssetBase & {
  type: "storyboard";
  slides: number;
  coupledKpis: { kpiId: string; filters: string[] }[];
  affiliates: string[];
};

export type Asset = KpiAsset | DataVizAsset | LayoutAsset | StoryboardAsset;

export type LibraryTab = "featured" | AssetType;
