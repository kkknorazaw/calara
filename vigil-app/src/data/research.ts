import type { FaqItem, ResearchMetric } from "@/types";

export const researchMetrics: ResearchMetric[] = [
  {
    id: "reproducibility",
    value: "92.11%",
    title: "可复现率",
    description:
      "在 114 起 ACT 事件中，105 起可通过 TxRay 生成的 PoC 在主网或仿真环境中成功复现。",
    accent: "blue",
    iconKey: "shield"
  },
  {
    id: "median-repro-time",
    value: "40",
    unit: "min",
    title: "复现中位时间",
    description: "从事件确认到生成并成功运行 PoC 的中位时间。",
    accent: "green",
    iconKey: "clock"
  },
  {
    id: "median-poc-time",
    value: "59",
    unit: "min",
    title: "PoC 生成中位延迟",
    description: "从事件确认到生成可执行 PoC 的中位时间。",
    accent: "orange",
    iconKey: "code"
  }
];

export const researchBibtex = `@inproceedings{txray-2025,
  title     = {TxRay: Model-Driven On-Chain Incident Analysis with Executable Proof-of-Concepts},
  author    = {Vigil Research},
  booktitle = {Proceedings of the ACM SIGSAC Conference on Computer and Communications Security (CCS)},
  year      = {2025},
  publisher = {ACM},
  doi       = {10.1145/3700000.3700100},
  url       = {https://doi.org/10.1145/3700000.3700100}
}`;

export const researchFaqItems: FaqItem[] = [
  {
    id: "act",
    question: "1. ACT opportunity 是什么意思？",
    answer:
      "ACT（Abusable Consensus Transaction）opportunity 指在特定链上状态下，攻击者（无特权对手）可通过合法交易序列获取不当收益的机会。我们聚焦无需共识控制、无需私钥泄露、仅依赖公开内存池与可用链上/合约数据的机会。"
  },
  {
    id: "model",
    question: "2. 论文中的系统模型是什么？",
    answer:
      "系统模型把协议、链上状态、外部价格与执行环境拆成可验证假设，报告会明确指出每一步复现依赖的状态和边界。"
  },
  {
    id: "threat-model",
    question: "3. 威胁模型是什么？",
    answer:
      "威胁模型默认攻击者不具备管理员权限，但可以构造交易、组合闪电贷、影响可公开操纵的价格路径，并利用合约逻辑漏洞。"
  },
  {
    id: "mev",
    question: "4. Vigil 也覆盖 MEV 事件吗？",
    answer:
      "覆盖。仪表板把传统攻击、MEV 与混合型事件分层标注，便于研究者区分资金损失、套利与协议风险。"
  },
  {
    id: "artifacts",
    question: "5. Vigil 为每个事件发布哪些 artifacts？",
    answer:
      "包括根因摘要、链上执行追踪、关键地址、交易链接、伪代码或 PoC 片段，以及可复核的修复建议。"
  },
  {
    id: "quality",
    question: "6. TxRay 中质量如何评估？",
    answer:
      "通过复现成功率、生成延迟、人工复核结果与复现环境一致性来评估。"
  }
];
