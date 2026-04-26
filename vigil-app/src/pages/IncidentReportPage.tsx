import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { AddressList } from "@/components/incident/AddressList";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { StatCard } from "@/components/ui/StatCard";
import { Timeline } from "@/components/ui/Timeline";
import { getReportDetail } from "@/data/reports";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function IncidentReportPage(): JSX.Element {
  const params = useParams<{ incidentId: string }>();
  const identifier = params.incidentId ?? "kyberswap";
  const report = useMemo(() => getReportDetail(identifier), [identifier]);

  useDocumentTitle(`Vigil | ${report.title.replace("\n", " ")}`);

  return (
    <SiteShell>
      <main className="page report-shell container">
        <div className="crumb">
          <Link to="/">← 事件库</Link>
          <span>/</span>
          <span>{report.eyebrow.split("/").at(-1)?.trim()}</span>
        </div>
        <div className="detail-topline">
          <div>
            <h1 className="serif detail-title">
              {report.title.split("\n").map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h1>
            <div className="meta-tags">
              <span className="tag critical">CRITICAL</span>
              <span className="tag">{report.categoryLabel}</span>
              <span className="tag">◆ {report.chainLabel}</span>
              <span className="tag">▣ {report.timestampLabel}</span>
              <span className="tag green">{report.statusLabel}</span>
            </div>
          </div>
          <div className="detail-actions">
            <a className="icon-btn" href="#">
              <IconGlyph name="share" />
            </a>
            <Button href="#">
              <IconGlyph name="bell" />
              订阅事件更新
            </Button>
            <Button variant="dark" href="#poc">
              <IconGlyph name="code" />
              查看 PoC
            </Button>
          </div>
        </div>
        <section className="stat-strip">
          {report.statStrip.map((stat) => (
            <StatCard
              key={`${stat.label}-${stat.value}`}
              label={stat.label}
              value={stat.value}
              variant="detail"
              accent={stat.accent}
            />
          ))}
        </section>
        <div className="detail-layout">
          <div>
            <section className="tldr">
              <h2>TL;DR</h2>
              <p>{report.summary}</p>
            </section>
            <section className="evidence-card">
              <div className="evidence-grid">
                {report.evidenceStats.map((stat) => (
                  <StatCard
                    key={`${stat.label}-${stat.value}`}
                    label={stat.label}
                    value={stat.value}
                    variant="detail"
                    accent={stat.accent}
                  />
                ))}
              </div>
              <AddressList title="相关地址" items={report.addressItems} />
            </section>
            <section className="analysis-card" id="poc">
              <div className="analysis-tabs">
                <span>概览</span>
                <span className="active">技术分析</span>
                <span>时间线</span>
              </div>
              <div className="analysis-body">
                <aside className="toc">
                  <span>1. 基础知识</span>
                  <span>2. 漏洞分析</span>
                  <span>3. 攻击过程与比较分析</span>
                  <span>4. 攻击流程分析</span>
                  <span>5. 修复建议</span>
                  <span>6. 总结与展望</span>
                  <span>7. 参考文献</span>
                </aside>
                <article className="article">
                  <h2>2. 漏洞分析</h2>
                  <p>{report.analysisIntro}</p>
                  {report.codeExamples.map((example) => (
                    <CodeBlock
                      key={example.title}
                      title={example.title}
                      languageLabel={example.languageLabel}
                      code={example.code}
                      copyValue={example.copyValue}
                    />
                  ))}
                </article>
                <aside className="flow-list">
                  <h3>3. 攻击流程分析</h3>
                  <Timeline items={report.flowSteps} variant="flow" />
                </aside>
              </div>
            </section>
          </div>
          <aside>
            <section className="side-card">
              <h3>相关事件</h3>
              {report.relatedIncidents.map((item) => (
                <div className="related-row" key={item.name}>
                  <div>
                    <b>{item.name}</b>
                    <br />
                    <small>{item.dateLabel}</small>
                  </div>
                  <span className="loss-red">{item.amountLabel}</span>
                </div>
              ))}
              <Link className="text-link" to="/">
                查看全部事件 →
              </Link>
            </section>
            <section className="side-card">
              <h3>外部链接</h3>
              {report.externalLinks.map((link) => (
                <a className="external-row" href={link.href} key={link.label}>
                  <span>{link.label}</span>
                  <span>↗</span>
                </a>
              ))}
            </section>
            <section className="side-card pro-card">
              <div className="lock-large">
                <IconGlyph name="lock" />
              </div>
              <h3>获取实时访问</h3>
              <p>升级至 Pro，解锁完整报告、实时警报与高级分析工具。</p>
              <Button to="/pricing" variant="dark" className="side-action">
                查看定价
              </Button>
            </section>
          </aside>
        </div>
      </main>
    </SiteShell>
  );
}
