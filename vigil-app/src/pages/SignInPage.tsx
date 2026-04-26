import { Link } from "react-router-dom";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { loginHighlights } from "@/data/site";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function SignInPage(): JSX.Element {
  useDocumentTitle("登录到 Vigil");

  return (
    <main className="login-page">
      <section className="login-left">
        <Link className="brand" to="/">
          <IconGlyph name="brand" />
          <span>Vigil</span>
        </Link>
        <div className="login-slogan">
          <h1 className="serif">
            每一起漏洞
            <br />
            都在等待
            <br />
            被复现。
          </h1>
          <div className="login-checks">
            {loginHighlights.map((item) => (
              <div key={item}>
                <span className="ring-check">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="login-foot">
          <p>已有 500+ 安全研究员使用</p>
          <span>© 2026 Decentralized Intelligence AG</span>
        </div>
      </section>
      <section className="login-right">
        <div className="login-card">
          <h2>登录到 Vigil</h2>
          <p className="sub">访问实时 DeFi 漏洞情报与可复现报告</p>
          <button className="x-btn" type="button">
            使用 X (Twitter) 登录
          </button>
          <p className="agree">
            登录即表示你同意我们的 <Link to="/license">数据许可</Link> 和{" "}
            <Link to="/license">使用条款</Link>
          </p>
          <div className="or">或</div>
          <div className="access-cards">
            <div className="access-card">
              <div>
                <span>Free</span>
                <br />
                30 天后
                <br />
                免费访问
              </div>
            </div>
            <div className="access-card pro">
              <div>
                <span>Pro</span>
                <br />
                实时访问
                <br />
                CHF 49/月
              </div>
            </div>
          </div>
          <Link className="pricing-link" to="/pricing">
            查看定价详情 →
          </Link>
        </div>
      </section>
    </main>
  );
}
