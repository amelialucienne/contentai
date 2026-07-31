"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Copy,
  Trash2,
  CopyPlus,
  Library as LibraryIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageLoader } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
import { copyToClipboard, formatDate, truncate } from "@/lib/utils";
import type { SavedContent, SocialPlatform } from "@/types";
import { PLATFORM_LABELS } from "@/types";

export default function LibraryPage() {
  const [contents, setContents] = useState<SavedContent[]>([]);
  const [filtered, setFiltered] = useState<SavedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const supabase = createClient();

  const fetchContents = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("saved_contents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setContents(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    let result = contents;
    if (search) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.full_post.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (platformFilter !== "all") {
      result = result.filter((c) => c.platform === platformFilter);
    }
    setFiltered(result);
  }, [search, platformFilter, contents]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("saved_contents")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }

    toast.success("Contenu supprimé");
    fetchContents();
  };

  const handleDuplicate = async (content: SavedContent) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("saved_contents").insert({
      user_id: user.id,
      title: `${content.title} (copie)`,
      hook: content.hook,
      full_post: content.full_post,
      cta: content.cta,
      hashtags: content.hashtags,
      emoji: content.emoji,
      short_version: content.short_version,
      long_version: content.long_version,
      improvement_tips: content.improvement_tips,
      platform: content.platform,
      company: content.company,
      sector: content.sector,
    });

    if (error) {
      toast.error("Erreur lors de la duplication");
      return;
    }

    toast.success("Contenu dupliqué");
    fetchContents();
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    toast.success("Copié dans le presse-papiers");
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bibliothèque</h1>
        <p className="text-muted-foreground mt-1">
          Tous vos contenus générés, sauvegardés automatiquement.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contenu..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Plateforme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les plateformes</SelectItem>
            {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <LibraryIcon className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-sm">
              {contents.length === 0
                ? "Aucun contenu sauvegardé"
                : "Aucun résultat pour cette recherche"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((content) => (
            <Card key={content.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{content.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {PLATFORM_LABELS[content.platform as SocialPlatform]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(content.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(content.full_post)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicate(content)}
                    >
                      <CopyPlus className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Supprimer ce contenu ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(content.id)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {truncate(content.full_post, 200)}
                </p>
                {content.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {content.hashtags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
