"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { RwandaBackground } from "./RwandaBackground";
import { HeroSection } from "./HeroSection";
import { ProjectsCarousel } from "./ProjectsCarousel";
import type { Project, SocialLink } from "@/types";

export function HomePage() {
  useVisitorTracker();
  const [bgImages, setBgImages] = useState<string[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, socialRes, projectsRes] = await Promise.all([
          supabase.from("site_settings").select("key, value"),
          supabase.from("social_links").select("*").eq("is_active", true).order("sort_order"),
          supabase.from("projects").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(10),
        ]);

        if (settingsRes.data) {
          settingsRes.data.forEach((s) => {
            if (s.key === "rwanda_bg_images" && s.value) {
              try { setBgImages(JSON.parse(s.value)); } catch { setBgImages([]); }
            }
            if (s.key === "logo_url") setLogoUrl(s.value || "");
            if (s.key === "profile_image_url") setProfileImageUrl(s.value || "");
          });
        }

        if (socialRes.data) setSocialLinks(socialRes.data);
        if (projectsRes.data) setProjects(projectsRes.data);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <>
      <RwandaBackground images={bgImages} />
      <HeroSection
        logoUrl={logoUrl}
        profileImageUrl={profileImageUrl}
        socialLinks={socialLinks}
      />
      <ProjectsCarousel projects={projects} />
    </>
  );
}
