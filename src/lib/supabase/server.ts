import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/* Cliente con la sesión del administrador (lee y escribe cookies). */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // En un componente de servidor no se pueden escribir cookies; proxy.ts las renueva
        }
      },
    },
  });
}