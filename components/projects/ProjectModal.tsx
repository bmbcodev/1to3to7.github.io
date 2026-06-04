"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ExternalLink, Github } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { supabase } from "@/lib/supabase";
import { GoldButton } from "@/components/ui/GoldButton";
import { ProjectReactions } from "@/components/projects/ProjectReactions";
import type { Project } from "@/types";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [commentName, setCommentName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const allImages = [project.cover_image, ...(project.images || [])].filter(Boolean) as string[];

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentBody.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from("comments").insert({
        project_id: project.id,
        name: commentName,
        body: commentBody,
      });
      setSuccess(true);
      setCommentName("");
      setCommentBody("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-bg border border-gold/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-bg/90 backdrop-blur-xl z-10 flex items-center justify-between p-4 border-b border-gold/10">
            <h2 className="text-xl font-heading font-bold text-white">{project.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gold transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {allImages.length > 0 && (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="rounded-xl overflow-hidden"
              >
                {allImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative h-72 sm:h-96 w-full">
                      <Image
                        src={img}
                        alt={`${project.title} image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            <p className="text-gray-300 font-body leading-relaxed">
              {project.long_description || project.description}
            </p>

            <div>
              <h3 className="text-sm text-gray-400 font-body mb-3">React to this project</h3>
              <ProjectReactions projectId={project.id} />
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs text-cyan bg-cyan/10 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                  <GoldButton className="!px-6 !py-2 !text-sm">
                    <ExternalLink className="w-4 h-4 inline mr-1" /> Live Demo
                  </GoldButton>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <GoldButton className="!px-6 !py-2 !text-sm !from-gray-600 !to-gray-400">
                    <Github className="w-4 h-4 inline mr-1" /> View Code
                  </GoldButton>
                </a>
              )}
            </div>

            <div className="border-t border-gold/10 pt-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">Leave a Comment</h3>
              {success && (
                <p className="text-green-400 text-sm mb-3">Comment submitted!</p>
              )}
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
                  required
                />
                <textarea
                  placeholder="Your Comment"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50 resize-none"
                  required
                />
                <GoldButton type="submit" loading={submitting} className="!px-6 !py-2 !text-sm">
                  Submit Comment
                </GoldButton>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
