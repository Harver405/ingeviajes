/* Sube una imagen desde el navegador a Supabase Storage.
   Antes la reduce (máx. 1800 px) y la convierte a WebP para que la página cargue rápido. */
import { supabaseBrowser } from "@/lib/supabase/browser";
import { BUCKET } from "@/lib/media";

export const ACCEPT = "image/jpeg,image/png,image/webp";

async function compress(file: File): Promise<{ blob: Blob; ext: "webp" | "jpg" }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const toBlob = (type: string) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, 0.85));
  const webp = await toBlob("image/webp");
  if (webp?.type === "image/webp") return { blob: webp, ext: "webp" };
  const jpg = await toBlob("image/jpeg"); // navegadores sin WebP
  if (!jpg) throw new Error("No se pudo procesar la imagen");
  return { blob: jpg, ext: "jpg" };
}

/** Devuelve la ruta guardada (ej. "proximas/uuid.webp"). */
export async function uploadImage(file: File, folder: "proximas" | "popup"): Promise<string> {
  if (!ACCEPT.split(",").includes(file.type)) throw new Error("Usa una imagen JPG, PNG o WebP.");
  const { blob, ext } = await compress(file);
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabaseBrowser()
    .storage.from(BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
  if (error) throw new Error("No se pudo subir la imagen. Intenta de nuevo.");
  return path;
}