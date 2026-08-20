const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

export const isMotionDebugForced = (): boolean => {
  if (typeof window === "undefined") return false;
  if (!LOCAL_HOSTNAMES.has(window.location.hostname)) return false;

  return new URLSearchParams(window.location.search).get("forceMotion") === "1";
};
