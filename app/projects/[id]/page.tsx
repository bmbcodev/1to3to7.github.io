"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { PageTransition } from "@/components/ui/PageTransition";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProjectReactions } from "@/components/projects/ProjectReactions";
import type { Project } from "@/types";

export default function ProjectDetailPage() {
  useVisitorTracker();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single();
        if (data) setProject(data as Project);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 font-body">Project not found</p>
        <Link href="/projects">
          <GoldButton className="!px-6 !py-2 !text-sm">Back to Projects</GoldButton>
        </Link>
      </div>
    );
  }

  const allImages = [project.cover_image, ...(project.images || [])].filter(Boolean) as string[];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-6 font-body">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent mb-4">
              {project.title}
            </h1>
            {project.category && (
              <span className="inline-block text-sm text-gold bg-gold/10 px-3 py-1 rounded-full font-body mb-6">
                {project.category}
              </span>
            )}
          </motion.div>

          {allImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="rounded-2xl overflow-hidden"
              >
                {allImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative h-72 sm:h-96 w-full">
                      <Image
                        src={img}
                        alt={`${project.title} image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 900px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                <h2 className="text-xl font-heading font-semibold text-white mb-4">About This Project</h2>
                <p className="text-gray-300 font-body leading-relaxed whitespace-pre-wrap">
                  {project.long_description || project.description}
                </p>
                <div className="mt-6 pt-6 border-t border-gold/10">
                  <h3 className="text-sm text-gray-400 font-body mb-3">React to this project</h3>
                  <ProjectReactions projectId={project.id} />
                </div>
              </GlassCard>
            </div>

            <div className="space-y-4">
              <GlassCard className="p-5">
                <h3 className="text-white font-body font-semibold mb-3">Links</h3>
                <div className="space-y-2">
                  {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gold hover:text-yellow-300 transition-colors">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gold hover:text-yellow-300 transition-colors">
                      <Github className="w-4 h-4" /> View Code
                    </a>
                  )}
                </div>
              </GlassCard>

              {project.tags && project.tags.length > 0 && (
                <GlassCard className="p-5">
                  <h3 className="text-white font-body font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs text-purple bg-purple/10 px-2.5 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              <GlassCard className="p-5">
                <h3 className="text-white font-body font-semibold mb-3">Status</h3>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  project.status === "active" ? "text-green-400 bg-green-500/10" :
                  project.status === "archived" ? "text-gray-400 bg-gray-500/10" :
                  "text-yellow-400 bg-yellow-500/10"
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
