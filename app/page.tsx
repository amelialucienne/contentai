import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Calendar,
  Library,
  BarChart3,
  Shield,
  Unlock,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Génération IA instantanée",
    description:
      "Créez du contenu professionnel en quelques secondes pour vos réseaux sociaux.",
  },
  {
    icon: Calendar,
    title: "Calendrier éditorial",
    description:
      "Planifiez et organisez vos publications sur tous vos réseaux sociaux.",
  },
  {
    icon: Library,
    title: "Bibliothèque de contenus",
    description:
      "Sauvegardez, organisez et réutilisez tous vos contenus générés.",
  },
  {
    icon: BarChart3,
    title: "Multi-plateformes",
    description:
      "LinkedIn, Instagram, Facebook, X et TikTok — chaque plateforme optimisée.",
  },
  {
    icon: Shield,
    title: "Voix de marque",
    description:
      "Personnalisez le ton et le style pour refléter l'identité de votre entreprise.",
  },
  {
    icon: Sparkles,
    title: "Idées de contenu",
    description:
      "Générez automatiquement des idées créatives classées par catégorie.",
  },
];

const accessPoints = [
  {
    icon: Unlock,
    title: "100 % gratuit",
    description:
      "Aucun abonnement, aucune limite cachée. Toutes les fonctionnalités sont accessibles sans frais.",
  },
  {
    icon: Users,
    title: "Accès ouvert",
    description:
      "Chaque collaborateur peut créer un compte et utiliser l'outil librement.",
  },
  {
    icon: Building2,
    title: "Usage interne",
    description:
      "Conçu pour les équipes de l'entreprise : marketing, communication et direction.",
  },
];

const platforms = ["LinkedIn", "Instagram", "Facebook", "X", "TikTok"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Creadif Content AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Fonctionnalités
            </a>
            <a
              href="#access"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Accès libre
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                Accéder à l&apos;outil
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto max-w-4xl text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8 animate-fade-in">
            <Unlock className="h-3.5 w-3.5" />
            Outil interne — gratuit et ouvert
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Créez du contenu social{" "}
            <span className="gradient-text">exceptionnel</span> en quelques
            secondes
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
            Creadif Content AI est l&apos;outil de création de contenu de
            l&apos;entreprise. Gratuit, ouvert à tous les collaborateurs,
            optimisé pour LinkedIn, Instagram, Facebook, X et TikTok.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Button size="lg" asChild>
              <Link href="/register">
                Créer un compte
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
            {platforms.map((platform) => (
              <span key={platform} className="font-medium">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une suite complète d&apos;outils pour la communication de
              l&apos;entreprise sur les réseaux sociaux.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover border-border/50">
                <CardContent className="p-6">
                  <div className="rounded-lg bg-primary/10 w-10 h-10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free & Open Access */}
      <section id="access" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gratuit et ouvert pour toute l&apos;entreprise
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pas de formule payante, pas de restriction. Cet outil est mis à
              disposition de tous les collaborateurs pour faciliter la création
              de contenu.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {accessPoints.map((point) => (
              <Card key={point.title} className="card-hover border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                    <point.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{point.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à créer votre prochain contenu ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Connectez-vous ou créez un compte pour accéder à l&apos;outil —
            c&apos;est gratuit et immédiat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Créer un compte
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">Creadif Content AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Outil interne — usage libre et gratuit · © 2026 Creadif
          </p>
        </div>
      </footer>
    </div>
  );
}
