"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ProjectForm } from "@/components/dashboard/ProjectForm";
import { PageTransition } from "@/components/ui/PageTransition";
import { Plus, Edit3, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import type { Project } from "@/types";

export default function DashboardProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (data) setProjects(data as Project[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    load();
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
            Projects Manager
          </h1>
          <GoldButton onClick={() => { setEditing(null); setShowForm(true); }} className="!px-4 !py-2 !text-sm">
            <Plus className="w-4 h-4 mr-1 inline" /> Add Project
          </GoldButton>
        </div>

        {showForm && (
          <GlassCard className="p-6">
            <ProjectForm
              project={editing}
              onSuccess={() => { setShowForm(false); setEditing(null); load(); }}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </GlassCard>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-gray-400 font-body">No projects yet. Create your first project!</p>
          </GlassCard>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10">
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal">Image</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal">Title</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal hidden md:table-cell">Status</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal hidden lg:table-cell">Date</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-body font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-gold/5 hover:bg-white/5">
                    <td className="py-3 px-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5">
                        {project.cover_image ? (
                          <Image src={project.cover_image} alt="" width={48} height={48} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-white font-body font-medium">{project.title}</p>
                      <p className="text-gray-500 text-xs truncate max-w-[200px]">{project.description}</p>
                    </td>
                    <td className="py-3 px-2 text-gray-400 hidden md:table-cell">{project.category || "—"}</td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        project.status === "active" ? "text-green-400 bg-green-500/10" :
                        project.status === "draft" ? "text-yellow-400 bg-yellow-500/10" :
                        "text-gray-400 bg-gray-500/10"
                      }`}>{project.status}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-500 text-xs hidden lg:table-cell">{format(new Date(project.created_at), "MMM d, yyyy")}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditing(project); setShowForm(true); }} className="p-1.5 text-cyan hover:bg-cyan/10 rounded-lg transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a href={`/projects/${project.id}`} target="_blank" className="p-1.5 text-gold hover:bg-gold/10 rounded-lg transition-colors" title="View">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
