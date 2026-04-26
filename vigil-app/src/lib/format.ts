import type {
  AttackType,
  Chain,
  Incident,
  ReportStatus,
  Severity
} from "@/types";

export function formatUtcLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC"
  })
    .format(date)
    .replace(/\//g, "-");
}

export function parseUsdLabel(value: string): number | null {
  const normalized = value.replace("$$", "$").trim().toUpperCase();
  if (normalized === "-" || normalized === "UNKNOWN") {
    return null;
  }

  const compact = normalized.replace(/\$/g, "").replace(/,/g, "");
  const suffix = compact.slice(-1);
  const base = Number.parseFloat(
    suffix === "K" || suffix === "M" || suffix === "B"
      ? compact.slice(0, -1)
      : compact
  );

  if (Number.isNaN(base)) {
    return null;
  }

  const multiplier =
    suffix === "K" ? 1_000 : suffix === "M" ? 1_000_000 : suffix === "B" ? 1_000_000_000 : 1;

  return base * multiplier;
}

export function inferSeverity(loss: number | null): Severity {
  if (loss === null) {
    return "medium";
  }
  if (loss >= 100_000_000) {
    return "critical";
  }
  if (loss >= 10_000_000) {
    return "high";
  }
  if (loss >= 1_000_000) {
    return "medium";
  }
  return "low";
}

export function inferReportStatus(verified: boolean): ReportStatus {
  return verified ? "verified" : "investigating";
}

export function getReportStatusLabel(status: ReportStatus): string {
  switch (status) {
    case "verified":
      return "已确认";
    case "investigating":
      return "调查中";
    case "resolved":
      return "已修复";
    case "partial-freeze":
      return "已部分冻结";
    case "pending":
      return "待确认";
    default:
      return "待确认";
  }
}

export function getAttackTypeLabel(type: AttackType): string {
  switch (type) {
    case "reentrancy":
      return "重入攻击";
    case "oracle-manipulation":
      return "预言机操纵";
    case "logic-flaw":
      return "逻辑漏洞";
    case "governance-attack":
      return "治理攻击";
    case "access-control":
      return "访问控制";
    case "mev":
      return "MEV";
    default:
      return "逻辑漏洞";
  }
}

export function getChainLabel(chain: Chain): string {
  switch (chain) {
    case "ethereum":
      return "Ethereum";
    case "arbitrum":
      return "Arbitrum";
    case "bnb-chain":
      return "BNB Chain";
    case "polygon":
      return "Polygon";
    case "optimism":
      return "Optimism";
    case "base":
      return "Base";
    case "avalanche":
      return "Avalanche";
    case "unknown":
      return "Unknown";
    default:
      return "Unknown";
  }
}

export function buildSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSeverityColor(
  attackType: AttackType
): Incident["severityColor"] {
  switch (attackType) {
    case "reentrancy":
      return "red";
    case "oracle-manipulation":
      return "orange";
    case "logic-flaw":
      return "blue";
    case "governance-attack":
      return "purple";
    case "access-control":
      return "green";
    case "mev":
      return "blue";
    default:
      return "blue";
  }
}
