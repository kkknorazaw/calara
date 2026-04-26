import { Link } from "react-router-dom";
import { PricingCard } from "@/components/incident/PricingCard";
import { SiteShell } from "@/components/layout/SiteShell";
import { Badge } from "@/components/ui/Badge";
import { pricingComparisonRows, pricingPlans } from "@/data/pricing";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function PricingPage(): JSX.Element {
  useDocumentTitle("Vigil | 定价");

  return (
    <SiteShell>
      <main className="page narrow">
        <section className="center-hero">
          <Badge>Paid Plans</Badge>
          <h1 className="serif center-title">定价与计划权限</h1>
          <p className="center-copy">
            免费用户在首次发布 30 天后可解锁报告；Pro 用户即时访问最新事件。
          </p>
          <div className="plan-note">
            <span className="tag">当前计划：Free</span>
            <Link className="text-link" to="/api/auth/signin/twitter">
              管理订阅 →
            </Link>
          </div>
        </section>
        <section className="pricing-grid">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </section>
        <section className="comparison">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>功能</th>
                  <th>Free</th>
                  <th>
                    Vigil Pro <span className="type-pill type-red">推荐</span>
                  </th>
                  <th>
                    Vigil First Class <span className="type-pill type-orange">支持者</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricingComparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td>{row.free}</td>
                    <td>{row.pro}</td>
                    <td>{row.firstClass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comparison-actions">
            <Link className="text-link" to="/api/auth/signin/twitter">
              管理订阅 →
            </Link>
            <Link className="text-link" to="/">
              返回仪表板 →
            </Link>
          </div>
        </section>
        <p style={{ color: "var(--muted)", margin: "22px 0 0" }}>
          ※ 所有价格均含增值税（如适用）。如需团队或机构方案，请通过 hello@vigilwatch.io 联系我们。
        </p>
      </main>
    </SiteShell>
  );
}
