import { Suspense } from "react";
import { connection } from "next/server";
import { adminClient } from "@/lib/admin";
import { mediaUrl } from "@/lib/media";
import type { PopupRow } from "@/lib/proximas";
import AdminShell, { NoAccess } from "../AdminShell";
import PopupForm from "./PopupForm";

export const metadata = { title: "Pop-up" };

export default function PopupPage() {
  return (
    <AdminShell
      title="Pop-up"
      intro="Afiche que aparece al entrar a la página, una vez por visita. Si lo cambias, vuelve a aparecerle a todos."
    >
      <Suspense fallback={<p className="mt-10 text-muted">Cargando…</p>}>
        <Panel />
      </Suspense>
    </AdminShell>
  );
}

async function Panel() {
  await connection();
  const supabase = await adminClient();
  if (!supabase) return <NoAccess />;
  const { data } = await supabase.from("popup").select("imagen,alt,enlace,activo,actualizado,titulo,texto,boton").maybeSingle();
  const popup = data as PopupRow | null;
  return <PopupForm popup={popup ? { ...popup, imageUrl: mediaUrl(popup.imagen) } : null} />;
}