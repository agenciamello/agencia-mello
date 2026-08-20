import React, { useEffect, useRef } from "react";
import { isMotionDebugForced } from "../../utils/motionDebug";
import type { MelloTubesScene as MelloTubesSceneInstance } from "../../three/MelloTubesScene";

export const MelloTubesHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !isMotionDebugForced();
    container.dataset.tubesState = "loading";
    let scene: MelloTubesSceneInstance | null = null;
    let cancelled = false;

    void import("../../three/MelloTubesScene").then(
      ({ MelloTubesScene }) => {
        if (cancelled) return;
        try {
          scene = new MelloTubesScene(container, {
            reducedMotion: reduceMotion,
            onReady: () => {
              container.dataset.tubesState = reduceMotion ? "static" : "ready";
            },
            onMetrics: ({ fps, drawCalls, triangles, dpr }) => {
              container.dataset.fps = String(fps);
              container.dataset.drawCalls = String(drawCalls);
              container.dataset.triangles = String(triangles);
              container.dataset.dpr = String(dpr);
            },
            onError: () => {
              container.dataset.tubesState = "error";
            },
          });
        } catch {
          container.dataset.tubesState = "error";
        }
      },
      () => {
        if (!cancelled) container.dataset.tubesState = "error";
      },
    );

    return () => {
      cancelled = true;
      scene?.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mello-tubes-hero absolute inset-0 z-0 overflow-hidden bg-[#050505] [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
      data-tubes-state="idle"
      aria-hidden="true"
    />
  );
};
