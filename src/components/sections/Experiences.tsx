import Reveal from "@/components/ui/Reveal";
import CountryFlags from "@/components/ui/CountryFlags";
import ExperiencesGallery, { type GalleryAlbum } from "@/components/sections/ExperiencesGallery";
import { getAlbums, placeOf, type Album } from "@/lib/albums";
import { getPreviews, type Preview } from "@/lib/facebook";

/* Galería de experiencias: la lista viene del panel (/admin) y las fotos de la
   Página de Facebook, leídas en el servidor; el visitante nunca sale del sitio. */
export default async function Experiences() {
  let albums: Album[] = [];
  let previews: Record<string, Preview> = {};
  try {
    albums = await getAlbums();
    previews = await getPreviews(albums.map((a) => a.id));
  } catch (e) {
    console.error("[Experiencias]", e); // muestra en la terminal por qué no cargó
  }

  const items: GalleryAlbum[] = albums.map((a) => ({
    id: a.id,
    title: a.title,
    detail: a.detail,
    year: a.year,
    place: placeOf(a.countries),
    flags: <CountryFlags codes={a.countries} />,
    count: previews[a.id]?.count ?? 0,
    images: previews[a.id]?.images ?? [],
  }));

  return (
    <section id="experiencias" aria-labelledby="experiencias-titulo" className="bg-paper py-24 md:py-32">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <h2
              id="experiencias-titulo"
              className="text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Experiencias
            </h2>
            <p className="mt-4 text-xl text-lima-ink md:text-2xl">Cada viaje, documentado por sus protagonistas.</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="max-w-[52ch] text-lg leading-relaxed text-carbon">
              Una selección de nuestras misiones académicas y visitas técnicas. Abre cualquier viaje para recorrer
              sus fotografías.
            </p>
          </Reveal>
        </div>

        <ExperiencesGallery albums={items} />
      </div>
    </section>
  );
}