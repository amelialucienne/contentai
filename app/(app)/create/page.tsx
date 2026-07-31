"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useSettings } from "@/hooks/use-settings";
import { contentFormSchema, type ContentFormValues } from "@/lib/validations";
import { copyToClipboard } from "@/lib/utils";
import type { GeneratedContent } from "@/types";
import {
  PLATFORM_LABELS,
  TONE_LABELS,
  OBJECTIVE_LABELS,
  LENGTH_LABELS,
} from "@/types";

export default function CreateContentPage() {
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      company: settings?.company_name || "",
      language: "Français",
      platform: "linkedin",
      tone: "professional",
      length: "medium",
      objective: "engagement",
    },
  });

  const onSubmit = async (data: ContentFormValues) => {
    setLoading(true);
    setGenerated(null);
    try {
      const res = await fetch("/api/generate/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      setGenerated(result.content);
      toast.success("Contenu généré avec succès !");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur de génération";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    toast.success("Copié dans le presse-papiers");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Créer du contenu</h1>
        <p className="text-muted-foreground mt-1">
          Remplissez le formulaire et laissez l&apos;IA générer votre contenu.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du contenu</CardTitle>
            <CardDescription>
              Définissez les caractéristiques de votre publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Entreprise</Label>
                  <Input placeholder="Ma Société" {...register("company")} />
                  {errors.company && (
                    <p className="text-sm text-destructive">
                      {errors.company.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Secteur</Label>
                  <Input placeholder="Technologie" {...register("sector")} />
                  {errors.sector && (
                    <p className="text-sm text-destructive">
                      {errors.sector.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Audience cible</Label>
                <Input
                  placeholder="Dirigeants d'entreprise, 35-55 ans"
                  {...register("targetAudience")}
                />
                {errors.targetAudience && (
                  <p className="text-sm text-destructive">
                    {errors.targetAudience.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Objectif</Label>
                  <Select
                    value={watch("objective")}
                    onValueChange={(v) =>
                      setValue("objective", v as ContentFormValues["objective"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(OBJECTIVE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Réseau social</Label>
                  <Select
                    value={watch("platform")}
                    onValueChange={(v) =>
                      setValue("platform", v as ContentFormValues["platform"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Ton</Label>
                  <Select
                    value={watch("tone")}
                    onValueChange={(v) =>
                      setValue("tone", v as ContentFormValues["tone"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TONE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Longueur</Label>
                  <Select
                    value={watch("length")}
                    onValueChange={(v) =>
                      setValue("length", v as ContentFormValues["length"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LENGTH_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Input {...register("language")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Call To Action</Label>
                <Input
                  placeholder="Visitez notre site web"
                  {...register("callToAction")}
                />
                {errors.callToAction && (
                  <p className="text-sm text-destructive">
                    {errors.callToAction.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Informations complémentaires</Label>
                <Textarea
                  placeholder="Contexte additionnel, événements, promotions..."
                  rows={3}
                  {...register("additionalInfo")}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Générer
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner size="lg" text="L'IA génère votre contenu..." />
              </CardContent>
            </Card>
          )}

          {generated && !loading && (
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{generated.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {generated.emoji}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(generated.fullPost)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="full">
                  <TabsList className="w-full">
                    <TabsTrigger value="full" className="flex-1">
                      Complet
                    </TabsTrigger>
                    <TabsTrigger value="short" className="flex-1">
                      Court
                    </TabsTrigger>
                    <TabsTrigger value="long" className="flex-1">
                      Long
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="full" className="mt-4 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Hook
                      </Label>
                      <p className="mt-1 text-sm font-medium">
                        {generated.hook}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Post
                      </Label>
                      <p className="mt-1 text-sm whitespace-pre-wrap">
                        {generated.fullPost}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        CTA
                      </Label>
                      <p className="mt-1 text-sm">{generated.cta}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {generated.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="short" className="mt-4">
                    <p className="text-sm whitespace-pre-wrap">
                      {generated.shortVersion}
                    </p>
                  </TabsContent>
                  <TabsContent value="long" className="mt-4">
                    <p className="text-sm whitespace-pre-wrap">
                      {generated.longVersion}
                    </p>
                  </TabsContent>
                </Tabs>

                {generated.improvementTips.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <Label className="text-xs text-muted-foreground">
                      Conseils d&apos;amélioration
                    </Label>
                    <ul className="mt-2 space-y-1">
                      {generated.improvementTips.map((tip, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!generated && !loading && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Sparkles className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-sm">
                  Le contenu généré apparaîtra ici
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
