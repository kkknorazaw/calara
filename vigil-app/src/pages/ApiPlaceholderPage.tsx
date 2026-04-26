import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

interface ApiPlaceholderPageProps {
  title: string;
  heading: string;
  description: string;
}

export function ApiPlaceholderPage({
  title,
  heading,
  description
}: ApiPlaceholderPageProps): JSX.Element {
  useDocumentTitle(title);

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "60px auto",
        padding: "0 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
      }}
    >
      <section
        style={{
          background: "#fff",
          border: "1px solid #e6e8ee",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 8px 30px rgba(21,33,59,.06)"
        }}
      >
        <h1 style={{ margin: "0 0 12px", fontSize: "24px" }}>{heading}</h1>
        <p style={{ margin: "10px 0", lineHeight: 1.6, color: "#4b5568" }}>{description}</p>
        <p style={{ margin: "10px 0", lineHeight: 1.6, color: "#4b5568" }}>
          This static package is publish-ready, but this specific route was not included in the captured archive.
        </p>
        <p>
          <Link style={{ color: "#165ec9", textDecoration: "none" }} to="/">
            Back to dashboard
          </Link>
        </p>
      </section>
    </main>
  );
}
