"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { ParticlesBg } from "@/components/ui/ParticlesBg";
import { useAuthStore } from "@/stores/useAuthStore";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { RwandaEntrance } from "@/components/ui/RwandaEntrance";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { NavLoadingProvider, useNavLoading } from "@/components/ui/NavLoadingContext";
import { NavigationProgress } from "@/components/ui/NavigationProgress";

function ProvidersInner({ children }: { children: React.ReactNode }) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [showRwanda, setShowRwanda] = useState(false);
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const { stopLoading, startLoading } = useNavLoading();

  useEffect(() => {
    checkAuth();
    const timer = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/login")) {
        prevPath.current = pathname;
        stopLoading();
        return;
      }
      setShowRwanda(true);
      prevPath.current = pathname;
      const t = setTimeout(() => { setShowRwanda(false); stopLoading(); }, 700);
      return () => clearTimeout(t);
    }
  }, [pathname, stopLoading]);

  useEffect(() => {
    function handleGlobalClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
      if (target.target === "_blank") return;
      startLoading();
    }
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [startLoading]);

  const sidebarMargin = "md:ml-[72px]";
  const mobileBottomPad = "pb-20 md:pb-0";

  return (
    <>
      <NavigationProgress visible={!initialLoading} />
      <AnimatePresence mode="wait">
        {initialLoading && <LoadingScreen />}
      </AnimatePresence>
      <AnimatePresence>
        {showRwanda && <RwandaEntrance />}
      </AnimatePresence>
      {!initialLoading && (
        <>
          <ParticlesBg />
          <Navbar />
          <Sidebar />
          <main className={`min-h-screen ${sidebarMargin} ${mobileBottomPad}`}>
            {children}
          </main>
          <Footer />
          <AIAssistant />
        </>
      )}
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NavLoadingProvider>
      <ProvidersInner>{children}</ProvidersInner>
    </NavLoadingProvider>
  );
}
