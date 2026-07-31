import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * ⚠️ Ce client utilise la clé SUPABASE_SERVICE_ROLE_KEY, qui contourne
 * la Row Level Security (RLS). Il ne doit JAMAIS être importé dans un
 * composant "use client" ni exposé au navigateur — uniquement dans des
 * Route Handlers / Server Actions (dossier app/api/.../route.ts).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL manquant dans .env.local"
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
