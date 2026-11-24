/* Lectura de la Página de Facebook de INGEVIAJES (solo en el servidor).
   El token vive en .env.local y nunca llega al navegador. */
import { cacheLife } from "next/cache";

const GRAPH = process.env.FACEBOOK_GRAPH_URL ?? "https://graph.facebook.com/v27.0";

export type Photo = { thumb: string; full: string; width: number; height: number };

type FbImage = { source: string; width: number; height: number };
type FbPhoto = { id: string; images: FbImage[] };

/** De las versiones que entrega Facebook, la más pequeña que tenga al menos `min` px de ancho. */
function pick(images: FbImage[], min: number): FbImage {
  const sorted = [...images].sort((a, b) => a.width - b.width);
  return sorted.find((i) => i.width >= min) ?? sorted[sorted.length - 1];
}

async function graph<T>(path: string, params: Record<string, string>): Promise<T> {
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  if (!token) throw new Error("Falta FACEBOOK_PAGE_TOKEN en .env.local");
  const url = new URL(`${GRAPH}/${path}`);
  Object.entries({ ...params, access_token: token }).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Facebook respondió ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export type Preview = { count: number; images: string[] };

/** Para cada álbum: cantidad de fotos y hasta 12 imágenes (en orden aleatorio) para la portada que va cambiando.
    Consulta todos los álbumes en paralelo; si uno falla, los demás se muestran igual.
    Se guarda en caché 1 hora, así que el orden cambia cada hora. */
export async function getPreviews(ids: string[]): Promise<Record<string, Preview>> {
  "use cache";
  cacheLife("hours");
  type Res = { count?: number; cover_photo?: { images: FbImage[] }; photos?: { data: FbPhoto[] } };

  const results = await Promise.allSettled(
    ids.map((id) => graph<Res>(id, { fields: "count,cover_photo{images},photos.limit(12){images}" })),
  );

  return Object.fromEntries(
    ids.map((id, n) => {
      const r = results[n];
      if (r.status === "rejected") {
        console.error(`[Facebook] álbum ${id}:`, r.reason);
        return [id, { count: 0, images: [] }];
      }
      const a = r.value;
      const urls = (a.photos?.data ?? []).filter((p) => p.images?.length).map((p) => pick(p.images, 720).source);
      if (!urls.length && a.cover_photo?.images?.length) urls.push(pick(a.cover_photo.images, 720).source);
      for (let i = urls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [urls[i], urls[j]] = [urls[j], urls[i]];
      }
      return [id, { count: a.count ?? 0, images: urls }];
    }),
  );
}

/** Datos de un álbum para verificarlo desde el panel (sin caché). */
export async function getAlbumInfo(id: string) {
  const a = await graph<{ name?: string; count?: number; from?: { id: string } }>(id, { fields: "name,count,from" });
  return { name: a.name ?? "", count: a.count ?? 0, ownerId: a.from?.id ?? "" };
}

/** Todas las fotos de un álbum (recorre las páginas de resultados). Se guarda en caché 1 hora. */
export async function getAlbumPhotos(albumId: string): Promise<Photo[]> {
  "use cache";
  cacheLife("hours");
  type Res = { data: FbPhoto[]; paging?: { cursors?: { after?: string }; next?: string } };
  const photos: Photo[] = [];
  let after: string | undefined;
  for (let page = 0; page < 10; page++) {
    const res = await graph<Res>(`${albumId}/photos`, {
      fields: "images",
      limit: "100",
      ...(after ? { after } : {}),
    });
    for (const p of res.data) {
      if (!p.images?.length) continue;
      const full = pick(p.images, 1600);
      photos.push({ thumb: pick(p.images, 480).source, full: full.source, width: full.width, height: full.height });
    }
    after = res.paging?.next ? res.paging.cursors?.after : undefined;
    if (!after) break;
  }
  return photos;
}