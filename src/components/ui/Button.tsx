import React from "react";
import { Link } from "react-router-dom";

export interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  to?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  to,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  target,
  rel,
  ariaLabel,
  type = "button",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

  const sizeClasses = {
    sm: "min-h-9 px-4 py-2 text-xs rounded-full gap-1.5",
    md: "min-h-11 px-6 py-3 text-[15px] rounded-full gap-2",
    lg: "min-h-12 px-7 py-3.5 text-base rounded-full gap-2.5",
  }[size];

  const variantClasses = {
    primary:
      "bg-accent text-white shadow-sm hover:bg-accent/85 active:scale-[0.98]",
    secondary:
      "border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25 active:scale-[0.98]",
    outline:
      "border border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-white/35 active:scale-[0.98]",
    ghost:
      "bg-transparent text-muted-foreground hover:text-white hover:bg-white/5",
  }[variant];

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("//");
    return (
      <a
        href={href}
        className={combinedClasses}
        onClick={onClick}
        target={target || (isExternal ? "_blank" : undefined)}
        rel={rel || (isExternal ? "noopener noreferrer" : undefined)}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
