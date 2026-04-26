import type { ReactNode } from "react";
import { cn } from "@/lib/classes";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, className, dot = false }: BadgeProps): JSX.Element {
  return (
    <div className={cn("badge", className)}>
      {dot ? <span className="dot" /> : null}
      {children}
    </div>
  );
}
