"use client";

import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <GlassCard onClick={onClick} className="overflow-hidden">
      {project.cover_image && (
        <div className="relative h-48 w-full">
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          {project.category && (
            <span className="text-xs font-body text-gold bg-gold/10 px-2 py-1 rounded-full">
              {project.category}
            </span>
          )}
          <span className={`text-xs font-body px-2 py-1 rounded-full ${
            project.status === "active" ? "text-green-400 bg-green-500/10" :
            project.status === "archived" ? "text-gray-400 bg-gray-500/10" :
            "text-yellow-400 bg-yellow-500/10"
          }`}>
            {project.status}
          </span>
        </div>
        <h3 className="text-lg font-heading font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-sm text-gray-400 font-body line-clamp-2 mb-3">{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs text-purple bg-purple/10 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="text-gold text-sm font-body hover:text-yellow-300 transition-colors"
        >
          See More &rarr;
        </button>
      </div>
    </GlassCard>
  );
}
