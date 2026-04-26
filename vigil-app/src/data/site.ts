import type { FooterColumn, TimelineItem } from "@/types";

export const navItems = [
  { label: "仪表板", href: "/" },
  { label: "定价", href: "/pricing" },
  { label: "研究", href: "/research" }
] as const;

export const footerColumns: FooterColumn[] = [
  {
    title: "产品",
    links: [
      { label: "仪表板", href: "/" },
      { label: "事件订阅", href: "/subscribe" },
      { label: "API 文档", href: "#" },
      { label: "集成指南", href: "#" },
      { label: "状态页面", href: "#" }
    ]
  },
  {
    title: "研究",
    links: [
      { label: "研究报告", href: "/research" },
      { label: "漏洞分析", href: "/" },
      { label: "威胁情报", href: "#" },
      { label: "方法论", href: "/research#method" },
      { label: "提交线索", href: "#" }
    ]
  },
  {
    title: "许可",
    links: [
      { label: "条款 of 服务", href: "/license" },
      { label: "隐私政策", href: "/license" },
      { label: "数据许可", href: "/license" },
      { label: "开源许可", href: "/license" }
    ]
  }
];

export const loginHighlights = [
  "92.11% 的事件可执行复现",
  "攻击发生 40 分钟内获得根本原因",
  "完整 PoC 代码，可在 fork 环境直接运行"
] as const;

export const unlockSteps: TimelineItem[] = [
  {
    id: "signin",
    stepLabel: "1",
    title: "登录 X 账号",
    description: "点击下方按钮，使用你的 X 账号登录 Vigil。"
  },
  {
    id: "reshare",
    stepLabel: "2",
    title: "转发指定帖子",
    description: "在 X 上转发我们发布的指定帖子，完成验证。"
  },
  {
    id: "access",
    stepLabel: "3",
    title: "报告即时解锁",
    description: "验证通过后，符合条件的报告将立即解锁查看。"
  }
];

export const licenseRows = [
  {
    label: "服务条款",
    value:
      "访问本网站即表示你同意合理使用事件情报，并遵守适用法律与平台规则。"
  },
  {
    label: "数据许可",
    value:
      "公开数据可用于引用与研究；完整数据集、实时访问和批量导出需订阅授权。"
  },
  {
    label: "隐私政策",
    value: "登录仅用于权限验证、订阅管理与解锁凭证确认。"
  },
  {
    label: "开源许可",
    value: "公开工具与示例代码会在各自仓库内标注许可条款。"
  }
] as const;
