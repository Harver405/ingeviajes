/* Imágenes guardadas en Supabase Storage (bucket "medios"). */
export const BUCKET = "medios";

/** Dirección pública de una imagen a partir de su ruta guardada (proximas/abc.webp). */
export const mediaUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

/** Solo rutas creadas por el panel. */
export const isMediaPath = (path: string, folder: "proximas" | "popup") =>
  new RegExp(`^${folder}/[a-f0-9-]{36}\\.(webp|jpg|png)$`).test(path);