import type { BubbleLegendItem, BubblePoint } from "@/types";

interface BubbleChartProps {
  title: string;
  points: BubblePoint[];
  legend: BubbleLegendItem[];
}

export function BubbleChart({ title, points, legend }: BubbleChartProps): JSX.Element {
  const focusPoint = points.find((point) => point.id === "deltaprime") ?? points[0];

  return (
    <section className="container bubble-section" aria-label={title}>
      <h2>{title}</h2>
      <div className="orbit" />
      <div className="orbit second" />
      {points.map((point) => (
        <div
          className={`bubble ${point.colorClass}`}
          key={point.id}
          style={{
            width: `${point.size}px`,
            height: `${point.size}px`,
            left: `${point.left}px`,
            top: `${point.top}px`,
            fontSize: point.fontSize ? `${point.fontSize}px` : undefined
          }}
        >
          {point.name}
          <small>{point.amountLabel}</small>
        </div>
      ))}
      <div className="tooltip-card">
        <b>{focusPoint.name}</b>
        <br />
        {focusPoint.id === "deltaprime" ? "$612,400,000" : focusPoint.amountLabel}
        <br />
        <span style={{ color: "var(--red)" }}>●</span> {focusPoint.attackTypeLabel}
        <br />
        发生日期：{focusPoint.dateLabel}
      </div>
      <div className="legend">
        {legend.map((item) => (
          <span key={item.label}>
            <i style={{ background: `var(--${item.colorToken})` }} />
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}
