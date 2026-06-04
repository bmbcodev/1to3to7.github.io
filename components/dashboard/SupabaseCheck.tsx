"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function SupabaseCheck() {
  const [results, setResults] = useState<{ label: string; ok: boolean; detail: string }[]>([]);

  useEffect(() => {
    async function check() {
      const checks: { label: string; ok: boolean; detail: string }[] = [];

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      checks.push({
        label: "Supabase URL",
        ok: !!url && !url.includes("placeholder"),
        detail: url?.includes("placeholder") ? "Still using placeholder URL" : url || "Not set",
      });
      checks.push({
        label: "Anon Key",
        ok: !!anonKey && !anonKey.includes("placeholder"),
        detail: anonKey?.includes("placeholder") ? "Still using placeholder key — replace with real anon key from Supabase dashboard" : "Configured",
      });
      checks.push({
        label: "Service Role Key",
        ok: !!serviceKey && !serviceKey.includes("placeholder"),
        detail: serviceKey?.includes("placeholder") ? "Still using placeholder key — replace with real service_role key from Supabase dashboard" : "Configured",
      });

      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const hasUploads = buckets?.some((b) => b.name === "uploads");
        checks.push({
          label: "Storage: uploads bucket",
          ok: !!hasUploads,
          detail: hasUploads ? "Bucket exists" : "Create an 'uploads' bucket in Supabase Storage (public)",
        });
      } catch {
        checks.push({
          label: "Storage: uploads bucket",
          ok: false,
          detail: "Cannot connect — check anon key",
        });
      }

      try {
        const { data } = await supabase.from("site_settings").select("id").limit(1);
        checks.push({
          label: "Database tables",
          ok: !(data === null && anonKey?.includes("placeholder")),
          detail: data !== null ? "Tables accessible" : "Run schema.sql in Supabase SQL Editor",
        });
      } catch {
        checks.push({
          label: "Database tables",
          ok: false,
          detail: "Cannot query — run schema.sql in Supabase SQL Editor",
        });
      }

      setResults(checks);
    }
    check();
  }, []);

  if (results.length === 0) return null;

  const allOk = results.every((r) => r.ok);
  if (allOk) return null;

  return (
    <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-white font-heading font-semibold">Supabase Configuration Required</h3>
          <p className="text-gray-400 text-sm font-body mt-0.5">Set these up for uploads, messages, and analytics to work:</p>
        </div>
      </div>
      <div className="space-y-2">
        {results.map((r) => (
          <div key={r.label} className="flex items-start gap-2 text-sm">
            {r.ok ? (
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <span className={r.ok ? "text-green-400" : "text-red-400"}>{r.label}</span>
              <span className="text-gray-500 ml-2">{r.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
