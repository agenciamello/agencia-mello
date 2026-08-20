import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_MOTION_CONFIG } from "../config/heroMotionConfig";
import { isMotionDebugForced } from "../utils/motionDebug";

gsap.registerPlugin(ScrollTrigger);

interface UseHeroMotionOptions {
  sectionRef: RefObject<HTMLElement | null>;
  copyRef: RefObject<HTMLDivElement | null>;
  backgroundRef: RefObject<HTMLDivElement | null>;
  visualLayerRef: RefObject<HTMLDivElement | null>;
}

interface ParallaxMediaConditions {
  desktop?: boolean;
  mobile?: boolean;
  reducedMotion?: boolean;
}

const isDevelopment =
  (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true;

export const useHeroMotion = ({
  sectionRef,
  copyRef,
  backgroundRef,
  visualLayerRef,
}: UseHeroMotionOptions): void => {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    const background = backgroundRef.current;
    const visualLayer = visualLayerRef.current;
    const handoff = section?.closest<HTMLElement>("[data-hero-handoff]");
    const incoming = handoff?.querySelector<HTMLElement>(
      "[data-hero-incoming]",
    );
    const focusVeil = section?.querySelector<HTMLElement>(
      "[data-hero-focus-veil]",
    );
    if (
      !section ||
      !copy ||
      !background ||
      !visualLayer ||
      !incoming ||
      !focusVeil
    ) {
      return;
    }

    const layers = [background, copy, visualLayer, incoming, focusVeil];
    const forceMotion = isMotionDebugForced();
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: `(min-width: ${HERO_MOTION_CONFIG.breakpointPx}px)`,
          mobile: `(max-width: ${HERO_MOTION_CONFIG.breakpointPx - 1}px)`,
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (mediaContext) => {
          const conditions =
            (mediaContext.conditions as ParallaxMediaConditions | undefined) ??
            {};

          gsap.set(layers, {
            clearProps:
              "opacity,transform,transformOrigin,willChange",
          });

          if (conditions.reducedMotion && !forceMotion) return;

          const values = conditions.mobile
            ? HERO_MOTION_CONFIG.mobile
            : HERO_MOTION_CONFIG.desktop;

          gsap.set([background, visualLayer], {
            transformOrigin: "center center",
            willChange: "transform",
          });
          gsap.set(copy, {
            transformOrigin: "center center",
            willChange: "transform,opacity",
          });
          gsap.set(incoming, { willChange: "transform" });
          gsap.set(focusVeil, {
            opacity: 0,
            willChange: "opacity",
          });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: HERO_MOTION_CONFIG.scroll.start,
              end: HERO_MOTION_CONFIG.scroll.end,
              scrub: HERO_MOTION_CONFIG.scroll.scrub,
              pin: HERO_MOTION_CONFIG.scroll.pin,
              markers:
                isDevelopment &&
                HERO_MOTION_CONFIG.debug.heroParallaxDebug,
            },
          });

          timeline
            .to(
              background,
              { yPercent: values.backgroundYPercent, duration: 1 },
              0,
            )
            .to(copy, { yPercent: values.copyYPercent, duration: 1 }, 0)
            .to(
              visualLayer,
              { yPercent: values.visualYPercent, duration: 1 },
              0,
            )
            .fromTo(
              incoming,
              { yPercent: values.incomingStartYPercent },
              { yPercent: 0, duration: 1, immediateRender: true },
              0,
            )
            .to(
              focusVeil,
              {
                opacity: 1,
                duration: HERO_MOTION_CONFIG.focusPull.duration,
              },
              HERO_MOTION_CONFIG.focusPull.start,
            )
            .to(
              copy,
              {
                opacity: values.copyOpacityMin,
                duration: HERO_MOTION_CONFIG.copyFade.duration,
              },
              HERO_MOTION_CONFIG.copyFade.start,
            );

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
            gsap.set(layers, {
              clearProps:
                "opacity,transform,transformOrigin,willChange",
            });
          };
        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, [
    backgroundRef,
    copyRef,
    visualLayerRef,
    sectionRef,
  ]);
};
