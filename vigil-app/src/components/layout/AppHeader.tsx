import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { navItems } from "@/data/site";
import { isDashboardSection } from "@/lib/routes";

export function AppHeader(): JSX.Element {
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink className="brand" to="/">
          <IconGlyph name="brand" />
          <span>Vigil</span>
        </NavLink>
        <nav className="main-nav" aria-label="主导航">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? isDashboardSection(location.pathname)
                : location.pathname.startsWith(item.href);

            return (
              <NavLink className={active ? "active" : ""} key={item.href} to={item.href}>
                {item.label}
              </NavLink>
            );
          })}
          <a href="https://x.com/vigil_watch" target="_blank" rel="noreferrer">
            @vigil_watch ↗
          </a>
        </nav>
        <div className="header-actions">
          <a className="lang-link" href="#">
            中文 / EN
          </a>
          <Button to="/api/auth/signin/twitter" variant="dark">
            使用 X 登录
          </Button>
        </div>
      </div>
    </header>
  );
}
