"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkAuth();
    setChecked(true);
  }, [checkAuth]);

  useEffect(() => {
    if (checked && !isAuthenticated) {
      router.push("/login");
    }
  }, [checked, isAuthenticated, router]);

  if (!checked || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
