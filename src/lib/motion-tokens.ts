// Preserve the existing studio rhythm; text presets share the same easing.
export const MOTION = { micro: .22, reveal: .62, section: .9, stagger: .08, ease: 'power3.out' } as const;
export const COMMERCIAL_MOTION = { priceScale: .94, priceOpacity: .7, imageOpacity: .45 } as const;
export const ESSENTIAL_MOTION = {
  perspective: 1000,
  desktop: { distance: 28, rotation: 4, scale: .975 },
  mobile: { distance: 36, rotation: 7, scale: .965 },
  cardDuration: 1.05,
  traceDuration: 1.45,
  sweepDuration: 1.2,
  sweepDelay: .16,
  childDistance: 16,
} as const;
export const TEXT_MOTION = {
  stagger: {char:.03, line:.1, word:.05},
  duration: .3,
  ease: [.22,1,.36,1] as [number,number,number,number],
  distance: 18,
  blur: 6,
  viewportAmount: .3,
  viewportMargin: '0px 0px -12% 0px',
  editorialDistance: 24,
  editorialOpacity: .35,
} as const;
