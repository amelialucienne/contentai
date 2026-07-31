import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateIdeas } from "@/services/openai";
import { z } from "zod";

const ideasSchema = z.object({
  company: z.string().min(1),
  sector: z.string().min(1),
  platform: z
    .enum(["linkedin", "instagram", "facebook", "x", "tiktok"])
    .optional(),
});

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
    const validated = ideasSchema.parse(body);

    const { data: settings } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const ideas = await generateIdeas(
      validated.company,
      validated.sector,
      validated.platform,
      settings || undefined
    );

    // Save ideas to database
    const ideasToInsert = ideas.map((idea) => ({
      user_id: user.id,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      platform: idea.platform || null,
    }));

    await supabase.from("content_ideas").insert(ideasToInsert);

    // Save to history
    await supabase.from("generation_history").insert({
      user_id: user.id,
      type: "ideas",
      input_data: validated,
      output_data: { ideas },
    });

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Generate ideas error:", error);
    const message =
      error instanceof Error ? error.message : "Erreur de génération";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
