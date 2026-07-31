export type SocialPlatform =
  | "linkedin"
  | "instagram"
  | "facebook"
  | "x"
  | "tiktok";

export type ContentTone =
  | "professional"
  | "casual"
  | "inspirational"
  | "educational"
  | "humorous"
  | "authoritative";

export type ContentLength = "short" | "medium" | "long";

export type ContentObjective =
  | "awareness"
  | "engagement"
  | "leads"
  | "sales"
  | "community"
  | "recruitment";

export type IdeaCategory =
  | "conseils"
  | "storytelling"
  | "actualites"
  | "tutoriels"
  | "faq"
  | "etudes_de_cas";

export type CalendarStatus = "draft" | "scheduled" | "published" | "cancelled";

export interface GeneratedContent {
  title: string;
  hook: string;
  fullPost: string;
  cta: string;
  hashtags: string[];
  emoji: string;
  shortVersion: string;
  longVersion: string;
  improvementTips: string[];
}

export interface ContentFormData {
  company: string;
  sector: string;
  targetAudience: string;
  objective: ContentObjective;
  platform: SocialPlatform;
  tone: ContentTone;
  length: ContentLength;
  language: string;
  callToAction: string;
  additionalInfo?: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  platform?: SocialPlatform;
}

export interface SavedContent {
  id: string;
  user_id: string;
  title: string;
  hook: string;
  full_post: string;
  cta: string;
  hashtags: string[];
  emoji: string;
  short_version: string;
  long_version: string;
  improvement_tips: string[];
  platform: SocialPlatform;
  company: string;
  sector: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  platform: SocialPlatform;
  scheduled_date: string;
  scheduled_time: string;
  status: CalendarStatus;
  created_at: string;
  updated_at: string;
}

export interface GenerationHistory {
  id: string;
  user_id: string;
  type: "content" | "ideas";
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  platform?: SocialPlatform;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  company_name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  brand_voice: string;
  values: string;
  description: string;
  objectives: string;
  onboarding_completed: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalContents: number;
  scheduledPosts: number;
  savedIdeas: number;
  recentHistory: GenerationHistory[];
}

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X (Twitter)",
  tiktok: "TikTok",
};

export const PLATFORM_ICONS: Record<SocialPlatform, string> = {
  linkedin: "Linkedin",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "Twitter",
  tiktok: "Music2",
};

export const IDEA_CATEGORY_LABELS: Record<IdeaCategory, string> = {
  conseils: "Conseils",
  storytelling: "Storytelling",
  actualites: "Actualités",
  tutoriels: "Tutoriels",
  faq: "FAQ",
  etudes_de_cas: "Études de cas",
};

export const TONE_LABELS: Record<ContentTone, string> = {
  professional: "Professionnel",
  casual: "Décontracté",
  inspirational: "Inspirant",
  educational: "Éducatif",
  humorous: "Humoristique",
  authoritative: "Autoritaire",
};

export const OBJECTIVE_LABELS: Record<ContentObjective, string> = {
  awareness: "Notoriété",
  engagement: "Engagement",
  leads: "Génération de leads",
  sales: "Ventes",
  community: "Communauté",
  recruitment: "Recrutement",
};

export const LENGTH_LABELS: Record<ContentLength, string> = {
  short: "Court",
  medium: "Moyen",
  long: "Long",
};

export const STATUS_LABELS: Record<CalendarStatus, string> = {
  draft: "Brouillon",
  scheduled: "Programmé",
  published: "Publié",
  cancelled: "Annulé",
};
