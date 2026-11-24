/* Acceso del administrador (solo servidor). */
import { supabaseServer } from "@/lib/supabase/server";

/** Cliente con sesión si el usuario es administrador; si no, null. */
export async function adminClient() {
  const supabase = await supabaseServer();
  const { data } = await supabase.rpc("es_admin");
  return data === true ? supabase : null;
}

/** Igual que adminClient, pero lanza un error si no tiene permiso (para acciones). */
export async function requireAdmin() {
  const supabase = await adminClient();
  if (!supabase) throw new Error("Sin permiso");
  return supabase;
}