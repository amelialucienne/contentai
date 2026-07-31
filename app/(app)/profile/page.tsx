"use client";

import { useUser } from "@/hooks/use-user";
import { PageLoader } from "@/components/loading-spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user, loading } = useUser();

  if (loading) return <PageLoader />;

  const userName = user?.user_metadata?.full_name as string | undefined;
  const initials = userName
    ? userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{userName || "Utilisateur"}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-medium">{userName || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Membre depuis</p>
              <p className="font-medium">
                {user?.created_at ? formatDate(user.created_at) : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ID utilisateur</p>
              <p className="font-medium text-xs font-mono truncate">
                {user?.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
