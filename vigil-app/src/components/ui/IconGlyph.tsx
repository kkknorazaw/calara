import type { FC } from "react";

interface IconGlyphProps {
  name:
    | "brand"
    | "search"
    | "code"
    | "network"
    | "shield"
    | "clock"
    | "angle-right"
    | "share"
    | "bell"
    | "lock";
  className?: string;
}

export const IconGlyph: FC<IconGlyphProps> = ({ name, className }) => {
  switch (name) {
    case "brand":
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
          <path
            d="M28 8.5A14 14 0 1 0 28 27.5"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M27.4 13.3A9 9 0 1 0 27.4 22.7"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity=".35"
          />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="11" cy="11" r="7" />
          <path d="m16.5 16.5 4 4" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="m8 7-5 5 5 5" />
          <path d="m16 7 5 5-5 5" />
          <path d="m14 4-4 16" />
        </svg>
      );
    case "network":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="m8.6 10.6 6.8-3.2M8.6 13.4l6.8 3.2" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" className={className}>
          <path d="M24 5 39 11v11c0 10-6 17-15 21C15 39 9 32 9 22V11l15-6Z" />
          <path d="m17 24 5 5 10-12" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" className={className}>
          <circle cx="24" cy="24" r="17" />
          <path d="M24 13v12l8 5" />
        </svg>
      );
    case "angle-right":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      );
    case "share":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 10.8 6.8-4.1M8.6 13.2l6.8 4.1" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
          <rect x="28" y="39" width="40" height="34" rx="7" />
          <path d="M34 39V28a14 14 0 0 1 28 0v11" />
          <path d="M48 55v9" />
          <circle cx="48" cy="53" r="4" />
        </svg>
      );
    default:
      return null;
  }
};
