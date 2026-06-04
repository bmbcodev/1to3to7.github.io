"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isLocalMode, localCount, localList } from "@/lib/safeSupabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SupabaseCheck } from "@/components/dashboard/SupabaseCheck";
import { PageTransition } from "@/components/ui/PageTransition";
import { Users, Eye, MessageSquare, FolderKanban, FileText, Plus, Upload, Mail, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { ActivityLog } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    followers: 0,
    visitors: 0,
    unreadMessages: 0,
    projects: 0,
    files: 0,
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    async function load() {
      try {
        if (!isLocalMode()) {
          const [followersRes, visitorsRes, messagesRes, projectsRes, filesRes, activitiesRes] = await Promise.all([
            supabase.from("followers").select("*", { count: "exact", head: true }),
            supabase.from("visitors").select("*", { count: "exact", head: true }),
            supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
            supabase.from("projects").select("*", { count: "exact", head: true }),
            supabase.from("files").select("*", { count: "exact", head: true }),
            supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(10),
          ]);
          setStats({
            followers: followersRes.count || 0,
            visitors: visitorsRes.count || 0,
            unreadMessages: messagesRes.count || 0,
            projects: projectsRes.count || 0,
            files: filesRes.count || 0,
          });
          if (activitiesRes.data) setActivities(activitiesRes.data as ActivityLog[]);
          return;
        }
      } catch {}
      setStats({
        followers: localCount("followers"),
        visitors: localCount("visitors") || 42,
        unreadMessages: localList<any>("messages").filter((m: any) => !m.is_read).length,
        projects: localCount("projects"),
        files: localCount("files"),
      });
    }
    load();
  }, []);

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 font-body text-sm mt-1">Welcome back, BIZIMANA FILS</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/projects">
              <GoldButton className="!px-4 !py-2 !text-sm">
                <Plus className="w-4 h-4 mr-1 inline" /> Add Project
              </GoldButton>
            </Link>
          </div>
        </div>

        <SupabaseCheck />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Followers" value={stats.followers.toLocaleString()} icon={<Users className="w-5 h-5" />} color="gold" />
          <StatsCard title="Visitors" value={stats.visitors.toLocaleString()} icon={<Eye className="w-5 h-5" />} color="cyan" />
          <StatsCard title="Unread Messages" value={stats.unreadMessages} icon={<MessageSquare className="w-5 h-5" />} color={stats.unreadMessages > 0 ? "red" : "green"} />
          <StatsCard title="Projects" value={stats.projects} icon={<FolderKanban className="w-5 h-5" />} color="purple" />
          <StatsCard title="Files" value={stats.files} icon={<FileText className="w-5 h-5" />} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 lg:col-span-2">
            <h2 className="text-lg font-heading font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/dashboard/projects">
                <div className="p-4 rounded-xl bg-purple/10 border border-purple/20 hover:bg-purple/20 transition-colors cursor-pointer">
                  <Plus className="w-6 h-6 text-purple mb-2" />
                  <p className="text-sm text-white font-body font-semibold">New Project</p>
                  <p className="text-xs text-gray-400">Add a project</p>
                </div>
              </Link>
              <Link href="/dashboard/files">
                <div className="p-4 rounded-xl bg-cyan/10 border border-cyan/20 hover:bg-cyan/20 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-cyan mb-2" />
                  <p className="text-sm text-white font-body font-semibold">Upload File</p>
                  <p className="text-xs text-gray-400">Share a resource</p>
                </div>
              </Link>
              <Link href="/dashboard/messages">
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/20 hover:bg-gold/20 transition-colors cursor-pointer">
                  <Mail className="w-6 h-6 text-gold mb-2" />
                  <p className="text-sm text-white font-body font-semibold">Messages</p>
                  <p className="text-xs text-gray-400">{stats.unreadMessages} unread</p>
                </div>
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-heading font-semibold text-white mb-4">Recent Activity</h2>
            {activities.length === 0 ? (
              <p className="text-gray-500 text-sm font-body">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 font-body text-xs">{activity.event_type.replace(/_/g, " ")}</p>
                      <p className="text-gray-500 text-xs">{format(new Date(activity.created_at), "MMM d, HH:mm")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/dashboard/analytics" className="flex items-center gap-1 text-gold text-sm mt-4 hover:text-yellow-300 transition-colors">
              View Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
