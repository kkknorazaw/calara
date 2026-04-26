import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/classes";

type ButtonVariant = "default" | "dark" | "gold";
type ButtonSize = "default" | "large";

interface SharedButtonProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonAsLink = SharedButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href?: string;
    to?: string;
  };

type ButtonAsButton = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
    to?: never;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button(props: ButtonProps): JSX.Element {
  const {
    children,
    className,
    variant = "default",
    size = "default",
    ...restProps
  } = props;

  const classes = cn(
    "btn",
    variant === "dark" && "dark",
    variant === "gold" && "gold",
    size === "large" && "large",
    className
  );

  if ("to" in restProps && typeof restProps.to === "string") {
    const { to, ...rest } = restProps as ButtonAsLink & { to: string };
    return (
      <Link className={classes} to={to} {...rest}>
        {children}
      </Link>
    );
  }

  if ("href" in restProps && restProps.href) {
    const { href, ...rest } = restProps as ButtonAsLink;
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  const buttonProps = restProps as ButtonAsButton;
  return (
    <button className={classes} type={buttonProps.type ?? "button"} {...buttonProps}>
      {children}
    </button>
  );
}
