import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateContent } from "@/services/openai";
import { contentFormSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validated = contentFormSchema.parse(body);

    const { data: settings } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const content = await generateContent(validated, settings || undefined);

    // Save to library
    await supabase.from("saved_contents").insert({
      user_id: user.id,
      title: content.title,
      hook: content.hook,
      full_post: content.fullPost,
      cta: content.cta,
      hashtags: content.hashtags,
      emoji: content.emoji,
      short_version: content.shortVersion,
      long_version: content.longVersion,
      improvement_tips: content.improvementTips,
      platform: validated.platform,
      company: validated.company,
      sector: validated.sector,
    });

    // Save to history
    await supabase.from("generation_history").insert({
      user_id: user.id,
      type: "content",
      input_data: validated,
      output_data: content,
      platform: validated.platform,
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Generate content error:", error);
    const message =
      error instanceof Error ? error.message : "Erreur de génération";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
