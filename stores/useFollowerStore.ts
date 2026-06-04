import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { isLocalMode, localCount, localIsFollowing, localFollowToggle, localList, localSet, localInsert, localDelete } from "@/lib/safeSupabase";
import { getOrCreateFingerprint } from "@/lib/fingerprint";

interface FollowerState {
  count: number;
  isFollowing: boolean;
  isLoading: boolean;
  error: string | null;
  fetchCount: () => Promise<void>;
  checkFollowStatus: () => Promise<void>;
  toggleFollow: () => Promise<void>;
}

export const useFollowerStore = create<FollowerState>((set, get) => ({
  count: 0,
  isFollowing: false,
  isLoading: false,
  error: null,

  fetchCount: async () => {
    try {
      if (!isLocalMode()) {
        const { count, error } = await supabase.from("followers").select("*", { count: "exact", head: true });
        if (error && !error.message?.includes("Failed to fetch")) throw error;
        if (count) { set({ count }); return; }
      }
      set({ count: localCount("followers") });
    } catch (err) {
      set({ count: localCount("followers") });
    }
  },

  checkFollowStatus: async () => {
    try {
      const fingerprint = getOrCreateFingerprint();
      if (!isLocalMode()) {
        const { data, error } = await supabase.from("followers").select("id").eq("fingerprint", fingerprint).single();
        if (!error || error.code === "PGRST116") { set({ isFollowing: !!data }); return; }
      }
      set({ isFollowing: localIsFollowing(fingerprint) });
    } catch {
      set({ isFollowing: localIsFollowing(getOrCreateFingerprint()) });
    }
  },

  toggleFollow: async () => {
    const { isFollowing } = get();
    set({ isLoading: true, error: null });
    try {
      const fingerprint = getOrCreateFingerprint();
      if (!isLocalMode()) {
        if (isFollowing) {
          await supabase.from("followers").delete().eq("fingerprint", fingerprint);
        } else {
          const { error } = await supabase.from("followers").insert({ fingerprint });
          if (error?.code === "23505") { set({ isFollowing: true }); set({ isLoading: false }); return; }
        }
      }
      const result = localFollowToggle(fingerprint);
      set({ isFollowing: result.isFollowing, count: localCount("followers") });
    } catch {
      const result = localFollowToggle(getOrCreateFingerprint());
      set({ isFollowing: result.isFollowing, count: localCount("followers") });
    } finally {
      set({ isLoading: false });
    }
  },
}));
