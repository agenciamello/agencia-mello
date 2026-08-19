import React from "react";

interface SectionContainerProps {
  id?: string;
  surface?: boolean;
  compact?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  surface = false,
  compact = false,
  children,
  className = "",
}) => {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 ${
        surface ? "bg-surface border-y border-white/[0.07]" : "bg-background"
      } ${compact ? "py-14 sm:py-16 lg:py-20" : "py-16 sm:py-20 lg:py-24"} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
};
