"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isLocalMode, localList, localDelete } from "@/lib/safeSupabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { PageTransition } from "@/components/ui/PageTransition";
import { Upload, Trash2, Download, FileIcon, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import type { ProjectFile, Message } from "@/types";

export default function DashboardFilesPage() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    try {
      if (!isLocalMode()) {
        const { data } = await supabase.from("files").select("*").order("created_at", { ascending: false });
        if (data) { setFiles(data as ProjectFile[]); setLoading(false); return; }
      }
    } catch {}
    setFiles(localList<ProjectFile>("files"));
    setUnreadCount(localList<any>("messages").filter((m: any) => !m.is_read).length);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (file: ProjectFile) => {
    if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return;
    try {
      if (!isLocalMode() && file.storage_path) {
        await supabase.storage.from("uploads").remove([file.storage_path]);
        await supabase.from("files").delete().eq("id", file.id);
      }
      localDelete("files", file.id);
      load();
    } catch {
      localDelete("files", file.id);
      load();
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
            Files Manager
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/messages"
              className="relative p-2.5 rounded-xl bg-white/5 border border-gold/10 hover:bg-gold/10 hover:border-gold/30 transition-all text-gray-400 hover:text-gold"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
            <GoldButton onClick={() => setShowUploader(!showUploader)} className="!px-4 !py-2.5 !text-sm">
              <Upload className="w-4 h-4 mr-1.5 inline" /> Upload
            </GoldButton>
          </div>
        </div>

        {showUploader && (
          <GlassCard className="p-6">
            <FileUploader onSuccess={() => { setShowUploader(false); load(); }} />
          </GlassCard>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <FileIcon className="w-12 h-12 mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400 font-body">No files uploaded yet.</p>
          </GlassCard>
        ) : (
          <div className="grid gap-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-gold/10 hover:bg-white/[0.07] hover:border-gold/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-body font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    {file.file_type && <span className="uppercase">{file.file_type}</span>}
                    {file.file_size && <span>{(file.file_size / 1024).toFixed(1)} KB</span>}
                    <span>{file.download_count || 0} downloads</span>
                    <span className="hidden sm:inline">{format(new Date(file.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-cyan hover:bg-cyan/10 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(file)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete from storage"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
