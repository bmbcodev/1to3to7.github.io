"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PageTransition } from "@/components/ui/PageTransition";
import { Users, Eye, BarChart3, Globe } from "lucide-react";

export default function DashboardAnalyticsPage() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [dailyVisits, setDailyVisits] = useState<{ date: string; count: number }[]>([]);
  const [topPages, setTopPages] = useState<{ page: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [visitorsRes, followersRes] = await Promise.all([
          supabase.from("visitors").select("*", { count: "exact", head: true }),
          supabase.from("followers").select("*", { count: "exact", head: true }),
        ]);

        setTotalVisitors(visitorsRes.count || 0);
        setTotalFollowers(followersRes.count || 0);

        const { data: allVisitors } = await supabase
          .from("visitors")
          .select("created_at, page, country")
          .order("created_at", { ascending: false });

        if (allVisitors) {
          const dayMap: Record<string, number> = {};
          const pageMap: Record<string, number> = {};

          allVisitors.forEach((v) => {
            const date = new Date(v.created_at).toISOString().split("T")[0];
            dayMap[date] = (dayMap[date] || 0) + 1;
            const page = v.page || "/";
            pageMap[page] = (pageMap[page] || 0) + 1;
          });

          setDailyVisits(
            Object.entries(dayMap)
              .sort(([a], [b]) => a.localeCompare(b))
              .slice(-30)
              .map(([date, count]) => ({ date, count }))
          );

          setTopPages(
            Object.entries(pageMap)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([page, count]) => ({ page, count }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const maxVisit = Math.max(...dailyVisits.map((d) => d.count), 1);
  const maxPage = Math.max(...topPages.map((p) => p.count), 1);

  return (
    <PageTransition>
      <div className="space-y-8">
        <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
          Analytics
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Visitors" value={totalVisitors.toLocaleString()} icon={<Eye className="w-5 h-5" />} color="cyan" />
          <StatsCard title="Total Followers" value={totalFollowers.toLocaleString()} icon={<Users className="w-5 h-5" />} color="gold" />
          <StatsCard title="Avg Daily" value={dailyVisits.length > 0 ? Math.round(dailyVisits.reduce((a, b) => a + b.count, 0) / dailyVisits.length) : 0} icon={<BarChart3 className="w-5 h-5" />} color="purple" />
          <StatsCard title="Pages Tracked" value={topPages.length} icon={<Globe className="w-5 h-5" />} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h2 className="text-lg font-heading font-semibold text-white mb-4">Visitors (Last 30 Days)</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : dailyVisits.length === 0 ? (
              <p className="text-gray-500 text-sm font-body">No data yet</p>
            ) : (
              <div className="flex items-end gap-1 h-32">
                {dailyVisits.map((day) => (
                  <div
                    key={day.date}
                    className="flex-1 bg-gradient-to-t from-gold/30 to-gold/10 rounded-t hover:from-gold/50 transition-colors relative group"
                    style={{ height: `${(day.count / maxVisit) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gold opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {day.count}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-heading font-semibold text-white mb-4">Top Pages</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : topPages.length === 0 ? (
              <p className="text-gray-500 text-sm font-body">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topPages.map((page) => (
                  <div key={page.page} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-body truncate">{page.page}</span>
                      <span className="text-gray-500">{page.count}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple to-cyan rounded-full transition-all"
                        style={{ width: `${(page.count / maxPage) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
