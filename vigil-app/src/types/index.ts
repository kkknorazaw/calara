export type AttackType =
  | "reentrancy"
  | "oracle-manipulation"
  | "logic-flaw"
  | "governance-attack"
  | "access-control"
  | "mev";

export type Severity = "critical" | "high" | "medium" | "low";

export type Chain =
  | "ethereum"
  | "arbitrum"
  | "bnb-chain"
  | "polygon"
  | "optimism"
  | "base"
  | "avalanche"
  | "unknown";

export type ReportStatus =
  | "verified"
  | "investigating"
  | "resolved"
  | "partial-freeze"
  | "pending";

export type ToolCallStatus = "completed" | "running" | "failed";
export type AgentRunStatus = "completed" | "running" | "failed";

export interface ToolCall {
  id: string;
  toolName: string;
  summary: string;
  status: ToolCallStatus;
  output?: string;
}

export interface AgentRun {
  id: string;
  model: string;
  objective: string;
  startedAt: string;
  completedAt?: string;
  status: AgentRunStatus;
  toolCalls: ToolCall[];
}

export interface Incident {
  id: string;
  slug: string;
  title: string;
  protocol: string;
  chain: Chain;
  chainLabel: string;
  incidentTime: string;
  incidentTimeLabel: string;
  usdLossLabel: string;
  usdLossValue: number | null;
  usdLossCaption: string;
  classification: "ATTACK" | "NON_ATTACK_MEV";
  attackType: AttackType;
  attackTypeLabel: string;
  severity: Severity;
  severityColor: "red" | "blue" | "orange" | "purple" | "green";
  reportStatus: ReportStatus;
  reportStatusLabel: string;
  verified: boolean;
  accessible: boolean;
  href: string;
}

export interface HeroFeature {
  iconKey: "search" | "code" | "network";
  title: string;
  description: string;
}

export interface ImpactOverview {
  totalLossLabel: string;
  deltaLabel: string;
  summaryLabel: string;
  metrics: Array<{ label: string; value: string }>;
  footnotes: [string, string];
}

export interface BubblePoint {
  id: string;
  name: string;
  amountLabel: string;
  attackTypeLabel: string;
  colorClass: "b-red" | "b-blue" | "b-orange" | "b-purple" | "b-green";
  left: number;
  top: number;
  size: number;
  fontSize?: number;
  dateLabel: string;
}

export interface BubbleLegendItem {
  colorToken: "red" | "blue" | "orange" | "purple" | "green";
  label: string;
}

export interface AddressItem {
  label: string;
  value: string;
}

export interface ExternalLinkItem {
  label: string;
  href: string;
}

export interface CodeExample {
  title: string;
  languageLabel: string;
  copyValue: string;
  code: string;
}

export interface TimelineItem {
  id: string;
  stepLabel: string;
  title: string;
  description: string;
}

export interface RelatedIncident {
  name: string;
  dateLabel: string;
  amountLabel: string;
}

export interface ReportStat {
  label: string;
  value: string;
  accent?: "red" | "green" | "blue" | "default";
}

export interface ReportDetail {
  incidentSlug: string;
  title: string;
  eyebrow: string;
  categoryLabel: string;
  chainLabel: string;
  timestampLabel: string;
  statusLabel: string;
  reportStatus: ReportStatus;
  summary: string;
  statStrip: ReportStat[];
  evidenceStats: ReportStat[];
  addressItems: AddressItem[];
  analysisIntro: string;
  codeExamples: CodeExample[];
  flowSteps: TimelineItem[];
  relatedIncidents: RelatedIncident[];
  externalLinks: ExternalLinkItem[];
  agentRun: AgentRun;
}

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  currency: string;
  priceLabel: string;
  billingLabel: string;
  badge?: string;
  badgeTone?: "default" | "gold";
  buttonLabel: string;
  buttonHref: string;
  buttonVariant: "default" | "dark" | "gold";
  accent: "default" | "featured" | "gold";
  planToggle?: {
    monthlyLabel: string;
    yearlyLabel: string;
    savingLabel: string;
  };
  features: Array<{ icon: "check" | "star"; label: string }>;
}

export interface ComparisonRow {
  feature: string;
  free: string;
  pro: string;
  firstClass: string;
}

export interface ResearchMetric {
  id: string;
  value: string;
  unit?: string;
  title: string;
  description: string;
  accent: "blue" | "green" | "orange";
  iconKey: "shield" | "clock" | "code";
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}
