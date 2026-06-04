"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { SocialLink } from "@/types";

interface SocialLinksEditorProps {
  links: SocialLink[];
  onRefresh: () => void;
}

export function SocialLinksEditor({ links, onRefresh }: SocialLinksEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ platform: "", url: "", icon: "", sort_order: links.length + 1 });

  const updateLink = async (id: string, field: string, value: string | boolean | number) => {
    await supabase.from("social_links").update({ [field]: value, updated_at: new Date().toISOString() }).eq("id", id);
    onRefresh();
  };

  const deleteLink = async (id: string) => {
    await supabase.from("social_links").delete().eq("id", id);
    onRefresh();
  };

  const addLink = async () => {
    if (!newLink.platform || !newLink.url) return;
    await supabase.from("social_links").insert({
      platform: newLink.platform,
      url: newLink.url,
      icon: newLink.icon || null,
      sort_order: newLink.sort_order,
    });
    setNewLink({ platform: "", url: "", icon: "", sort_order: links.length + 2 });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <GlassCard key={link.id} className="p-4">
          <div className="flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => updateLink(link.id, "platform", e.target.value)}
                className="px-3 py-1.5 bg-white/5 border border-gold/20 rounded-lg text-white text-sm font-body focus:outline-none focus:border-gold/50"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(link.id, "url", e.target.value)}
                className="px-3 py-1.5 bg-white/5 border border-gold/20 rounded-lg text-white text-sm font-body md:col-span-2 focus:outline-none focus:border-gold/50"
              />
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.is_active}
                    onChange={(e) => updateLink(link.id, "is_active", e.target.checked)}
                    className="w-4 h-4 rounded border-gold/30 bg-white/5 text-gold focus:ring-gold"
                  />
                  Active
                </label>
                <button onClick={() => deleteLink(link.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg ml-auto">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      ))}

      <GlassCard className="p-4">
        <h4 className="text-white font-body font-semibold mb-3">Add New Link</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={newLink.platform}
            onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
            placeholder="Platform"
            className="px-3 py-1.5 bg-white/5 border border-gold/20 rounded-lg text-white text-sm font-body focus:outline-none focus:border-gold/50"
          />
          <input
            type="url"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            placeholder="URL"
            className="px-3 py-1.5 bg-white/5 border border-gold/20 rounded-lg text-white text-sm font-body md:col-span-2 focus:outline-none focus:border-gold/50"
          />
          <GoldButton onClick={addLink} className="!px-4 !py-1.5 !text-sm">
            <Plus className="w-4 h-4 mr-1" /> Add
          </GoldButton>
        </div>
      </GlassCard>
    </div>
  );
}
