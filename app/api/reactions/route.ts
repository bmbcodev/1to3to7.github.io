import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { project_id, fingerprint, emoji } = await request.json();
    if (!project_id || !fingerprint || !emoji) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("reactions").insert({
      project_id,
      fingerprint,
      emoji,
    } as never);

    if (error) {
      if (error.code === "23505") {
        const { error: deleteError } = await supabase
          .from("reactions")
          .delete()
          .eq("project_id", project_id)
          .eq("fingerprint", fingerprint)
          .eq("emoji", emoji);
        if (deleteError) throw deleteError;
        return NextResponse.json({ removed: true });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 });
  }
}
