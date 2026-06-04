import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { message_id, body, sender } = await request.json();

    if (!message_id || !body) {
      return NextResponse.json({ error: "message_id and body are required" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("message_replies")
      .insert({
        message_id,
        sender: sender || "founder",
        body,
      } as never)
      .select()
      .single();

    if (error) throw error;

    await getSupabaseAdmin()
      .from("messages")
      .update({ is_read: true } as never)
      .eq("id", message_id);

    return NextResponse.json({ reply: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
