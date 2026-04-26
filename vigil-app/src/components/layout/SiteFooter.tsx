import { Link } from "react-router-dom";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { footerColumns } from "@/data/site";

export function SiteFooter(): JSX.Element {
  function renderFooterLink(key: string, label: string, href: string): JSX.Element {
    if (href.startsWith("#") || href.includes("://")) {
      return (
        <a href={href} key={key}>
          {label}
        </a>
      );
    }

    return (
      <Link key={key} to={href}>
        {label}
      </Link>
    );
  }

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Link className="brand" to="/">
            <IconGlyph name="brand" />
            <span>Vigil</span>
          </Link>
          <p className="footer-copy">
            Vigil 为实时 DeFi 漏洞利用发布可复现的事件分析，包含根本原因分析、执行追踪和 PoC artifacts。
          </p>
          <div className="socials">
            <a href="#">GitHub</a>
            <a href="#">X</a>
            <a href="#">Discord</a>
            <a href="#">in</a>
          </div>
        </div>
        {footerColumns.map((column) => (
          <div className="footer-col" key={column.title}>
            <h4>{column.title}</h4>
            {column.links.map((link) =>
              renderFooterLink(`${column.title}-${link.label}`, link.label, link.href)
            )}
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Decentralized Intelligence AG</span>
        <span>版权所有。未经许可，不得复制、分发或使用本网站的任何内容。</span>
      </div>
    </footer>
  );
}
