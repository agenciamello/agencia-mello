import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-medium uppercase tracking-[0.14em] text-accent backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  );
};
