import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [contents, calendar, ideas, history] = await Promise.all([
      supabase
        .from("saved_contents")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("calendar_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "scheduled"),
      supabase
        .from("content_ideas")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("generation_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    return NextResponse.json({
      totalContents: contents.count || 0,
      scheduledPosts: calendar.count || 0,
      savedIdeas: ideas.count || 0,
      recentHistory: history.data || [],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des statistiques" },
      { status: 500 }
    );
  }
}
