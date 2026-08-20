export const PROJECTS_MOTION_CONFIG = {
  breakpointPx: 1024,
  scroll: {
    start: "top top",
    end: "+=100vh",
    scrub: 1,
    pin: false,
  },
  focusPull: {
    start: 0.25,
    duration: 0.75,
  },
  desktop: {
    outgoingYPercent: -4,
    outgoingScale: 1.025,
    incomingStartYPercent: 5,
  },
  debug: {
    markers: false,
  },
} as const;
