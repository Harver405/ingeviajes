import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import TripsMap, { type MapShape } from "@/components/sections/TripsMap";
import { countries, firstYear, institutions, trips, visitedCountries } from "@/data/trayectoria";


const WIDTH = 1000;
const ORIGIN: [number, number] = [-73.12, 7.12]; // Bucaramanga, sede de INGEVIAJES

const topology = world as unknown as Topology<{ countries: GeometryCollection }>;
const all = feature(topology, topology.objects.countries) as FeatureCollection<Geometry, { name: string }>;
// Sin la Antártida para aprovechar mejor el espacio
const land: FeatureCollection<Geometry, { name: string }> = {
  type: "FeatureCollection",
  features: all.features.filter((f) => f.id !== "010"),
};

/* Encuadre: de las Américas a Medio Oriente, donde están todos los viajes. */
const FRAME = {
  type: "MultiPoint" as const,
  coordinates: [
    [-125, 52],
    [62, 52],
    [-125, -52],
    [62, -52],
  ],
};
const projection = geoNaturalEarth1().fitWidth(WIDTH, FRAME);
const path = geoPath(projection).digits(1);
const [[, y0], [, y1]] = path.bounds(FRAME);
const HEIGHT = Math.ceil(y1 - y0);
projection.translate([projection.translate()[0], projection.translate()[1] - y0]);

const visitedIso = new Map(visitedCountries.map((k) => [countries[k].iso, k]));


const shapes: MapShape[] = land.features.map((f, i) => ({
  iso: f.id != null ? String(f.id) : `sin-codigo-${i}`,
  d: path(f) ?? "",
  country: f.id != null ? (visitedIso.get(String(f.id)) ?? null) : null,
}));

const toXY = (lonLat: [number, number]) => {
  const p = projection(lonLat) ?? [0, 0];
  return { x: Math.round(p[0] * 10) / 10, y: Math.round(p[1] * 10) / 10 };
};

const markers = visitedCountries.map((k) => ({ key: k, ...toXY(countries[k].marker) }));
const origin = toXY(ORIGIN);

const joinEs = (items: string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}` : items.join("");

export default function Timeline() {
  return (
    <section
      id="trayectoria"
      aria-labelledby="trayectoria-titulo"
      className="overflow-x-clip bg-carbon py-24 text-paper md:py-32"
    >
      <div className="container-site">
        {/* Planteamiento */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2 id="trayectoria-titulo" className="text-paper lg:col-span-7">
            <span className="block font-display text-2xl font-semibold text-paper/80 md:text-3xl">Desde</span>
            <span
              aria-hidden
              className="block font-display text-[clamp(4.5rem,11vw,8rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-transparent [-webkit-text-stroke:2px_var(--color-lima)]"
            >
              {firstYear}
            </span>
            <span className="sr-only">{firstYear}, </span>
            <span className="mt-5 block text-3xl leading-tight md:text-4xl">llevando el aula al mundo</span>
          </h2>
          <p className="max-w-[52ch] text-lg leading-relaxed text-paper/80 lg:col-span-5">
            {trips.length} viajes a {visitedCountries.length} países con estudiantes de pregrado y posgrado. Selecciona un país para ver cada viaje.
          </p>
        </div>

        <TripsMap width={WIDTH} height={HEIGHT} shapes={shapes} markers={markers} origin={origin} />
      </div>
    </section>
  );
}