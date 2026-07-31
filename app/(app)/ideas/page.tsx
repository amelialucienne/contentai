"use client";

import { useState } from "react";
import { Sparkles, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { LoadingSpinner } from "@/components/loading-spinner";
import { ContentCardSkeleton } from "@/components/skeletons";
import { useSettings } from "@/hooks/use-settings";
import type { ContentIdea } from "@/types";
import { IDEA_CATEGORY_LABELS, PLATFORM_LABELS } from "@/types";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState("");
  const [platform, setPlatform] = useState<string>("");
  const { settings } = useSettings();

  const handleGenerate = async () => {
    if (!company || !sector) {
      toast.error("Veuillez remplir l'entreprise et le secteur");
      return;
    }

    setLoading(true);
    setIdeas([]);
    try {
      const res = await fetch("/api/generate/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company || settings?.company_name,
          sector,
          platform: platform || undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      setIdeas(result.ideas);
      toast.success("10 idées générées avec succès !");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur de génération";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const groupedIdeas = ideas.reduce(
    (acc, idea) => {
      if (!acc[idea.category]) acc[idea.category] = [];
      acc[idea.category].push(idea);
      return acc;
    },
    {} as Record<string, ContentIdea[]>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Idées de contenu</h1>
        <p className="text-muted-foreground mt-1">
          Générez automatiquement 10 idées créatives classées par catégorie.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Générer des idées</CardTitle>
          <CardDescription>
            L&apos;IA créera 10 idées réparties en 6 catégories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Entreprise</Label>
              <Input
                placeholder={settings?.company_name || "Ma Société"}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Secteur</Label>
              <Input
                placeholder="Marketing digital"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Plateforme (optionnel)</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Générer 10 idées
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading &&
        Object.entries(groupedIdeas).map(([category, categoryIdeas]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              {IDEA_CATEGORY_LABELS[category as keyof typeof IDEA_CATEGORY_LABELS] ||
                category}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {categoryIdeas.map((idea) => (
                <Card key={idea.id} className="card-hover">
                  <CardHeader>
                    <CardTitle className="text-base">{idea.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {idea.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
