export const HERO_MOTION_CONFIG = {
  breakpointPx: 768,
  scroll: {
    start: "top top",
    end: "bottom top",
    scrub: 1,
    pin: false,
  },
  copyFade: {
    start: 0.7,
    duration: 0.3,
  },
  focusPull: {
    start: 0.2,
    duration: 0.8,
  },
  debug: {
    heroParallaxDebug: false,
  },
  desktop: {
    backgroundYPercent: 14,
    copyYPercent: -4,
    copyOpacityMin: 0.65,
    visualYPercent: 8,
    incomingStartYPercent: 6,
  },
  mobile: {
    backgroundYPercent: 8,
    copyYPercent: -2,
    copyOpacityMin: 0.85,
    visualYPercent: 4,
    incomingStartYPercent: 4,
  },
} as const;
