/* Próximas experiencias y pop-up: se administran desde /admin y se guardan en Supabase. */
import { cacheLife, cacheTag } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";

export type ProximaRow = {
  id: string;
  titulo: string;
  paises: string[];
  descripcion: string;
  imagen: string;
  salida: string; // AAAA-MM-DD
  regreso: string;
  precio: string;
  cupos: number | null;
  visible: boolean;
};

export type PopupRow = {
  imagen: string;
  alt: string;
  enlace: string;
  activo: boolean;
  actualizado: string;
  titulo: string;
  texto: string;
  boton: string;
};

const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" }); // AAAA-MM-DD

/** Experiencias visibles que aún no han salido, de la más cercana a la más lejana. */
export async function getProximas(): Promise<ProximaRow[]> {
  "use cache";
  cacheTag("proximas");
  cacheLife("hours");
  const { data, error } = await supabasePublic()
    .from("proximas")
    .select("id,titulo,paises,descripcion,imagen,salida,regreso,precio,cupos,visible")
    .eq("visible", true)
    .gte("salida", today())
    .order("salida", { ascending: true });
  if (error) throw new Error(error.message);
  return data as ProximaRow[];
}

/** Pop-up activo, o null si no hay. */
export async function getPopup(): Promise<PopupRow | null> {
  "use cache";
  cacheTag("popup");
  cacheLife("hours");
  const { data, error } = await supabasePublic()
    .from("popup")
    .select("imagen,alt,enlace,activo,actualizado,titulo,texto,boton")
    .eq("activo", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as PopupRow | null;
}

const fmt = (d: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("es-CO", { timeZone: "UTC", ...opts });

/** "15 – 24 mar 2027" · "28 mar – 5 abr 2027" · "28 dic 2026 – 5 ene 2027" */
export function dateRange(salida: string, regreso: string) {
  const [y1, m1] = salida.split("-");
  const [y2, m2] = regreso.split("-");
  const clean = (s: string) => s.replace(/\./g, "").replace(/ de /g, " ");
  const end = clean(fmt(regreso, { day: "numeric", month: "short", year: "numeric" }));
  if (y1 !== y2) return `${clean(fmt(salida, { day: "numeric", month: "short", year: "numeric" }))} – ${end}`;
  if (m1 !== m2) return `${clean(fmt(salida, { day: "numeric", month: "short" }))} – ${end}`;
  return `${Number(salida.slice(8))} – ${end}`;
}

/** Días de viaje, contando salida y regreso. */
export const days = (salida: string, regreso: string) =>
  Math.round((Date.parse(regreso) - Date.parse(salida)) / 86_400_000) + 1;