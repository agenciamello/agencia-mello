import React, { useState } from "react";
import { Button } from "../ui/Button";

interface ParticleBurstButtonProps {
  href: string;
  children: React.ReactNode;
}

interface BurstParticle {
  x: number;
  y: number;
  rotation: number;
  delay: number;
  color: string;
  shape: "dot" | "line";
}

type ParticleStyle = React.CSSProperties & {
  "--burst-x": string;
  "--burst-y": string;
  "--burst-rotation": string;
  "--burst-delay": string;
  "--burst-color": string;
};

const BURST_PARTICLES: readonly BurstParticle[] = [
  { x: -132, y: -22, rotation: -18, delay: 0, color: "#f967fb", shape: "line" },
  { x: -104, y: -42, rotation: -48, delay: 18, color: "#6958d5", shape: "dot" },
  { x: -55, y: -54, rotation: -76, delay: 8, color: "#60aed5", shape: "line" },
  { x: 24, y: -52, rotation: 64, delay: 28, color: "#f967fb", shape: "dot" },
  { x: 88, y: -42, rotation: 28, delay: 12, color: "#6958d5", shape: "line" },
  { x: 132, y: -18, rotation: 8, delay: 34, color: "#60aed5", shape: "dot" },
  { x: 128, y: 22, rotation: -24, delay: 4, color: "#f967fb", shape: "line" },
  { x: 88, y: 44, rotation: -58, delay: 24, color: "#6958d5", shape: "dot" },
  { x: 36, y: 56, rotation: 82, delay: 14, color: "#60aed5", shape: "line" },
  { x: -38, y: 54, rotation: 52, delay: 38, color: "#f967fb", shape: "dot" },
  { x: -96, y: 42, rotation: 24, delay: 10, color: "#6958d5", shape: "line" },
  { x: -136, y: 10, rotation: 0, delay: 30, color: "#60aed5", shape: "dot" },
] as const;

export const ParticleBurstButton: React.FC<ParticleBurstButtonProps> = ({
  href,
  children,
}) => {
  const [burstId, setBurstId] = useState(0);

  return (
    <span className="mello-particle-burst relative inline-flex">
      <Button href={href} onClick={() => setBurstId((current) => current + 1)}>
        {children}
      </Button>

      <span
        aria-hidden="true"
        className="mello-particle-burst__field"
        data-burst-id={burstId}
      >
        {burstId > 0 &&
          BURST_PARTICLES.map((particle, index) => {
            const style: ParticleStyle = {
              "--burst-x": `${particle.x}px`,
              "--burst-y": `${particle.y}px`,
              "--burst-rotation": `${particle.rotation}deg`,
              "--burst-delay": `${particle.delay}ms`,
              "--burst-color": particle.color,
            };

            return (
              <span
                key={`${burstId}-${index}`}
                className="mello-particle-burst__particle"
                data-shape={particle.shape}
                style={style}
              />
            );
          })}
      </span>
    </span>
  );
};
