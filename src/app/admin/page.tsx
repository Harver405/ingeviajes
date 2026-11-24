import { Suspense } from "react";
import { connection } from "next/server";
import { adminClient } from "@/lib/admin";
import { countryOptions, placeOf, toAlbum, type AlbumRow } from "@/lib/albums";
import CountryFlags from "@/components/ui/CountryFlags";
import AdminShell, { NoAccess } from "./AdminShell";
import AlbumManager from "./AlbumManager";

export default function AdminPage() {
  return (
    <AdminShell title="Álbumes" intro="Álbumes de Facebook que se muestran en Experiencias.">
      <Suspense fallback={<p className="mt-10 text-muted">Cargando…</p>}>
        <Panel />
      </Suspense>
    </AdminShell>
  );
}

async function Panel() {
  await connection(); // el panel siempre se genera en cada visita (depende de la sesión)
  const supabase = await adminClient();
  if (!supabase) return <NoAccess />;

  const { data } = await supabase
    .from("albumes")
    .select("id,titulo,paises,detalle,anio,visible")
    .order("anio", { ascending: false })
    .order("creado", { ascending: false });

  const albums = ((data ?? []) as AlbumRow[]).map(toAlbum).map((a) => ({
    ...a,
    place: placeOf(a.countries),
    flags: <CountryFlags codes={a.countries} />,
  }));

  return <AlbumManager albums={albums} countries={countryOptions()} />;
}