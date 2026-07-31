/**
 * Centralized prompt templates for OpenAI content generation.
 * Modify prompts here to adjust AI behavior across the application.
 */

import type {
  ContentFormData,
  SocialPlatform,
  UserSettings,
} from "@/types";

/** Platform-specific writing rules */
export const PLATFORM_RULES: Record<SocialPlatform, string> = {
  linkedin: `
LinkedIn Rules:
- Professional tone, thought leadership focus
- Use line breaks for readability (max 3-4 lines per paragraph)
- Start with a strong hook in the first 2 lines (visible before "see more")
- Include 3-5 relevant hashtags at the end
- Optimal length: 1300-2000 characters
- Encourage professional discussion in comments
- Avoid excessive emojis (max 2-3)
- Include data, statistics, or insights when possible`,

  instagram: `
Instagram Rules:
- Visual-first mindset, describe the visual context
- Engaging, authentic, and relatable tone
- Use emojis strategically (3-5)
- Include 20-30 hashtags (mix of popular and niche)
- Strong CTA (link in bio, comment, save, share)
- Short paragraphs with line breaks
- Optimal caption length: 150-300 words
- Include a question to boost engagement`,

  facebook: `
Facebook Rules:
- Conversational and community-focused tone
- Encourage sharing and comments
- Moderate length (100-250 words)
- Use 1-3 hashtags maximum
- Include a clear call-to-action
- Ask questions to spark discussion
- Friendly, approachable language
- Can include links and event references`,

  x: `
X (Twitter) Rules:
- Concise and punchy (max 280 characters for main post)
- Thread format for longer content
- Use 1-2 relevant hashtags
- Bold statements and hot takes work well
- Include a hook in the first line
- Encourage retweets and replies
- Direct, no-fluff language
- Can use emojis sparingly (1-2)`,

  tiktok: `
TikTok Rules:
- Casual, trendy, and energetic tone
- Script format for video content
- Hook in the first 3 seconds
- Use trending language and formats
- Include on-screen text suggestions
- Short, punchy sentences
- Strong CTA (follow, like, comment, duet)
- Include 3-5 trending hashtags
- Suggest background music mood`,
};

export function buildBrandContext(settings?: Partial<UserSettings>): string {
  if (!settings?.company_name) return "";

  return `
Brand Context (use this information to personalize content):
- Company: ${settings.company_name}
- Brand Voice: ${settings.brand_voice || "Not specified"}
- Values: ${settings.values || "Not specified"}
- Description: ${settings.description || "Not specified"}
- Objectives: ${settings.objectives || "Not specified"}
- Primary Color: ${settings.primary_color || "#3B82F6"}
`;
}

export function buildContentGenerationPrompt(
  data: ContentFormData,
  settings?: Partial<UserSettings>
): string {
  const platformRules = PLATFORM_RULES[data.platform];

  return `You are an expert social media content strategist and copywriter.

Generate professional social media content based on the following parameters:

COMPANY INFORMATION:
- Company: ${data.company}
- Sector: ${data.sector}
- Target Audience: ${data.targetAudience}
- Objective: ${data.objective}

CONTENT PARAMETERS:
- Platform: ${data.platform}
- Tone: ${data.tone}
- Length: ${data.length}
- Language: ${data.language}
- Call to Action: ${data.callToAction}
${data.additionalInfo ? `- Additional Info: ${data.additionalInfo}` : ""}

${buildBrandContext(settings)}

PLATFORM-SPECIFIC RULES:
${platformRules}

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "Catchy title for the content",
  "hook": "Attention-grabbing opening line",
  "fullPost": "Complete post ready to publish",
  "cta": "Call to action text",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "emoji": "Suggested emojis for the post",
  "shortVersion": "Condensed version of the post",
  "longVersion": "Extended version with more details",
  "improvementTips": ["Tip 1", "Tip 2", "Tip 3"]
}

Write all content in ${data.language}. Ensure the content is original, engaging, and optimized for ${data.platform}.`;
}

export function buildIdeasGenerationPrompt(
  company: string,
  sector: string,
  platform?: SocialPlatform,
  settings?: Partial<UserSettings>
): string {
  return `You are an expert social media content strategist.

Generate 10 creative content ideas for the following business:

- Company: ${company}
- Sector: ${sector}
${platform ? `- Primary Platform: ${platform}` : ""}

${buildBrandContext(settings)}

Generate exactly 10 ideas distributed across these categories:
- 2 Conseils (Tips/Advice)
- 2 Storytelling (Brand stories, behind-the-scenes)
- 1 Actualités (News/Trends)
- 2 Tutoriels (How-to/Tutorials)
- 1 FAQ (Frequently asked questions)
- 2 Études de cas (Case studies)

IMPORTANT: Respond ONLY with valid JSON array (no markdown, no code blocks):
[
  {
    "title": "Idea title",
    "description": "Detailed description of the content idea",
    "category": "conseils|storytelling|actualites|tutoriels|faq|etudes_de_cas"
  }
]

Write all content in French. Make ideas specific, actionable, and relevant to the sector.`;
}

export function buildImprovementPrompt(
  content: string,
  platform: SocialPlatform
): string {
  return `You are a social media optimization expert.

Analyze and improve this ${platform} post:

"${content}"

${PLATFORM_RULES[platform]}

Respond ONLY with valid JSON:
{
  "improvedPost": "The improved version",
  "changes": ["Change 1", "Change 2"],
  "score": 85
}`;
}
