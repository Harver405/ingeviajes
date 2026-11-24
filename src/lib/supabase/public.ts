import { createClient } from "@supabase/supabase-js";

/* Cliente de solo lectura para el sitio público (sin sesión ni cookies). */
export function supabasePublic() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}