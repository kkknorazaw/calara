import rawIncidents from "./incidents.raw.json";
import {
  buildSlug,
  formatUtcLabel,
  getAttackTypeLabel,
  getChainLabel,
  getReportStatusLabel,
  getSeverityColor,
  inferReportStatus,
  inferSeverity,
  parseUsdLabel
} from "@/lib/format";
import type {
  BubbleLegendItem,
  BubblePoint,
  HeroFeature,
  ImpactOverview,
  Incident
} from "@/types";

interface RawIncidentRecord {
  id: string;
  title: string;
  incident_time: string;
  usd_loss_label: string;
  usd_loss_caption: string;
  classification: "ATTACK" | "NON_ATTACK_MEV";
  verified: boolean;
  url: string;
}

const rawRecords = rawIncidents as RawIncidentRecord[];

function createIncident(
  overrides: Partial<Incident> &
    Pick<
      Incident,
      | "id"
      | "slug"
      | "title"
      | "protocol"
      | "chain"
      | "incidentTime"
      | "usdLossLabel"
      | "usdLossCaption"
      | "classification"
      | "attackType"
      | "accessible"
    >
): Incident {
  const usdLossValue = overrides.usdLossValue ?? parseUsdLabel(overrides.usdLossLabel);
  const reportStatus = overrides.reportStatus ?? inferReportStatus(overrides.verified ?? true);

  return {
    chainLabel: overrides.chainLabel ?? getChainLabel(overrides.chain),
    incidentTimeLabel:
      overrides.incidentTimeLabel ?? formatUtcLabel(overrides.incidentTime),
    usdLossValue,
    attackTypeLabel:
      overrides.attackTypeLabel ?? getAttackTypeLabel(overrides.attackType),
    severity: overrides.severity ?? inferSeverity(usdLossValue),
    severityColor:
      overrides.severityColor ?? getSeverityColor(overrides.attackType),
    reportStatus,
    reportStatusLabel:
      overrides.reportStatusLabel ?? getReportStatusLabel(reportStatus),
    verified: overrides.verified ?? true,
    href:
      overrides.href ??
      (overrides.accessible ? `/incidents/${overrides.slug}` : "/pricing"),
    ...overrides
  };
}

export const heroFeatures: HeroFeature[] = [
  {
    iconKey: "search",
    title: "根本原因",
    description: "深入的根本原因分析和执行追踪，定位漏洞的真实来源。"
  },
  {
    iconKey: "code",
    title: "PoC 验证",
    description: "可复现的 PoC 和利用路径，帮助验证和修复漏洞。"
  },
  {
    iconKey: "network",
    title: "去中心化情报",
    description: "由安全研究员和协议团队贡献的全球威胁情报网络。"
  }
];

export const impactOverview: ImpactOverview = {
  totalLossLabel: "$2.87B",
  deltaLabel: "↑ 本月新增 12",
  summaryLabel: "已知攻击总损失（美元）",
  metrics: [
    { label: "起事件", value: "572" },
    { label: "条线索", value: "336" },
    { label: "条链", value: "40" }
  ],
  footnotes: ["统计范围：过去 90 天", "数据每 10 分钟更新"]
};

export const bubbleLegend: BubbleLegendItem[] = [
  { colorToken: "red", label: "重入攻击" },
  { colorToken: "orange", label: "预言机操纵" },
  { colorToken: "blue", label: "逻辑漏洞" },
  { colorToken: "purple", label: "治理攻击" },
  { colorToken: "green", label: "访问控制" }
];

export const bubblePoints: BubblePoint[] = [
  {
    id: "oraclex",
    name: "OracleX",
    amountLabel: "$268.1M",
    attackTypeLabel: "预言机操纵",
    colorClass: "b-orange",
    left: 210,
    top: 106,
    size: 116,
    dateLabel: "2024-05-03"
  },
  {
    id: "deltaprime",
    name: "DeltaPrime",
    amountLabel: "$612.4M",
    attackTypeLabel: "重入攻击",
    colorClass: "b-red",
    left: 350,
    top: 36,
    size: 186,
    dateLabel: "2024-05-12"
  },
  {
    id: "gatekeeper",
    name: "GateKeeper",
    amountLabel: "$94.3M",
    attackTypeLabel: "访问控制",
    colorClass: "b-green",
    left: 325,
    top: 216,
    size: 74,
    fontSize: 12,
    dateLabel: "2024-04-25"
  },
  {
    id: "govvault",
    name: "GovVault",
    amountLabel: "$198.7M",
    attackTypeLabel: "治理攻击",
    colorClass: "b-purple",
    left: 515,
    top: 183,
    size: 112,
    dateLabel: "2024-04-29"
  },
  {
    id: "zenith-lending",
    name: "Zenith Lending",
    amountLabel: "$457.2M",
    attackTypeLabel: "逻辑漏洞",
    colorClass: "b-blue",
    left: 760,
    top: 76,
    size: 148,
    dateLabel: "2024-05-08"
  },
  {
    id: "odos-v3",
    name: "Odos V3",
    amountLabel: "$72.6M",
    attackTypeLabel: "重入攻击",
    colorClass: "b-red",
    left: 925,
    top: 60,
    size: 86,
    fontSize: 13,
    dateLabel: "2024-04-20"
  },
  {
    id: "swapsphere",
    name: "SwapSphere",
    amountLabel: "$63.8M",
    attackTypeLabel: "逻辑漏洞",
    colorClass: "b-blue",
    left: 1010,
    top: 152,
    size: 82,
    fontSize: 12,
    dateLabel: "2024-04-18"
  },
  {
    id: "yieldnest",
    name: "YieldNest",
    amountLabel: "$52.1M",
    attackTypeLabel: "预言机操纵",
    colorClass: "b-orange",
    left: 885,
    top: 232,
    size: 84,
    fontSize: 12,
    dateLabel: "2024-05-11"
  }
];

export const dashboardRows: Incident[] = [
  createIncident({
    id: "delta-prime",
    slug: "delta-prime",
    title: "DeltaPrime / Ethereum",
    protocol: "DeltaPrime",
    chain: "ethereum",
    incidentTime: "2024-05-12T08:41:22.000Z",
    usdLossLabel: "$612,400,000",
    usdLossCaption: "Confident estimate",
    classification: "ATTACK",
    attackType: "reentrancy",
    accessible: true
  }),
  createIncident({
    id: "zenith-lending",
    slug: "zenith-lending",
    title: "Zenith Lending / Arbitrum",
    protocol: "Zenith Lending",
    chain: "arbitrum",
    incidentTime: "2024-05-08T14:32:11.000Z",
    usdLossLabel: "$457,200,000",
    usdLossCaption: "Confident estimate",
    classification: "ATTACK",
    attackType: "logic-flaw",
    accessible: true
  }),
  createIncident({
    id: "oraclex",
    slug: "oraclex",
    title: "OracleX / BNB Chain",
    protocol: "OracleX",
    chain: "bnb-chain",
    incidentTime: "2024-05-03T03:19:44.000Z",
    usdLossLabel: "$268,100,000",
    usdLossCaption: "Confident estimate",
    classification: "ATTACK",
    attackType: "oracle-manipulation",
    accessible: true
  }),
  createIncident({
    id: "govvault",
    slug: "govvault",
    title: "GovVault / Polygon",
    protocol: "GovVault",
    chain: "polygon",
    incidentTime: "2024-04-29T19:05:33.000Z",
    usdLossLabel: "$198,700,000",
    usdLossCaption: "Confident estimate",
    classification: "ATTACK",
    attackType: "governance-attack",
    accessible: true
  }),
  createIncident({
    id: "gatekeeper",
    slug: "gatekeeper",
    title: "GateKeeper / Optimism",
    protocol: "GateKeeper",
    chain: "optimism",
    incidentTime: "2024-04-25T11:23:07.000Z",
    usdLossLabel: "$94,300,000",
    usdLossCaption: "Confident estimate",
    classification: "ATTACK",
    attackType: "access-control",
    accessible: true
  }),
  createIncident({
    id: "odos-v3",
    slug: "odos-v3",
    title: "Odos V3 / Ethereum",
    protocol: "Odos V3",
    chain: "ethereum",
    incidentTime: "2024-04-20T06:17:50.000Z",
    usdLossLabel: "$72,600,000",
    usdLossCaption: "Confident estimate",
    classification: "ATTACK",
    attackType: "logic-flaw",
    accessible: true
  }),
  createIncident({
    id: "swapsphere",
    slug: "swapsphere",
    title: "SwapSphere / Arbitrum",
    protocol: "SwapSphere",
    chain: "arbitrum",
    incidentTime: "2024-04-18T21:45:12.000Z",
    usdLossLabel: "$63,800,000",
    usdLossCaption: "Confident estimate",
    classification: "ATTACK",
    attackType: "oracle-manipulation",
    accessible: true
  }),
  createIncident({
    id: "stealthswap",
    slug: "stealthswap",
    title: "StealthSwap / Base",
    protocol: "StealthSwap",
    chain: "base",
    incidentTime: "2024-05-13T02:17:08.000Z",
    usdLossLabel: "$31,400,000",
    usdLossCaption: "Investigation in progress",
    classification: "ATTACK",
    attackType: "access-control",
    accessible: false,
    verified: false,
    reportStatus: "investigating"
  }),
  createIncident({
    id: "vector-protocol",
    slug: "vector-protocol",
    title: "Vector Protocol / Avalanche",
    protocol: "Vector Protocol",
    chain: "avalanche",
    incidentTime: "2024-05-12T23:59:41.000Z",
    usdLossLabel: "$27,900,000",
    usdLossCaption: "Investigation in progress",
    classification: "ATTACK",
    attackType: "logic-flaw",
    accessible: false,
    verified: false,
    reportStatus: "investigating"
  })
];

export const tableUpdatedLabel = "2024-05-13 09:15:32 UTC";

export const incidentDirectory: Incident[] = [
  ...dashboardRows,
  ...rawRecords
    .filter((record) => !dashboardRows.some((item) => item.id === record.id))
    .map((record) => {
      const attackType =
        record.classification === "NON_ATTACK_MEV" ? "mev" : "logic-flaw";
      const slug = buildSlug(record.title || record.id);

      return createIncident({
        id: record.id,
        slug,
        title: record.title,
        protocol: record.title,
        chain: "unknown",
        incidentTime: record.incident_time,
        usdLossLabel: record.usd_loss_label.replace("$$", "$$".replace("$$", "$")).replace("$$", "$") ,
        usdLossCaption: record.usd_loss_caption,
        classification: record.classification,
        attackType,
        verified: record.verified,
        accessible: true
      });
    })
];

export function findIncident(identifier: string): Incident | undefined {
  return incidentDirectory.find(
    (incident) => incident.slug === identifier || incident.id === identifier
  );
}
