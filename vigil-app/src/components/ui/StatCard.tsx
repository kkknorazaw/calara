import { IconGlyph } from "@/components/ui/IconGlyph";
import { cn } from "@/lib/classes";

interface StatCardProps {
  variant: "impact" | "metric" | "detail";
  label: string;
  value: string;
  accent?: "red" | "green" | "blue" | "orange" | "default";
  unit?: string;
  description?: string;
  iconKey?: "shield" | "clock" | "code";
}

export function StatCard({
  variant,
  label,
  value,
  accent = "default",
  unit,
  description,
  iconKey
}: StatCardProps): JSX.Element {
  const valueLines = value.split("\n");

  if (variant === "impact") {
    return (
      <div className="impact-metric">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="stat-cell">
        <span>{label}</span>
        <strong className={cn(accent !== "default" && accent, value.includes("$") && "mono")}>
          {valueLines.map((line) => (
            <span key={`${label}-${line}`} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </strong>
      </div>
    );
  }

  return (
    <article className="research-metric">
      {iconKey ? (
        <div className={cn("metric-icon", accent === "default" ? "blue" : accent)}>
          <IconGlyph name={iconKey} />
        </div>
      ) : null}
      <strong style={{ color: accent === "default" ? "var(--ink)" : `var(--${accent})` }}>
        {value}
      </strong>
      {unit ? (
        <span
          style={{
            fontSize: "32px",
            color: accent === "default" ? "var(--ink)" : `var(--${accent})`
          }}
        >
          {" "}
          {unit}
        </span>
      ) : null}
      <h3>{label}</h3>
      {description ? <p>{description}</p> : null}
    </article>
  );
}
