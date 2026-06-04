"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageTransition } from "@/components/ui/PageTransition";
import { FollowButton } from "@/components/ui/FollowButton";
import { useFollowerStore } from "@/stores/useFollowerStore";
import { Brain, Cog, Code, Wrench, Search, Zap } from "lucide-react";

const skills = [
  { name: "Electric Vehicle Diagnostics", level: 95, icon: Zap },
  { name: "Vehicle Diagnostics", level: 90, icon: Cog },
  { name: "AI Prompt Engineering", level: 85, icon: Brain },
  { name: "Web Development", level: 80, icon: Code },
  { name: "Automotive Repair", level: 90, icon: Wrench },
  { name: "Technology Research", level: 85, icon: Search },
];

const timeline = [
  {
    year: "2024 - Present",
    title: "Founder & Lead Consultant",
    org: "BIA CO (Bizimana Idea Agency Company)",
    description: "Leading innovation in EV technology, AI solutions, and web development in Kigali, Rwanda.",
  },
  {
    year: "2022 - 2024",
    title: "A2 Certificate in Automobile Technology",
    org: "Ecole Technique de Kabgayi",
    description: "Specialized in automobile technology, vehicle diagnostics, and electric vehicle systems.",
  },
];

export default function AboutPage() {
  useVisitorTracker();
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState(false);
  const followerCount = useFollowerStore((s) => s.count);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from("site_settings").select("key, value");
        if (data) {
          data.forEach((s) => {
            if (s.key === "profile_image_url") setProfileImage(s.value || "");
            if (s.key === "bio") setBio(s.value || "");
          });
        }
      } catch {
        setError(true);
      }
    }
    load();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gold/50 p-1 mb-6">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gold/20 to-purple/20">
                {profileImage ? (
                  <Image src={profileImage} alt="BIZIMANA FILS" width={128} height={128} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-heading text-gold">BF</div>
                )}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent mb-4">
              BIZIMANA FILS
            </h1>
            <p className="text-lg text-gray-400 font-body max-w-2xl mx-auto mb-6">
              {bio || "Rwandan innovator, Electric Vehicle Technician, and AI Engineer passionate about bridging technology and automotive excellence."}
            </p>
            <FollowButton />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { label: "Projects", value: "10+" },
              { label: "Followers", value: followerCount.toLocaleString() },
              { label: "Years Experience", value: "3+" },
            ].map((stat) => (
              <GlassCard key={stat.label} className="p-6 text-center">
                <p className="text-3xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-400 font-body mt-1">{stat.label}</p>
              </GlassCard>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-heading font-bold text-white mb-8 text-center">Skills & Expertise</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <GlassCard key={skill.name} className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-5 h-5 text-gold" />
                      <h3 className="text-white font-body font-semibold">{skill.name}</h3>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-gold to-yellow-300 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block text-right">{skill.level}%</span>
                  </GlassCard>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-white mb-8 text-center">Timeline</h2>
            <div className="space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-gold/20 before:ml-0">
              {timeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-gold border-2 border-bg" />
                  <GlassCard className="p-5">
                    <span className="text-xs text-gold font-body">{item.year}</span>
                    <h3 className="text-lg font-heading font-semibold text-white mt-1">{item.title}</h3>
                    <p className="text-sm text-purple font-body">{item.org}</p>
                    <p className="text-sm text-gray-400 font-body mt-2">{item.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
