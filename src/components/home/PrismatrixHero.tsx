import React, { useEffect, useRef } from "react";
import { PRISMATRIX_ASSET_PATH } from "../../config/prismatrixHeroConfig";
import type { PrismatrixScene as PrismatrixSceneInstance } from "../../three/PrismatrixScene";

export const PrismatrixHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.dataset.prismatrixState = "loading";
    let scene: PrismatrixSceneInstance | null = null;
    let cancelled = false;

    void import("../../three/PrismatrixScene").then(
      ({ PrismatrixScene }) => {
        if (cancelled) return;

        scene = new PrismatrixScene(container, {
          onReady: () => {
            container.dataset.prismatrixState = "ready";
          },
          onMetrics: ({ fps, drawCalls, triangles, dpr }) => {
            container.dataset.fps = String(fps);
            container.dataset.drawCalls = String(drawCalls);
            container.dataset.triangles = String(triangles);
            container.dataset.dpr = String(dpr);
          },
          onError: () => {
            container.dataset.prismatrixState = "error";
          },
        });

        scene.loadModel(PRISMATRIX_ASSET_PATH);
      },
      () => {
        if (!cancelled) {
          container.dataset.prismatrixState = "error";
        }
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
      className="pointer-events-none absolute inset-0 z-0 bg-[#050505] [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
      data-prismatrix-state="idle"
      aria-hidden="true"
    />
  );
};
