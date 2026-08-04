"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function DashboardRealtime() {
  const router = useRouter();
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient(); let channel: ReturnType<typeof supabase.channel> | undefined;
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      channel = supabase.channel(`dashboard:${user.id}`).on("postgres_changes", { event: "*", schema: "public", table: "workout_sessions", filter: `user_id=eq.${user.id}` }, () => router.refresh()).subscribe();
    });
    return () => { if (channel) void supabase.removeChannel(channel); };
  }, [router]);
  return null;
}
