import { findIncident } from "@/data/incidents";
import type { ReportDetail } from "@/types";

export const reportDetails: ReportDetail[] = [
  {
    incidentSlug: "kyberswap",
    title: "KyberSwap 逻辑漏洞\n漏洞利用分析",
    eyebrow: "事件库 / KyberSwap",
    categoryLabel: "逻辑漏洞",
    chainLabel: "Ethereum",
    timestampLabel: "2023-11-22 10:42:17 UTC",
    statusLabel: "已修复",
    reportStatus: "resolved",
    summary:
      "攻击者利用 KyberSwap Elastic Pool 中 minOut 校验缺失的逻辑漏洞，通过操纵价格池并结合闪电贷绕过最小输出保护，执行大规模低价兑换，造成约 $46.7M 损失。",
    statStrip: [
      { label: "损失金额 (USD)", value: "$46,700,000", accent: "red" },
      { label: "链", value: "◆ Ethereum" },
      { label: "攻击日期", value: "2023-11-22\n10:42:17 UTC" },
      { label: "资金状态", value: "已部分冻结", accent: "green" },
      { label: "攻击类型", value: "逻辑漏洞", accent: "blue" }
    ],
    evidenceStats: [
      { label: "损失金额 (USD)", value: "$46,700,000", accent: "red" },
      { label: "资金状态", value: "已部分冻结", accent: "green" },
      { label: "攻击交易", value: "0x1b3f...9a7e2", accent: "blue" },
      { label: "攻击者地址", value: "0xDACA...c9f2B", accent: "blue" },
      { label: "区块高度", value: "18,560,141" },
      { label: "所在链", value: "◆ Ethereum" }
    ],
    addressItems: [
      { label: "攻击者地址", value: "0xDACA...c9f2B" },
      { label: "攻击合约", value: "0x8f3A...1Dd4F" },
      { label: "受害合约 (Elastic Pool)", value: "0xb63d...7E2d1" }
    ],
    analysisIntro:
      "KyberSwap Elastic Pool 在执行 token 兑换时，未正确校验用户传入的 minOut 参数，导致攻击者可以在极端价格下完成交易而不被阻断。",
    codeExamples: [
      {
        title: "Vulnerable - KyberSwap Elastic Pool.sol",
        languageLabel: "Solidity",
        copyValue: "require(amountOut >= minOut)",
        code: `function trade(
  address srcToken,
  address destToken,
  uint srcAmount,
  uint minOut,
  address payable trader
) external payable returns (uint destAmount) {
  destAmount = tradeCore(srcToken, destToken, srcAmount);
  require(destAmount >= 0, "INSUFFICIENT_OUTPUT_AMOUNT"); // 漏洞点
  transferToTrader(destToken, trader, destAmount);
}`
      },
      {
        title: "Fixed - KyberSwap Elastic Pool.sol",
        languageLabel: "Solidity",
        copyValue: "require(destAmount >= minOut)",
        code: `function trade(...) external payable returns (uint destAmount) {
  destAmount = tradeCore(srcToken, destToken, srcAmount);
  require(destAmount >= minOut, "INSUFFICIENT_OUTPUT_AMOUNT"); // 修复
  transferToTrader(destToken, trader, destAmount);
}`
      }
    ],
    flowSteps: [
      {
        id: "prepare",
        stepLabel: "1",
        title: "准备阶段",
        description: "攻击者通过闪电贷获得大量资产，准备进行价格操纵。"
      },
      {
        id: "manipulate",
        stepLabel: "2",
        title: "价格操纵",
        description: "在多个流动性池中进行大额交易，拉高/压低目标池价格。"
      },
      {
        id: "swap",
        stepLabel: "3",
        title: "低价兑换",
        description: "利用 minOut 校验缺失，以极低价格兑换目标资产。"
      },
      {
        id: "transfer",
        stepLabel: "4",
        title: "利润转移",
        description: "将兑换获得的资产转移至中间地址，分散资金来源。"
      },
      {
        id: "wash",
        stepLabel: "5",
        title: "资金清洗",
        description: "通过多跳兑换及跨链桥转移资金并分散地址。"
      }
    ],
    relatedIncidents: [
      { name: "Radiant Capital", dateLabel: "2025-10-16", amountLabel: "$50.0M" },
      { name: "Arcadia Finance", dateLabel: "2023-09-15", amountLabel: "$3.5M" },
      { name: "Vesta Finance", dateLabel: "2023-07-08", amountLabel: "$8.2M" },
      { name: "Rho Markets", dateLabel: "2023-05-25", amountLabel: "$7.6M" }
    ],
    externalLinks: [
      { label: "Etherscan 攻击交易", href: "#" },
      { label: "Tenderly 执行追踪", href: "#" },
      { label: "Phalcon BlockSec 报告", href: "#" },
      { label: "TxRay 原始数据", href: "#" }
    ],
    agentRun: {
      id: "agent-kyberswap",
      model: "vigil-agent-v1",
      objective: "重建攻击路径、提取 PoC 关键步骤并整理根因摘要",
      startedAt: "2023-11-22T10:48:11.000Z",
      completedAt: "2023-11-22T11:27:55.000Z",
      status: "completed",
      toolCalls: [
        {
          id: "trace-1",
          toolName: "trace_transaction",
          summary: "拉取攻击交易执行跟踪",
          status: "completed"
        },
        {
          id: "state-1",
          toolName: "diff_storage",
          summary: "比对交易前后池子关键状态",
          status: "completed"
        },
        {
          id: "poc-1",
          toolName: "generate_poc",
          summary: "生成可复现攻击 PoC",
          status: "completed"
        }
      ]
    }
  }
];

export function getReportDetail(slugOrId: string): ReportDetail {
  const matched =
    reportDetails.find((detail) => detail.incidentSlug === slugOrId) ??
    reportDetails[0];

  const incident = findIncident(slugOrId);
  if (!incident) {
    return matched;
  }

  if (matched.incidentSlug === slugOrId) {
    return matched;
  }

  return {
    ...matched,
    incidentSlug: incident.slug,
    title: `${incident.protocol} 事件分析`,
    eyebrow: `事件库 / ${incident.protocol}`,
    categoryLabel: incident.attackTypeLabel,
    chainLabel: incident.chainLabel,
    timestampLabel: `${incident.incidentTimeLabel} UTC`,
    statusLabel: incident.reportStatusLabel,
    reportStatus: incident.reportStatus,
    summary: `${incident.protocol} 在 ${incident.incidentTimeLabel} 被标记为${incident.attackTypeLabel}事件。当前页面沿用 Vigil 的标准分析模板，展示损失、关键地址、PoC 片段与攻击流程。`,
    statStrip: [
      {
        label: "损失金额 (USD)",
        value: incident.usdLossLabel,
        accent: incident.usdLossValue !== null ? "red" : "default"
      },
      { label: "链", value: incident.chainLabel },
      { label: "攻击日期", value: `${incident.incidentTimeLabel}\nUTC` },
      { label: "资金状态", value: incident.reportStatusLabel, accent: "green" },
      { label: "攻击类型", value: incident.attackTypeLabel, accent: "blue" }
    ],
    evidenceStats: [
      {
        label: "损失金额 (USD)",
        value: incident.usdLossLabel,
        accent: incident.usdLossValue !== null ? "red" : "default"
      },
      { label: "资金状态", value: incident.reportStatusLabel, accent: "green" },
      { label: "攻击交易", value: `${incident.id.slice(0, 6)}...${incident.id.slice(-5)}`, accent: "blue" },
      { label: "攻击者地址", value: "0xDACA...c9f2B", accent: "blue" },
      { label: "区块高度", value: "18,560,141" },
      { label: "所在链", value: `◆ ${incident.chainLabel}` }
    ]
  };
}
