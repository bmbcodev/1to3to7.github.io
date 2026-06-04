"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getOrCreateFingerprint } from "@/lib/fingerprint";

export function useVisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const track = async () => {
      try {
        const fingerprint = getOrCreateFingerprint();
        await supabase.from("visitors").insert({
          page: pathname,
          fingerprint,
          referrer: document.referrer || null,
        });
      } catch (err) {
        console.error("Visitor tracking failed:", err);
      }
    };
    track();
  }, [pathname]);
}
