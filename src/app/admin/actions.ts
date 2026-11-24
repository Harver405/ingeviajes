"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { isCountry, parseAlbumId } from "@/lib/albums";
import { getAlbumInfo } from "@/lib/facebook";

export type Result = {
  ok?: boolean;
  error?: string;
  value?: string; // lo que el usuario escribió, para no borrarlo si hay error
  album?: { id: string; name: string; count: number };
};

/** Cliente con sesión, solo si el usuario está registrado como administrador. */
async function admin() {
  const supabase = await supabaseServer();
  const { data } = await supabase.rpc("es_admin");
  if (data !== true) throw new Error("Sin permiso");
  return supabase;
}

function done() {
  updateTag("albumes"); // el sitio público se actualiza de inmediato
  revalidatePath("/admin");
}

export async function login(_: Result, form: FormData): Promise<Result> {
  const email = String(form.get("email") ?? "").trim();
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password: String(form.get("password") ?? "") });
  if (error) return { error: "Correo o contraseña incorrectos.", value: email };
  redirect("/admin");
}

export async function logout() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Paso 1: verifica que el enlace sea un álbum de la Página de INGEVIAJES. */
export async function checkAlbum(_: Result, form: FormData): Promise<Result> {
  const link = String(form.get("link") ?? "");
  let supabase;
  try {
    supabase = await admin();
  } catch {
    return { error: "Tu sesión terminó. Vuelve a ingresar." };
  }
  const id = parseAlbumId(link);
  if (!id) return { value: link, error: "No reconozco ese enlace. Abre el álbum en Facebook y copia la dirección completa del navegador." };

  const { data: exists } = await supabase.from("albumes").select("id").eq("id", id).maybeSingle();
  if (exists) return { value: link, error: "Ese álbum ya está en la lista." };

  try {
    const info = await getAlbumInfo(id);
    if (info.ownerId && info.ownerId !== process.env.FACEBOOK_PAGE_ID)
      return { value: link, error: "Ese álbum no pertenece a la Página de INGEVIAJES." };
    return { ok: true, album: { id, name: info.name, count: info.count } };
  } catch {
    return { value: link, error: "Facebook no encontró ese álbum. Revisa que sea público y de la Página." };
  }
}

/** Paso 2: crea o edita un álbum. */
export async function saveAlbum(_: Result, form: FormData): Promise<Result> {
  const id = String(form.get("id") ?? "");
  const isNew = form.get("modo") === "crear";
  const titulo = String(form.get("titulo") ?? "").trim();
  const detalle = String(form.get("detalle") ?? "").trim();
  const anio = Number(form.get("anio"));
  const paises = [...new Set(form.getAll("pais").map(String))];
  const maxYear = new Date().getFullYear() + 2;

  if (!/^\d{6,}$/.test(id)) return { error: "Álbum no válido." };
  if (titulo.length < 3 || titulo.length > 120) return { error: "El título debe tener entre 3 y 120 caracteres." };
  if (detalle.length > 120) return { error: "El detalle debe tener máximo 120 caracteres." };
  if (!Number.isInteger(anio) || anio < 1990 || anio > maxYear) return { error: `El año debe estar entre 1990 y ${maxYear}.` };
  if (!paises.length || paises.length > 4 || !paises.every(isCountry)) return { error: "Elige entre 1 y 4 países." };

  try {
    const supabase = await admin();
    const row = { titulo, detalle, anio, paises };
    const { error } = isNew
      ? await supabase.from("albumes").insert({ id, ...row })
      : await supabase.from("albumes").update(row).eq("id", id);
    if (error) return { error: error.code === "23505" ? "Ese álbum ya está en la lista." : "No se pudo guardar." };
  } catch {
    return { error: "Tu sesión terminó. Vuelve a ingresar." };
  }
  done();
  return { ok: true };
}

export async function setVisible(id: string, visible: boolean) {
  const supabase = await admin();
  await supabase.from("albumes").update({ visible }).eq("id", id);
  done();
}

export async function deleteAlbum(id: string) {
  const supabase = await admin();
  await supabase.from("albumes").delete().eq("id", id);
  done();
}