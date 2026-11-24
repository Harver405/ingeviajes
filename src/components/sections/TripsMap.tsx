"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MapPin, X } from "lucide-react";
import {
  countries,
  firstVisit,
  tripPlace,
  tripsByCountry,
  visitedCountries,
  type CountryKey,
} from "@/data/trayectoria";

export type MapShape = { iso: string; d: string; country: CountryKey | null };
type Point = { x: number; y: number };

type Props = {
  width: number;
  height: number;
  shapes: MapShape[];
  markers: (Point & { key: CountryKey })[];
  origin: Point;
};

const ease = [0.22, 1, 0.36, 1] as const;

/** Arco de vuelo entre dos puntos (curva elevada hacia arriba). */
function arc(a: Point, b: Point) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  return `M${a.x} ${a.y} Q${mx} ${my - dist * 0.35} ${b.x} ${b.y}`;
}

export default function TripsMap({ width, height, shapes, markers, origin }: Props) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<CountryKey | null>(null);
  const [hovered, setHovered] = useState<CountryKey | null>(null);

  const toggle = (k: CountryKey) => setSelected((s) => (s === k ? null : k));
  const selectedMarker = markers.find((m) => m.key === selected);
  const order = (k: CountryKey) => visitedCountries.indexOf(k);

  return (
    <div className="mt-14 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-10">
      {/* Mapa */}
      <div className="lg:col-span-8">
        <motion.svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full overflow-hidden"
          role="img"
          aria-label={`Mapa de países visitados: ${visitedCountries.map((k) => countries[k].name).join(", ")}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Países no visitados */}
          <g fill="rgb(255 255 255 / 0.09)" stroke="var(--color-carbon)" strokeWidth={0.6}>
            {shapes.filter((s) => !s.country).map((s) => (
              <path key={s.iso} d={s.d} />
            ))}
          </g>

          {/* Países visitados: se encienden en el orden en que se visitaron */}
          <g stroke="var(--color-carbon)" strokeWidth={0.6}>
            {shapes
              .filter((s): s is MapShape & { country: CountryKey } => s.country !== null)
              .map((s) => {
                const active = selected === s.country || hovered === s.country;
                return (
                  <motion.path
                    key={s.iso}
                    d={s.d}
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                    transition={{ duration: 0.6, delay: reduce ? 0 : 0.3 + order(s.country) * 0.18 }}
                    fill={active ? "var(--color-lima)" : "rgb(140 198 63 / 0.55)"}
                    className="cursor-pointer transition-[fill] duration-300"
                    onClick={() => toggle(s.country)}
                    onMouseEnter={() => setHovered(s.country)}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}
          </g>

          {/* Arco de vuelo desde Bucaramanga hasta el país elegido */}
          <AnimatePresence>
            {selectedMarker && (
              <motion.path
                key={selectedMarker.key}
                d={arc(origin, selectedMarker)}
                fill="none"
                stroke="var(--color-paper)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                initial={{ pathLength: reduce ? 1 : 0, opacity: 0.9 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
              />
            )}
          </AnimatePresence>

          {/* Origen */}
          <g aria-hidden>
            <circle cx={origin.x} cy={origin.y} r={4} fill="var(--color-paper)" />
            <text
              x={origin.x + 8}
              y={origin.y + 16}
              textAnchor="start"
              className="fill-paper/70 font-sans text-[13px]"
            >
              Bucaramanga
            </text>
          </g>

          {/* Marcadores (facilitan el clic en países pequeños como Panamá o Emiratos) */}
          {markers.map((m) => {
            const active = selected === m.key;
            return (
              <g
                key={m.key}
                aria-hidden
                className="cursor-pointer"
                onClick={() => toggle(m.key)}
                onMouseEnter={() => setHovered(m.key)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle cx={m.x} cy={m.y} r={14} fill="transparent" />
                <motion.circle
                  cx={m.x}
                  cy={m.y}
                  fill="var(--color-lima)"
                  stroke="var(--color-carbon)"
                  strokeWidth={2}
                  variants={{ hidden: { r: 0 }, show: { r: active ? 8 : 5 } }}
                  animate={{ r: active ? 8 : 5 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : 0.3 + order(m.key) * 0.18, ease }}
                />
              </g>
            );
          })}
        </motion.svg>

        {/* Selector accesible (teclado y lectores de pantalla) */}
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Países visitados">
          {visitedCountries.map((k) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => toggle(k)}
                aria-pressed={selected === k}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selected === k
                    ? "border-lima bg-lima text-ink"
                    : "border-paper/20 text-paper/80 hover:border-lima hover:text-paper"
                }`}
              >
                {countries[k].name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel de información */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {selected ? (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-3xl leading-tight text-paper">{countries[selected].name}</h3>
                    <p className="mt-1 text-sm text-paper/60">
                      {tripsByCountry(selected).length}{" "}
                      {tripsByCountry(selected).length === 1 ? "viaje" : "viajes"} · desde {firstVisit[selected]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    aria-label="Cerrar información del país"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-lima hover:text-paper"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <ol className="mt-6 divide-y divide-paper/10 border-y border-paper/10">
                  {tripsByCountry(selected).map((t) => (
                    <li key={`${t.year}-${t.program}-${t.institution}`} className="grid grid-cols-[4rem_1fr] gap-3 py-4">
                      <span className="font-display text-lg font-bold tabular-nums text-lima">{t.year}</span>
                      <div>
                        <p className="font-semibold text-paper">{t.program}</p>
                        <p className="mt-0.5 text-sm text-paper/70">
                          {t.program === t.kind ? t.institution : `${t.kind} · ${t.institution}`}
                          {t.countries.length > 1 || t.place ? ` · ${tripPlace(t)}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ) : (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease }}
              >
                <p className="flex items-center gap-2 text-paper">
                  <MapPin aria-hidden className="size-5 text-lima" />
                  Selecciona un país en el mapa
                </p>
                <ol className="mt-6 divide-y divide-paper/10 border-y border-paper/10">
                  {visitedCountries.map((k) => (
                    <li key={k}>
                      <button
                        type="button"
                        onClick={() => setSelected(k)}
                        className="flex w-full items-baseline justify-between gap-4 py-3 text-left text-paper/85 transition-colors hover:text-lima"
                      >
                        <span className="font-display font-semibold">{countries[k].name}</span>
                        <span className="text-sm tabular-nums text-paper/50">desde {firstVisit[k]}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}