"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Calendar,
  Lightbulb,
  PenTool,
  ArrowRight,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/skeletons";
import { formatDateTime } from "@/lib/utils";
import type { DashboardStats } from "@/types";
import { PLATFORM_LABELS } from "@/types";

const quickActions = [
  {
    title: "Créer un contenu",
    description: "Générez un nouveau post avec l'IA",
    href: "/create",
    icon: PenTool,
  },
  {
    title: "Calendrier",
    description: "Planifiez vos publications",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Idées de contenu",
    description: "Générez des idées créatives",
    href: "/ideas",
    icon: Lightbulb,
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue sur votre espace de création de contenu.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Contenus créés"
          value={stats?.totalContents || 0}
          icon={FileText}
          description="Total dans la bibliothèque"
        />
        <StatCard
          title="Publications programmées"
          value={stats?.scheduledPosts || 0}
          icon={Calendar}
          description="Dans le calendrier"
        />
        <StatCard
          title="Idées enregistrées"
          value={stats?.savedIdeas || 0}
          icon={Lightbulb}
          description="Idées sauvegardées"
        />
        <StatCard
          title="Générations récentes"
          value={stats?.recentHistory?.length || 0}
          icon={Clock}
          description="Dernières activités"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-all duration-200 hover:bg-accent hover:border-primary/20 group"
              >
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
            <CardDescription>Vos dernières générations IA</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentHistory && stats.recentHistory.length > 0 ? (
              <div className="space-y-3">
                {stats.recentHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {item.type === "content" ? "Contenu" : "Idées"}
                        {item.platform &&
                          ` — ${PLATFORM_LABELS[item.platform as keyof typeof PLATFORM_LABELS]}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(item.created_at)}
                      </p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune génération pour le moment</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/create">Créer votre premier contenu</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
