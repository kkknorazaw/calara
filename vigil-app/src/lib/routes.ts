export function isDashboardSection(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/incidents/") ||
    pathname.startsWith("/unlock") ||
    pathname.startsWith("/subscribe") ||
    pathname.startsWith("/license") ||
    pathname.startsWith("/report")
  );
}
