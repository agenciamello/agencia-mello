import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS_MOTION_CONFIG } from "../config/projectsMotionConfig";

gsap.registerPlugin(ScrollTrigger);

interface UseProjectsHandoffOptions {
  rootRef: RefObject<HTMLDivElement | null>;
  outgoingRef: RefObject<HTMLDivElement | null>;
  incomingRef: RefObject<HTMLDivElement | null>;
  veilRef: RefObject<HTMLDivElement | null>;
}

interface ProjectsMediaConditions {
  desktop?: boolean;
  compact?: boolean;
  reducedMotion?: boolean;
}

const isDevelopment =
  (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true;

export const useProjectsHandoff = ({
  rootRef,
  outgoingRef,
  incomingRef,
  veilRef,
}: UseProjectsHandoffOptions): void => {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const outgoing = outgoingRef.current;
    const incoming = incomingRef.current;
    const veil = veilRef.current;
    if (!root || !outgoing || !incoming || !veil) return;

    const layers = [outgoing, incoming, veil];
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: `(min-width: ${PROJECTS_MOTION_CONFIG.breakpointPx}px)`,
          compact: `(max-width: ${PROJECTS_MOTION_CONFIG.breakpointPx - 1}px)`,
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (mediaContext) => {
          const conditions =
            (mediaContext.conditions as ProjectsMediaConditions | undefined) ??
            {};

          gsap.set(layers, {
            clearProps: "opacity,transform,transformOrigin,willChange",
          });

          if (!conditions.desktop || conditions.reducedMotion) return;

          gsap.set(outgoing, {
            transformOrigin: "center center",
            willChange: "transform",
          });
          gsap.set(incoming, { willChange: "transform" });
          gsap.set(veil, { opacity: 0, willChange: "opacity" });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: PROJECTS_MOTION_CONFIG.scroll.start,
              end: PROJECTS_MOTION_CONFIG.scroll.end,
              scrub: PROJECTS_MOTION_CONFIG.scroll.scrub,
              pin: PROJECTS_MOTION_CONFIG.scroll.pin,
              markers:
                isDevelopment && PROJECTS_MOTION_CONFIG.debug.markers,
            },
          });

          timeline
            .to(
              outgoing,
              {
                yPercent:
                  PROJECTS_MOTION_CONFIG.desktop.outgoingYPercent,
                scale: PROJECTS_MOTION_CONFIG.desktop.outgoingScale,
                duration: 1,
              },
              0,
            )
            .fromTo(
              incoming,
              {
                yPercent:
                  PROJECTS_MOTION_CONFIG.desktop.incomingStartYPercent,
              },
              { yPercent: 0, duration: 1, immediateRender: true },
              0,
            )
            .to(
              veil,
              {
                opacity: 1,
                duration: PROJECTS_MOTION_CONFIG.focusPull.duration,
              },
              PROJECTS_MOTION_CONFIG.focusPull.start,
            );

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
            gsap.set(layers, {
              clearProps: "opacity,transform,transformOrigin,willChange",
            });
          };
        },
      );
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, [incomingRef, outgoingRef, rootRef, veilRef]);
};
