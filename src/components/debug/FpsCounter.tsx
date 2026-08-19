import React, { useEffect, useRef } from "react";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);
const isViteDevelopment = (
  import.meta as ImportMeta & { readonly env: { readonly DEV: boolean } }
).env.DEV;

export const FpsCounter: React.FC = () => {
  const valueRef = useRef<HTMLSpanElement>(null);
  const isLocalRuntime =
    isViteDevelopment || LOCAL_HOSTNAMES.has(window.location.hostname);

  useEffect(() => {
    if (!isLocalRuntime) return;

    let animationFrameId = 0;
    let frameCount = 0;
    let intervalStartedAt = performance.now();

    const measureFps = (now: number) => {
      frameCount += 1;
      const elapsed = now - intervalStartedAt;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        if (valueRef.current) valueRef.current.textContent = `FPS: ${fps}`;
        frameCount = 0;
        intervalStartedAt = now;
      }

      animationFrameId = requestAnimationFrame(measureFps);
    };

    animationFrameId = requestAnimationFrame(measureFps);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isLocalRuntime]);

  if (!isLocalRuntime) return null;

  return (
    <span
      ref={valueRef}
      className="pointer-events-none fixed bottom-3 left-3 z-[9999] rounded bg-black/70 px-2 py-1 font-mono text-[11px] leading-none text-white/70"
      aria-live="off"
    >
      FPS: 00
    </span>
  );
};
