"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, ArrowRight } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import { onboardingSchema, type OnboardingFormData } from "@/lib/validations";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["company_name", "sector"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["brand_voice", "description"]);
      if (valid) setStep(3);
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      const { error } = await supabase
        .from("user_settings")
        .update({
          company_name: data.company_name,
          brand_voice: data.brand_voice,
          description: data.description,
          objectives: data.objectives,
          values: data.sector,
          onboarding_completed: true,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Configuration terminée !");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <Card className="w-full max-w-lg relative glass">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Bienvenue !</CardTitle>
          <CardDescription>
            Configurons votre espace en {3 - step + 1} étape
            {3 - step + 1 > 1 ? "s" : ""}
          </CardDescription>
          <div className="flex gap-2 justify-center mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? "w-8 bg-primary" : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label>Nom de l&apos;entreprise</Label>
                  <Input
                    placeholder="Ma Société"
                    {...register("company_name")}
                  />
                  {errors.company_name && (
                    <p className="text-sm text-destructive">
                      {errors.company_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Secteur d&apos;activité</Label>
                  <Input
                    placeholder="Technologie, Marketing..."
                    {...register("sector")}
                  />
                  {errors.sector && (
                    <p className="text-sm text-destructive">
                      {errors.sector.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Voix de marque</Label>
                  <Textarea
                    placeholder="Comment votre marque communique-t-elle ?"
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
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Décrivez votre entreprise..."
                    rows={3}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <Label>Objectifs</Label>
                <Textarea
                  placeholder="Quels sont vos objectifs sur les réseaux sociaux ?"
                  rows={3}
                  {...register("objectives")}
                />
                {errors.objectives && (
                  <p className="text-sm text-destructive">
                    {errors.objectives.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Retour
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={nextStep} className="flex-1">
                  Continuer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      Terminer
                      <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
