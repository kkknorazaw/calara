import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface CodeBlockProps {
  title: string;
  languageLabel: string;
  code: string;
  copyValue: string;
}

export function CodeBlock({
  title,
  languageLabel,
  code,
  copyValue
}: CodeBlockProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    if (!navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(copyValue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="code-card">
      <div className="code-head">
        <span>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="mono" style={{ color: "var(--soft)", fontSize: "12px" }}>
            {languageLabel}
          </span>
          <Button className="" onClick={handleCopy}>
            {copied ? "已复制" : "复制"}
          </Button>
        </div>
      </div>
      <pre>{code}</pre>
    </div>
  );
}
