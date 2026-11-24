import { Suspense } from "react";
import { connection } from "next/server";
import { adminClient } from "@/lib/admin";
import { countryOptions, placeOf } from "@/lib/albums";
import { mediaUrl } from "@/lib/media";
import { dateRange, type ProximaRow } from "@/lib/proximas";
import CountryFlags from "@/components/ui/CountryFlags";
import AdminShell, { NoAccess } from "../AdminShell";
import ProximasManager from "./ProximasManager";

export const metadata = { title: "Próximas salidas" };

export default function ProximasPage() {
  return (
    <AdminShell
      title="Próximas salidas"
      intro="Viajes que se promocionan en la página. Desaparecen solos cuando pasa la fecha de salida."
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

  const { data } = await supabase
    .from("proximas")
    .select("id,titulo,paises,descripcion,imagen,salida,regreso,precio,cupos,visible")
    .order("salida", { ascending: true });

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
  const trips = ((data ?? []) as ProximaRow[]).map((t) => ({
    ...t,
    place: placeOf(t.paises),
    when: dateRange(t.salida, t.regreso),
    imageUrl: mediaUrl(t.imagen),
    past: t.salida < today,
    flags: <CountryFlags codes={t.paises} />,
  }));

  return <ProximasManager trips={trips} countries={countryOptions()} />;
}