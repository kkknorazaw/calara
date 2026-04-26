import { IncidentTable } from "@/components/incident/IncidentTable";
import { SiteShell } from "@/components/layout/SiteShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { dashboardRows } from "@/data/incidents";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function SubscribePage(): JSX.Element {
  useDocumentTitle("Vigil | 事件订阅");

  return (
    <SiteShell>
      <main className="page narrow">
        <section className="center-hero">
          <Badge>Incident Feed</Badge>
          <h1 className="serif center-title">订阅实时事件更新</h1>
          <p className="center-copy">
            获得关键事件发布、修复进展与 PoC 更新提醒。Pro 用户可开启实时邮件与高级筛选。
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Button to="/api/auth/signin/twitter" variant="dark">
              使用 X 登录
            </Button>
            <Button to="/pricing">查看定价</Button>
          </div>
        </section>
        <IncidentTable incidents={dashboardRows} />
      </main>
    </SiteShell>
  );
}
