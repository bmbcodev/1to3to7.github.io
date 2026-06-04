"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { PageTransition } from "@/components/ui/PageTransition";
import { FollowButton } from "@/components/ui/FollowButton";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const categories = ["All", "Web Dev", "Automotive", "AI", "Other"];

export default function ProjectsPage() {
  useVisitorTracker();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });
        if (data) setProjects(data as Project[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent mb-4">
              Projects
            </h1>
            <p className="text-gray-400 font-body mb-6">Explore my work across EV technology, AI, and web development</p>
            <FollowButton />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-body transition-all duration-300 border",
                  activeCategory === cat
                    ? "bg-gold/10 text-gold border-gold/50"
                    : "text-gray-400 border-transparent hover:text-gold hover:border-gold/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 font-body py-20">No projects found in this category.</p>
          ) : (
            <ProjectGrid projects={filtered} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
