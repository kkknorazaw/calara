import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps): JSX.Element {
  return (
    <>
      <AppHeader />
      {children}
      <SiteFooter />
    </>
  );
}
