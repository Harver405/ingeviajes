"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { BUCKET, isMediaPath } from "@/lib/media";
import type { Result } from "../actions";

function done() {
  updateTag("popup");
  revalidatePath("/admin/popup");
}

export async function savePopup(_: Result, form: FormData): Promise<Result> {
  const imagen = String(form.get("imagen") ?? "");
  const anterior = String(form.get("anterior") ?? "");
  const alt = String(form.get("alt") ?? "").trim();
  const enlace = String(form.get("enlace") ?? "").trim();
  const activo = form.get("activo") === "on";
  const titulo = String(form.get("titulo") ?? "").trim();
  const texto = String(form.get("texto") ?? "").trim();
  const boton = String(form.get("boton") ?? "").trim();

  const error = (() => {
    if (!isMediaPath(imagen, "popup")) return "Elige el afiche.";
    if (alt.length < 3 || alt.length > 200) return "Describe el afiche en pocas palabras (3 a 200 caracteres).";
    if (enlace && !/^(#[\w-]+|https:\/\/\S+)$/.test(enlace))
      return "El enlace debe empezar por https:// o ser una sección como #proximas.";
    if (enlace.length > 500) return "El enlace es demasiado largo.";
    if (titulo.length > 80) return "El título debe tener máximo 80 caracteres.";
    if (texto.length > 240) return "El texto debe tener máximo 240 caracteres.";
    if (boton.length > 30) return "El texto del botón debe tener máximo 30 caracteres.";
    return null;
  })();

  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { error: "Tu sesión terminó. Vuelve a ingresar." };
  }
  const changedImage = imagen !== anterior;
  const discardNew = () => changedImage && isMediaPath(imagen, "popup") && supabase.storage.from(BUCKET).remove([imagen]);
  if (error) {
    await discardNew();
    return { error };
  }

  const { error: dbError } = await supabase
    .from("popup")
    .upsert({ id: 1, imagen, alt, enlace, activo, titulo, texto, boton, actualizado: new Date().toISOString() });
  if (dbError) {
    await discardNew();
    return { error: "No se pudo guardar. Intenta de nuevo." };
  }
  if (changedImage && isMediaPath(anterior, "popup")) await supabase.storage.from(BUCKET).remove([anterior]);

  done();
  return { ok: true };
}

export async function deletePopup() {
  const supabase = await requireAdmin();
  const { data } = await supabase.from("popup").delete().eq("id", 1).select("imagen").maybeSingle();
  if (data?.imagen && isMediaPath(data.imagen, "popup")) await supabase.storage.from(BUCKET).remove([data.imagen]);
  done();
}