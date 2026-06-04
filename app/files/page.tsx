"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageTransition } from "@/components/ui/PageTransition";
import { FileText, Image, Video, Archive, Download, FileIcon } from "lucide-react";
import { format } from "date-fns";
import type { ProjectFile } from "@/types";

const fileIconMap: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-8 h-8 text-red-400" />,
  image: <Image className="w-8 h-8 text-purple" />,
  video: <Video className="w-8 h-8 text-cyan" />,
  zip: <Archive className="w-8 h-8 text-gold" />,
  other: <FileIcon className="w-8 h-8 text-gray-400" />,
};

export default function FilesPage() {
  useVisitorTracker();
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("files")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setFiles(data as ProjectFile[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fileTypes = ["all", ...new Set(files.map((f) => f.file_type || "other"))];
  const filtered = filter === "all" ? files : files.filter((f) => f.file_type === filter);

  const handleDownload = async (file: ProjectFile) => {
    try {
      await supabase
        .from("files")
        .update({ download_count: (file.download_count || 0) + 1 })
        .eq("id", file.id);
      window.open(file.file_url, "_blank");
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, download_count: (f.download_count || 0) + 1 } : f
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent mb-4">
              Downloads
            </h1>
            <p className="text-gray-400 font-body">Resources, documents, and files available for download</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {fileTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-body transition-all duration-300 border ${
                  filter === type
                    ? "bg-gold/10 text-gold border-gold/50"
                    : "text-gray-400 border-transparent hover:text-gold hover:border-gold/20"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 font-body py-20">No files found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((file) => (
                <GlassCard key={file.id} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {file.file_type ? fileIconMap[file.file_type] || fileIconMap.other : fileIconMap.other}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-body font-semibold truncate">{file.name}</h3>
                      {file.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{file.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{formatSize(file.file_size)}</span>
                        <span>{file.download_count || 0} downloads</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file)}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-xl hover:bg-gold/20 transition-colors text-sm font-body"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
