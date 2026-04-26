import { IncidentTable } from "@/components/incident/IncidentTable";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { Timeline } from "@/components/ui/Timeline";
import { dashboardRows } from "@/data/incidents";
import { unlockSteps } from "@/data/site";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function UnlockPage(): JSX.Element {
  useDocumentTitle("Vigil | 免费解锁近期报告");

  return (
    <SiteShell>
      <main className="page">
        <section className="unlock-hero narrow">
          <div className="unlock-icon">
            <IconGlyph name="lock" />
          </div>
          <h1 className="serif unlock-title">免费解锁近期报告</h1>
          <p className="unlock-copy">
            转发指定的 Vigil X 帖子，即可解锁首次发布 10 至 30 天之间的事件报告。
            <br />
            最新 10 天内的事件需 Pro 订阅方可访问。
          </p>
          <Timeline items={unlockSteps} variant="steps" />
          <Button to="/api/auth/signin/twitter" variant="dark" size="large">
            使用 X 登录并解锁
          </Button>
        </section>
        <section className="unlock-list">
          <h2>已解锁的报告列表</h2>
          <IncidentTable incidents={dashboardRows} severityHeading="" />
        </section>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "18px", margin: "0 0 42px" }}>
          解锁完全免费，你的转发行即为解锁凭证。
        </p>
      </main>
    </SiteShell>
  );
}
