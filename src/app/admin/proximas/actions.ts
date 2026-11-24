"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { isCountry } from "@/lib/albums";
import { BUCKET, isMediaPath } from "@/lib/media";
import type { Result } from "../actions";

const isDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d));

function done() {
  updateTag("proximas"); // la página pública se actualiza de inmediato
  revalidatePath("/admin/proximas");
}

export async function saveProxima(_: Result, form: FormData): Promise<Result> {
  const id = String(form.get("id") ?? "");
  const imagen = String(form.get("imagen") ?? "");
  const anterior = String(form.get("anterior") ?? "");
  const titulo = String(form.get("titulo") ?? "").trim();
  const descripcion = String(form.get("descripcion") ?? "").trim();
  const salida = String(form.get("salida") ?? "");
  const regreso = String(form.get("regreso") ?? "");
  const precio = String(form.get("precio") ?? "").trim();
  const cuposText = String(form.get("cupos") ?? "").trim();
  const cupos = cuposText === "" ? null : Number(cuposText);
  const paises = [...new Set(form.getAll("pais").map(String))];

  const error = (() => {
    if (!isMediaPath(imagen, "proximas")) return "Elige una imagen.";
    if (titulo.length < 3 || titulo.length > 120) return "El título debe tener entre 3 y 120 caracteres.";
    if (!paises.length || paises.length > 4 || !paises.every(isCountry)) return "Elige entre 1 y 4 países.";
    if (!isDate(salida) || !isDate(regreso)) return "Revisa las fechas.";
    if (regreso < salida) return "La fecha de regreso no puede ser antes de la salida.";
    if (precio.length > 60) return "El precio debe tener máximo 60 caracteres.";
    if (cupos !== null && (!Number.isInteger(cupos) || cupos < 0 || cupos > 999)) return "Los cupos deben ser un número entre 0 y 999.";
    if (descripcion.length > 600) return "La descripción debe tener máximo 600 caracteres.";
    return null;
  })();

  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { error: "Tu sesión terminó. Vuelve a ingresar." };
  }
  const changedImage = imagen !== anterior;
  const discardNew = () => changedImage && isMediaPath(imagen, "proximas") && supabase.storage.from(BUCKET).remove([imagen]);

  if (error) {
    await discardNew();
    return { error };
  }

  const row = { titulo, paises, descripcion, imagen, salida, regreso, precio, cupos };
  const { error: dbError } = id
    ? await supabase.from("proximas").update(row).eq("id", id)
    : await supabase.from("proximas").insert(row);
  if (dbError) {
    await discardNew();
    return { error: "No se pudo guardar. Intenta de nuevo." };
  }
  if (changedImage && isMediaPath(anterior, "proximas")) await supabase.storage.from(BUCKET).remove([anterior]);

  done();
  return { ok: true };
}

export async function setProximaVisible(id: string, visible: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("proximas").update({ visible }).eq("id", id);
  done();
}

export async function deleteProxima(id: string) {
  const supabase = await requireAdmin();
  const { data } = await supabase.from("proximas").delete().eq("id", id).select("imagen").maybeSingle();
  if (data?.imagen && isMediaPath(data.imagen, "proximas")) await supabase.storage.from(BUCKET).remove([data.imagen]);
  done();
}