import { Link } from "react-router-dom";
import { BubbleChart } from "@/components/incident/BubbleChart";
import { IncidentTable } from "@/components/incident/IncidentTable";
import { SiteShell } from "@/components/layout/SiteShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { StatCard } from "@/components/ui/StatCard";
import {
  bubbleLegend,
  bubblePoints,
  dashboardRows,
  heroFeatures,
  impactOverview,
  tableUpdatedLabel
} from "@/data/incidents";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

function renderFeatureIcon(iconKey: "search" | "code" | "network"): JSX.Element {
  return <IconGlyph name={iconKey} />;
}

export function HomePage(): JSX.Element {
  useDocumentTitle("Vigil | 实时 DeFi 漏洞利用情报");

  return (
    <SiteShell>
      <main className="page">
        <section className="container dashboard-hero">
          <div className="hero-main">
            <Badge dot>实时 DeFi 漏洞利用情报</Badge>
            <h1 className="serif hero-title">
              每一次 DeFi 黑客
              <br />
              攻击都会改变
              <br />
              你的风险敞口。
            </h1>
            <p className="hero-copy">
              Vigil 将实时事件转化为可复现的技术证据：根本原因分析、漏洞利用 PoC 和跟踪上下文，供团队跟踪可重复的故障模式。
            </p>
            <div className="hero-actions">
              <Button href="#events" variant="dark">
                最新事件 →
              </Button>
              <Link className="text-link" to="/unlock">
                X 的免费分析
              </Link>
            </div>
          </div>
          <aside className="impact-card">
            <div className="impact-title">美元潜在影响总览</div>
            <div className="impact-main">
              <div className="amount">{impactOverview.totalLossLabel}</div>
              <div className="delta">{impactOverview.deltaLabel}</div>
            </div>
            <div className="impact-sub">{impactOverview.summaryLabel}</div>
            <div className="impact-metrics">
              {impactOverview.metrics.map((metric) => (
                <StatCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  variant="impact"
                />
              ))}
            </div>
            <div className="impact-foot">
              <span>{impactOverview.footnotes[0]}</span>
              <span>{impactOverview.footnotes[1]}</span>
            </div>
          </aside>
          <div className="feature-row">
            {heroFeatures.map((feature) => (
              <article className="feature-card" key={feature.title}>
                {renderFeatureIcon(feature.iconKey)}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
        <BubbleChart title="损失规模分布 · 过去 90 天" points={bubblePoints} legend={bubbleLegend} />
        <div className="container" id="events">
          <IncidentTable
            title="事件"
            countLabel="572"
            incidents={dashboardRows}
            searchable
            filterable
            footerContent={
              <>
                <div className="pager-buttons">
                  <span className="page-btn">上一页</span>
                  <span className="page-btn current">1</span>
                  <span className="page-btn">2</span>
                  <span className="page-btn">3</span>
                  <span>...</span>
                  <span className="page-btn">72</span>
                  <span className="page-btn">下一页</span>
                </div>
                <span>最后更新：{tableUpdatedLabel}</span>
              </>
            }
          />
        </div>
      </main>
    </SiteShell>
  );
}
