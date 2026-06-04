"use client";

import { useEffect } from "react";
import { useFollowerStore } from "@/stores/useFollowerStore";

export function useFollowers() {
  const fetchCount = useFollowerStore((s) => s.fetchCount);
  const checkFollowStatus = useFollowerStore((s) => s.checkFollowStatus);
  const count = useFollowerStore((s) => s.count);
  const isFollowing = useFollowerStore((s) => s.isFollowing);
  const toggleFollow = useFollowerStore((s) => s.toggleFollow);
  const isLoading = useFollowerStore((s) => s.isLoading);

  useEffect(() => {
    fetchCount();
    checkFollowStatus();
  }, [fetchCount, checkFollowStatus]);

  return { count, isFollowing, toggleFollow, isLoading };
}
