import React, { useRef } from "react";
import { useProjectsHandoff } from "../../motion/useProjectsHandoff";
import { FeaturedOfferSection } from "./FeaturedOfferSection";
import { ProjectsSection } from "./ProjectsSection";
import { isMotionDebugForced } from "../../utils/motionDebug";

export const ProjectsHandoff: React.FC = () => {
  const forceMotion = isMotionDebugForced();
  const rootRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useProjectsHandoff({
    rootRef,
    outgoingRef,
    incomingRef,
    veilRef,
  });

  return (
    <div
      ref={rootRef}
      className="projects-focus-handoff"
      data-projects-handoff
      data-force-motion={forceMotion ? "" : undefined}
    >
      <div className="projects-focus-handoff__pin">
        <div
          ref={outgoingRef}
          className="projects-focus-handoff__plane"
          data-projects-outgoing
        >
          <FeaturedOfferSection />
        </div>
        <div
          ref={veilRef}
          aria-hidden="true"
          className="projects-focus-handoff__veil pointer-events-none absolute inset-0 z-20"
          data-projects-focus-veil
        />
      </div>

      <div
        ref={incomingRef}
        className="projects-focus-handoff__incoming"
        data-projects-incoming
      >
        <ProjectsSection />
      </div>
    </div>
  );
};
