"use client";

import { useEffect, useRef } from "react";

const POLL_INTERVAL = 60 * 1000;

export function usePolling(callback: () => void) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    cbRef.current();

    const interval = setInterval(() => cbRef.current(), POLL_INTERVAL);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        cbRef.current();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onFocus = () => cbRef.current();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
}
