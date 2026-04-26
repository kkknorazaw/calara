import { SiteShell } from "@/components/layout/SiteShell";
import { Badge } from "@/components/ui/Badge";
import { licenseRows } from "@/data/site";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function LicensePage(): JSX.Element {
  useDocumentTitle("Vigil | 许可");

  return (
    <SiteShell>
      <main className="page narrow">
        <section className="center-hero">
          <Badge>License</Badge>
          <h1 className="serif center-title">许可、数据使用与服务条款</h1>
          <p className="center-copy">
            Vigil 的事件报告、图表与 PoC artifacts 仅供授权研究、安全响应与内部风险评估使用。未经许可，不得复制、分发或商业化使用。
          </p>
        </section>
        <section className="comparison">
          <table>
            <tbody>
              {licenseRows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </SiteShell>
  );
}
