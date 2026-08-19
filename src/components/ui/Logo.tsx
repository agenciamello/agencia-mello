import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ width = 132, height, className = "" }) => {
  return (
    <img
      src="/assets/logo.png"
      alt="Agência Mello"
      width={width}
      height={height}
      className={`h-auto object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
};
