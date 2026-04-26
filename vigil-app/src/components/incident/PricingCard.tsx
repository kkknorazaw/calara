import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/classes";
import type { PricingPlan } from "@/types";

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps): JSX.Element {
  return (
    <article
      className={cn(
        "price-card",
        plan.accent === "featured" && "featured",
        plan.accent === "gold" && "gold-card"
      )}
    >
      {plan.badge ? (
        <span className={cn("corner-label", plan.badgeTone === "gold" && "gold")}>
          {plan.badge}
        </span>
      ) : null}
      <h2>{plan.name}</h2>
      <p className="for">{plan.subtitle}</p>
      <div className="price">
        <span className="currency">{plan.currency}</span>
        <strong className={plan.accent === "gold" ? "gold-price" : undefined}>
          {plan.priceLabel}
        </strong>
        <span>{plan.billingLabel}</span>
      </div>
      {plan.planToggle ? (
        <div className="plan-toggle">
          <span>{plan.planToggle.monthlyLabel}</span>
          <span className="active">{plan.planToggle.yearlyLabel}</span>
          <span className="save">{plan.planToggle.savingLabel}</span>
        </div>
      ) : null}
      <Button
        className="plan-button"
        to={plan.buttonHref}
        style={{ width: "100%" } as CSSProperties}
        variant={plan.buttonVariant}
      >
        {plan.buttonLabel}
      </Button>
      <div className="feature-list">
        {plan.features.map((feature) => (
          <div key={feature.label}>
            <span className={feature.icon === "check" ? "check" : "star"}>
              {feature.icon === "check" ? "✓" : "★"}
            </span>
            <span>{feature.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
