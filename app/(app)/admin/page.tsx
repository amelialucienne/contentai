import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminCreateUserForm } from "./create-user-form";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: settings } = await supabase
    .from("user_settings")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (!settings?.is_admin) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gestion des accès</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Créez un compte pour un nouveau collaborateur. Communiquez-lui
          ensuite son email et son mot de passe.
        </p>
      </div>
      <AdminCreateUserForm />
    </div>
  );
}
