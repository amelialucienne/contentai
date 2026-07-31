import OpenAI from "openai";
import {
  buildContentGenerationPrompt,
  buildIdeasGenerationPrompt,
} from "./promptGenerator";
import type {
  ContentFormData,
  ContentIdea,
  GeneratedContent,
  SocialPlatform,
  UserSettings,
} from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function parseJSON<T>(content: string): T {
  const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

export async function generateContent(
  data: ContentFormData,
  settings?: Partial<UserSettings>
): Promise<GeneratedContent> {
  const prompt = buildContentGenerationPrompt(data, settings);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert social media content creator. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Aucune réponse de l'IA");

  return parseJSON<GeneratedContent>(content);
}

export async function generateIdeas(
  company: string,
  sector: string,
  platform?: SocialPlatform,
  settings?: Partial<UserSettings>
): Promise<ContentIdea[]> {
  const prompt = buildIdeasGenerationPrompt(company, sector, platform, settings);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert social media strategist. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.9,
    max_tokens: 2500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Aucune réponse de l'IA");

  const ideas = parseJSON<
    Array<{ title: string; description: string; category: string }>
  >(content);

  return ideas.map((idea, index) => ({
    id: `idea-${Date.now()}-${index}`,
    title: idea.title,
    description: idea.description,
    category: idea.category as ContentIdea["category"],
    platform,
  }));
}
