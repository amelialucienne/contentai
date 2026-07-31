"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoader } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
import { useSettings } from "@/hooks/use-settings";
import { settingsSchema, type SettingsFormData } from "@/lib/validations";

export default function SettingsPage() {
  const { settings, loading, refetch } = useSettings();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (settings) {
      reset({
        company_name: settings.company_name,
        logo_url: settings.logo_url || "",
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        brand_voice: settings.brand_voice,
        values: settings.values,
        description: settings.description,
        objectives: settings.objectives,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("user_settings")
      .update({
        ...data,
        logo_url: data.logo_url || null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
      return;
    }

    toast.success("Paramètres sauvegardés");
    refetch();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Configurez votre entreprise et votre voix de marque. Ces informations
          seront utilisées automatiquement dans les prompts IA.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Entreprise</CardTitle>
            <CardDescription>
              Informations de base sur votre entreprise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de l&apos;entreprise</Label>
              <Input {...register("company_name")} />
              {errors.company_name && (
                <p className="text-sm text-destructive">
                  {errors.company_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Logo (URL)</Label>
              <Input
                placeholder="https://example.com/logo.png"
                {...register("logo_url")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Couleur principale</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-12 p-1" {...register("primary_color")} />
                  <Input {...register("primary_color")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Couleur secondaire</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-12 p-1" {...register("secondary_color")} />
                  <Input {...register("secondary_color")} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voix de marque</CardTitle>
            <CardDescription>
              Définissez le ton et l&apos;identité de votre marque
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Voix de marque</Label>
              <Textarea
                placeholder="Professionnel mais accessible, expert mais pédagogue..."
                rows={3}
                {...register("brand_voice")}
              />
              {errors.brand_voice && (
                <p className="text-sm text-destructive">
                  {errors.brand_voice.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Valeurs</Label>
              <Textarea
                placeholder="Innovation, transparence, excellence..."
                rows={2}
                {...register("values")}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Décrivez votre entreprise et ses activités..."
                rows={3}
                {...register("description")}
              />
            </div>
            <div className="space-y-2">
              <Label>Objectifs</Label>
              <Textarea
                placeholder="Augmenter la notoriété, générer des leads..."
                rows={2}
                {...register("objectives")}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4" />
          {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </form>
    </div>
  );
}
