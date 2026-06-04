"use client";

import { useEffect, useRef } from "react";
import { getOrCreateFingerprint } from "@/lib/fingerprint";

export function useHeartbeat(name?: string) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const beat = async () => {
      try {
        const fingerprint = getOrCreateFingerprint();
        await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fingerprint, name: name || null }),
        });
      } catch (err) {
        console.error("Heartbeat failed:", err);
      }
    };

    beat();
    intervalRef.current = setInterval(beat, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") beat();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const handleBeforeUnload = () => {
      navigator.sendBeacon("/api/sessions", JSON.stringify({
        fingerprint: getOrCreateFingerprint(),
        is_online: false,
      }));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [name]);
}
