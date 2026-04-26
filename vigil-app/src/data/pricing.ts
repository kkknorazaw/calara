import type { ComparisonRow, PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "FREE",
    subtitle: "适合关注风险的个人与社区成员",
    currency: "CHF",
    priceLabel: "0",
    billingLabel: "/月",
    buttonLabel: "免费通过转发解锁",
    buttonHref: "/unlock",
    buttonVariant: "default",
    accent: "default",
    features: [
      { icon: "check", label: "访问最新事件（延迟解锁）" },
      { icon: "check", label: "访问过去 3 天的事件" },
      { icon: "check", label: "基础事件摘要" },
      { icon: "check", label: "社区与公开研究内容" },
      { icon: "check", label: "邮件订阅与公告通知" }
    ]
  },
  {
    id: "pro",
    name: "VIGIL PRO",
    subtitle: "为活跃交易者与研究者打造",
    currency: "CHF",
    priceLabel: "49",
    billingLabel: "/月",
    badge: "推荐",
    buttonLabel: "升级到 Pro",
    buttonHref: "/api/auth/signin/twitter",
    buttonVariant: "dark",
    accent: "featured",
    planToggle: {
      monthlyLabel: "月付",
      yearlyLabel: "年付",
      savingLabel: "省 CHF 98"
    },
    features: [
      { icon: "check", label: "实时访问最新事件" },
      { icon: "check", label: "访问过去 10 天的全部事件" },
      { icon: "check", label: "深度事件分析与根因" },
      { icon: "check", label: "PoC 验证与攻击流程图" },
      { icon: "check", label: "实时预警与邮件通知" },
      { icon: "check", label: "导出数据与高级筛选" },
      { icon: "check", label: "优先支持" }
    ]
  },
  {
    id: "first-class",
    name: "VIGIL FIRST CLASS",
    subtitle: "为长期支持者与行业建设者",
    currency: "CHF",
    priceLabel: "2000",
    billingLabel: "/年",
    badge: "支持者",
    badgeTone: "gold",
    buttonLabel: "成为支持者",
    buttonHref: "/api/auth/signin/twitter",
    buttonVariant: "gold",
    accent: "gold",
    features: [
      { icon: "star", label: "包含 Pro 全部权益" },
      { icon: "star", label: "专属支持者身份标识" },
      { icon: "star", label: "加入私有 Slack 社区" },
      { icon: "star", label: "自助式 ACT 攻击面分析" },
      { icon: "star", label: "专属数据集与研究报告" },
      { icon: "star", label: "实时预警与定制化告警" },
      { icon: "star", label: "路线图优先投票" },
      { icon: "star", label: "一对一专家支持" }
    ]
  }
];

export const pricingComparisonRows: ComparisonRow[] = [
  {
    feature: "最新事件访问",
    free: "延迟解锁（首次发布后约 30 天）",
    pro: "实时访问",
    firstClass: "实时访问"
  },
  {
    feature: "历史事件范围",
    free: "过去 3 天",
    pro: "过去 10 天",
    firstClass: "过去 90 天"
  },
  {
    feature: "深度分析与 RCA",
    free: "×",
    pro: "✓",
    firstClass: "✓"
  },
  {
    feature: "PoC 验证与攻击流程图",
    free: "×",
    pro: "✓",
    firstClass: "✓"
  },
  {
    feature: "实时预警与邮件通知",
    free: "仅公告通知",
    pro: "✓",
    firstClass: "自定义告警 & ✓"
  },
  {
    feature: "自助式 ACT 攻击面分析",
    free: "×",
    pro: "×",
    firstClass: "✓"
  },
  {
    feature: "私人 Slack 社区",
    free: "×",
    pro: "×",
    firstClass: "✓"
  },
  {
    feature: "数据导出与高级筛选",
    free: "×",
    pro: "✓",
    firstClass: "✓"
  },
  {
    feature: "数据集与研究报告",
    free: "×",
    pro: "部分公开研究",
    firstClass: "专属数据集 & 全部研究报告"
  },
  {
    feature: "支持优先级",
    free: "社区支持",
    pro: "优先支持（工单优先处理）",
    firstClass: "专属一对一专家支持"
  }
];
