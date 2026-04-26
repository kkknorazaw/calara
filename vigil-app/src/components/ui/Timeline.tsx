import type { TimelineItem } from "@/types";

interface TimelineProps {
  items: TimelineItem[];
  variant: "steps" | "flow";
}

export function Timeline({ items, variant }: TimelineProps): JSX.Element {
  if (variant === "steps") {
    return (
      <div className="steps">
        {items.map((item) => (
          <div className="step" key={item.id}>
            <div className="step-num">{item.stepLabel}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {items.map((item) => (
        <div className="flow-step" key={item.id}>
          <b>{item.stepLabel}</b>
          <div>
            <b>{item.title}</b>
            <br />
            <span>{item.description}</span>
          </div>
        </div>
      ))}
    </>
  );
}
