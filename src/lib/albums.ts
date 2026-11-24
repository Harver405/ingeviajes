/* Álbumes de Experiencias: se administran desde /admin y se guardan en Supabase. */
import { cacheLife, cacheTag } from "next/cache";
import { countries } from "country-flag-icons";
import { supabasePublic } from "@/lib/supabase/public";

export type Album = { id: string; title: string; countries: string[]; detail: string; year: number; visible: boolean };

export type AlbumRow = { id: string; titulo: string; paises: string[]; detalle: string; anio: number; visible: boolean };

export const toAlbum = (r: AlbumRow): Album => ({
  id: r.id,
  title: r.titulo,
  countries: r.paises,
  detail: r.detalle,
  year: r.anio,
  visible: r.visible,
});

/** Álbumes visibles, del más reciente al más antiguo. Se guarda en caché y se renueva al editar en /admin. */
export async function getAlbums(): Promise<Album[]> {
  "use cache";
  cacheTag("albumes");
  cacheLife("hours");
  const { data, error } = await supabasePublic()
    .from("albumes")
    .select("id,titulo,paises,detalle,anio,visible")
    .eq("visible", true)
    .order("anio", { ascending: false })
    .order("creado", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as AlbumRow[]).map(toAlbum);
}

const names = new Intl.DisplayNames(["es"], { type: "region" });

/** Nombre del país en español a partir del código (CO → Colombia). */
export const countryName = (code: string) => names.of(code) ?? code;

/** "Brasil y Argentina" */
export const placeOf = (codes: string[]) => codes.map(countryName).join(" y ");

/** Países con bandera disponible, ordenados por nombre (para el selector del panel). */
export const countryOptions = () =>
  countries
    .filter((c) => /^[A-Z]{2}$/.test(c) && countryName(c) !== c)
    .map((code) => ({ code, name: countryName(code) }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

export const isCountry = (code: string) => countries.includes(code) && countryName(code) !== code;

/** Saca el número del álbum de cualquier enlace de Facebook (set=a.123, /a.123/, /albums/123) o del número solo. */
export function parseAlbumId(link: string): string | null {
  const s = link.trim();
  if (/^\d{6,}$/.test(s)) return s;
  return s.match(/(?:set=a\.|\/a\.|albums\/)(\d{6,})/)?.[1] ?? null;
}