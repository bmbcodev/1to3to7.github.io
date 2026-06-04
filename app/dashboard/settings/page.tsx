"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { SocialLinksEditor } from "@/components/dashboard/SocialLinksEditor";
import { PageTransition } from "@/components/ui/PageTransition";
import type { SocialLink } from "@/types";

export default function DashboardSettingsPage() {
  const [logoUrl, setLogoUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    try {
      const [settingsRes, socialRes] = await Promise.all([
        supabase.from("site_settings").select("key, value"),
        supabase.from("social_links").select("*").order("sort_order"),
      ]);

      if (settingsRes.data) {
        settingsRes.data.forEach((s) => {
          if (s.key === "logo_url") setLogoUrl(s.value || "");
          if (s.key === "profile_image_url") setProfileImageUrl(s.value || "");
          if (s.key === "bio") setBio(s.value || "");
        });
      }
      if (socialRes.data) setSocialLinks(socialRes.data as SocialLink[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const saveBio = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase.from("site_settings").select("id").eq("key", "bio").single();
      if (existing) {
        await supabase.from("site_settings").update({ value: bio, updated_at: new Date().toISOString() }).eq("key", "bio");
      } else {
        await supabase.from("site_settings").insert({ key: "bio", value: bio });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
          Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <ImageUploader label="Logo" settingKey="logo_url" currentUrl={logoUrl} onSuccess={load} />
          </GlassCard>
          <GlassCard className="p-6">
            <ImageUploader label="Profile Image" settingKey="profile_image_url" currentUrl={profileImageUrl} onSuccess={load} />
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <h2 className="text-lg font-heading font-semibold text-white mb-4">Bio</h2>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50 resize-none mb-3"
            placeholder="Write your bio here..."
          />
          <GoldButton onClick={saveBio} loading={saving} className="!px-6 !py-2 !text-sm">
            {saved ? "Saved!" : "Save Bio"}
          </GoldButton>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-heading font-semibold text-white mb-4">Social Links</h2>
          <SocialLinksEditor links={socialLinks} onRefresh={load} />
        </GlassCard>
      </div>
    </PageTransition>
  );
}
