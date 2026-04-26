import { useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { researchBibtex, researchFaqItems, researchMetrics } from "@/data/research";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function ResearchPage(): JSX.Element {
  useDocumentTitle("Vigil | 研究");
  const [openFaqId, setOpenFaqId] = useState(researchFaqItems[0]?.id ?? "");

  return (
    <SiteShell>
      <main className="page narrow">
        <section className="center-hero">
          <Badge>Research Basis</Badge>
          <h1 className="serif center-title">
            为什么 Vigil 的报告具有
            <br />
            可复现性，而非仅为叙述
          </h1>
          <p className="center-copy">
            Vigil 基于 TxRay 框架：基于公链证据的模型驱动事件分析、可执行的漏洞利用 PoC，以及对无特权对手所能执行操作的明确假设。
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Button variant="dark" href="#method">
              查看论文 →
            </Button>
            <Button href="#citation">阅读 PDF</Button>
          </div>
        </section>
        <section className="metrics-grid">
          {researchMetrics.map((metric) => (
            <div key={metric.id}>
              <article className="research-metric">
                <div className={`metric-icon ${metric.accent}`}>
                  {metric.iconKey === "shield" ? (
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8">
                      <path d="M24 5 39 11v11c0 10-6 17-15 21C15 39 9 32 9 22V11l15-6Z" />
                      <path d="m17 24 5 5 10-12" />
                    </svg>
                  ) : metric.iconKey === "clock" ? (
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8">
                      <circle cx="24" cy="24" r="17" />
                      <path d="M24 13v12l8 5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8">
                      <path d="m18 14-10 10 10 10" />
                      <path d="m30 14 10 10-10 10" />
                    </svg>
                  )}
                </div>
                <strong style={{ color: `var(--${metric.accent})` }}>{metric.value}</strong>
                {metric.unit ? (
                  <span style={{ fontSize: "32px", color: `var(--${metric.accent})` }}>
                    {" "}
                    {metric.unit}
                  </span>
                ) : null}
                <h3>{metric.title}</h3>
                <p>{metric.description}</p>
              </article>
            </div>
          ))}
        </section>
        <p style={{ textAlign: "center", color: "var(--muted)", margin: "18px 0 0" }}>
          基于 114 起 ACT 事件，105 起可执行复现
        </p>
        <section id="citation" className="citation">
          <h2>如何引用</h2>
          <div className="bibtex">
            <CodeBlock
              title="BibTeX"
              languageLabel="Citation"
              code={researchBibtex}
              copyValue={researchBibtex}
            />
          </div>
        </section>
        <section id="method" className="qa">
          <h2>Research Q&A</h2>
          <div className="accordion">
            {researchFaqItems.map((item) => {
              const open = item.id === openFaqId;
              return (
                <div className={`qa-item ${open ? "open" : ""}`} key={item.id}>
                  <button
                    className="qa-question"
                    onClick={() => setOpenFaqId(open ? "" : item.id)}
                    type="button"
                  >
                    {item.question}
                    <span>{open ? "−" : "+"}</span>
                  </button>
                  <div className="qa-answer">{item.answer}</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
