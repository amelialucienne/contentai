"use client";

import { useEffect, useState } from "react";
import { History as HistoryIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoader } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/utils";
import type { GenerationHistory } from "@/types";
import { PLATFORM_LABELS } from "@/types";

export default function HistoryPage() {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("generation_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setHistory(data || []);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Historique</h1>
        <p className="text-muted-foreground mt-1">
          Toutes vos générations IA passées.
        </p>
      </div>

      {history.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <HistoryIcon className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-sm">Aucune génération dans l&apos;historique</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const output = item.output_data as Record<string, unknown>;
            const title =
              item.type === "content"
                ? (output.title as string) || "Contenu généré"
                : "10 idées générées";

            return (
              <Card key={item.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                        {item.type === "content" ? "Contenu" : "Idées"}
                      </span>
                      {item.platform && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {
                            PLATFORM_LABELS[
                              item.platform as keyof typeof PLATFORM_LABELS
                            ]
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(item.created_at)}
                  </p>
                  {item.type === "content" &&
                    typeof output.fullPost === "string" && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {output.fullPost}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
