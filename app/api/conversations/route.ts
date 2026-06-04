import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fingerprint = searchParams.get("fingerprint");

    if (!fingerprint) {
      return NextResponse.json({ error: "fingerprint is required" }, { status: 400 });
    }

    const { data: messagesData, error } = await getSupabaseAdmin()
      .from("messages")
      .select("*, message_replies(*)")
      .eq("fingerprint", fingerprint)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const { data: sessionData } = await getSupabaseAdmin()
      .from("user_sessions")
      .select("*")
      .eq("fingerprint", fingerprint)
      .maybeSingle();

    const messages = (messagesData || []) as Record<string, unknown>[];
    const messageReplies = (msg: Record<string, unknown>) =>
      ((msg.message_replies as Record<string, unknown>[]) || []).map((reply) => ({
        id: reply.id as string,
        message_id: reply.message_id as string,
        sender: reply.sender as string,
        body: reply.body as string,
        created_at: reply.created_at as string,
      }));

    const conversations = messages.map((msg) => ({
      message: {
        id: msg.id as string,
        name: msg.name as string,
        email: msg.email as string,
        subject: msg.subject as string | null,
        body: msg.body as string,
        fingerprint: msg.fingerprint as string | null,
        is_read: msg.is_read as boolean,
        created_at: msg.created_at as string,
      },
      replies: messageReplies(msg),
      userSession: sessionData || null,
    }));

    return NextResponse.json({ conversations });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load conversations" }, { status: 500 });
  }
}
