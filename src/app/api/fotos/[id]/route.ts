import { getAlbums } from "@/lib/albums";
import { getAlbumPhotos } from "@/lib/facebook";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const albums = await getAlbums();
    if (!albums.some((a) => a.id === id)) return Response.json({ error: "Álbum no disponible" }, { status: 404 });
    return Response.json({ photos: await getAlbumPhotos(id) });
  } catch {
    return Response.json({ error: "No se pudieron cargar las fotos" }, { status: 502 });
  }
}