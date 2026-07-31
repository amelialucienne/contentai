import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// L'inscription libre a été désactivée : seul un administrateur
// peut créer un compte, depuis l'espace /admin.
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <Card className="w-full max-w-md relative glass">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
          <div className="flex justify-center mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Accès sur invitation</CardTitle>
          <CardDescription>
            L&apos;inscription libre est désactivée. Seul un administrateur
            peut créer votre compte collaborateur.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Contactez votre responsable pour qu&apos;il vous crée un accès.
            Vous recevrez ensuite un email et un mot de passe pour vous
            connecter.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Se connecter</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
