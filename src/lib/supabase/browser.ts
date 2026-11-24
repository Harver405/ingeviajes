import { createBrowserClient } from "@supabase/ssr";

/* Cliente del navegador (usa la sesión del administrador). Solo para subir imágenes desde el panel. */
export function supabaseBrowser() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}