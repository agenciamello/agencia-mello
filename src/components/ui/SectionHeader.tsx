import React from "react";
import { Badge } from "./Badge";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  compact?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = "left",
  compact = false,
  className = "",
}) => {
  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col ${
        isCenter ? "items-center text-center mx-auto max-w-3xl" : "max-w-3xl"
      } ${className}`}
    >
      {eyebrow && (
        <div className="mb-4">
          <Badge>{eyebrow}</Badge>
        </div>
      )}
      <h2
        className={`font-bold leading-[1.15] text-white [text-wrap:balance] ${
          compact
            ? "text-2xl sm:text-3xl lg:text-4xl"
            : "text-[1.75rem] sm:text-3xl lg:text-4xl"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed text-muted-foreground sm:text-[17px] ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
