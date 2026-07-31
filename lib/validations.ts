import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Nom requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Minimum 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const createUserSchema = z.object({
  fullName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  isAdmin: z.boolean().optional().default(false),
});

export const contentFormSchema = z.object({
  company: z.string().min(1, "Entreprise requise"),
  sector: z.string().min(1, "Secteur requis"),
  targetAudience: z.string().min(1, "Audience requise"),
  objective: z.enum([
    "awareness",
    "engagement",
    "leads",
    "sales",
    "community",
    "recruitment",
  ]),
  platform: z.enum(["linkedin", "instagram", "facebook", "x", "tiktok"]),
  tone: z.enum([
    "professional",
    "casual",
    "inspirational",
    "educational",
    "humorous",
    "authoritative",
  ]),
  length: z.enum(["short", "medium", "long"]),
  language: z.string().min(1, "Langue requise"),
  callToAction: z.string().min(1, "CTA requis"),
  additionalInfo: z.string().optional(),
});

export const settingsSchema = z.object({
  company_name: z.string().min(1, "Nom de l'entreprise requis"),
  logo_url: z.string().url("URL invalide").optional().or(z.literal("")),
  primary_color: z.string().min(1),
  secondary_color: z.string().min(1),
  brand_voice: z.string().min(1, "Voix de marque requise"),
  values: z.string().min(1, "Valeurs requises"),
  description: z.string().min(1, "Description requise"),
  objectives: z.string().min(1, "Objectifs requis"),
});

export const calendarSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  content: z.string().min(1, "Contenu requis"),
  platform: z.enum(["linkedin", "instagram", "facebook", "x", "tiktok"]),
  scheduled_date: z.string().min(1, "Date requise"),
  scheduled_time: z.string().min(1, "Heure requise"),
  status: z.enum(["draft", "scheduled", "published", "cancelled"]),
});

export const onboardingSchema = z.object({
  company_name: z.string().min(1, "Nom de l'entreprise requis"),
  sector: z.string().min(1, "Secteur requis"),
  brand_voice: z.string().min(1, "Voix de marque requise"),
  description: z.string().min(1, "Description requise"),
  objectives: z.string().min(1, "Objectifs requis"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ContentFormValues = z.infer<typeof contentFormSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type CalendarFormData = z.infer<typeof calendarSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
