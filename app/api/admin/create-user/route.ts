import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const createUserBodySchema = z.object({
  fullName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  isAdmin: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  // 1. Vérifier que la personne qui appelle est bien connectée
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // 2. Vérifier que c'est bien un administrateur
  const { data: requesterSettings } = await supabase
    .from("user_settings")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (!requesterSettings?.is_admin) {
    return NextResponse.json(
      { error: "Réservé aux administrateurs" },
      { status: 403 }
    );
  }

  // 3. Valider les données envoyées
  const body = await request.json();
  const parsed = createUserBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }
  const { fullName, email, password, isAdmin } = parsed.data;

  // 4. Créer le compte avec la clé service_role (contourne le besoin
  //    de confirmation email et ne connecte pas l'admin à sa place)
  const adminClient = createAdminClient();
  const { data: created, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Erreur lors de la création du compte" },
      { status: 400 }
    );
  }

  // 5. Créer la ligne user_settings associée
  const { error: settingsError } = await adminClient
    .from("user_settings")
    .insert({
      user_id: created.user.id,
      company_name: "",
      is_admin: isAdmin,
    });

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, userId: created.user.id });
}
