
export type CountryKey =
  | "panama"
  | "brasil"
  | "mexico"
  | "emiratos"
  | "chile"
  | "espana"
  | "francia"
  | "eeuu"
  | "argentina";

export type Country = {
  name: string;
  iso: string;
  marker: [number, number];
};

export const countries: Record<CountryKey, Country> = {
  panama: { name: "Panamá", iso: "591", marker: [-80.1, 8.6] },
  brasil: { name: "Brasil", iso: "076", marker: [-51.9, -10.3] },
  mexico: { name: "México", iso: "484", marker: [-102.5, 23.6] },
  emiratos: { name: "Emiratos Árabes Unidos", iso: "784", marker: [54.3, 24.2] },
  chile: { name: "Chile", iso: "152", marker: [-71.3, -33.4] },
  espana: { name: "España", iso: "724", marker: [-3.7, 40.4] },
  francia: { name: "Francia", iso: "250", marker: [2.4, 46.6] },
  eeuu: { name: "Estados Unidos", iso: "840", marker: [-99.3, 31.2] },
  argentina: { name: "Argentina", iso: "032", marker: [-64.2, -34.6] },
};

export type Trip = {
  year: number;
  countries: CountryKey[];
  place?: string;
  kind: "Visita técnica" | "Misión académica";
  program: string;
  institution: string;
};

export const trips: Trip[] = [
  { year: 2011, countries: ["panama"], kind: "Visita técnica", program: "Ingeniería Civil", institution: "UIS" },
  { year: 2012, countries: ["brasil"], kind: "Visita técnica", program: "Ingeniería Civil", institution: "UIS" },
  { year: 2013, countries: ["mexico"], kind: "Visita técnica", program: "Ingeniería Industrial", institution: "UIS" },
  { year: 2013, countries: ["emiratos"], kind: "Visita técnica", program: "Ingeniería Civil", institution: "UIS" },
  { year: 2014, countries: ["chile"], kind: "Visita técnica", program: "Ingeniería Civil", institution: "UIS" },
  { year: 2014, countries: ["brasil"], kind: "Visita técnica", program: "Ingeniería Mecánica", institution: "UIS" },
  { year: 2014, countries: ["mexico"], kind: "Visita técnica", program: "Ingeniería Metalúrgica e Ingeniería Química", institution: "UIS" },
  { year: 2015, countries: ["espana"], kind: "Visita técnica", program: "Maestría en Ingeniería Química", institution: "UIS" },
  { year: 2015, countries: ["francia"], kind: "Visita técnica", program: "Maestría en Ingeniería Química", institution: "UIS" },
  { year: 2015, countries: ["eeuu"], place: "Texas", kind: "Visita técnica", program: "Maestría en Ingeniería Química", institution: "UIS" },
  { year: 2015, countries: ["brasil"], kind: "Misión académica", program: "Posgrados", institution: "UPB Bucaramanga" },
  { year: 2016, countries: ["panama"], kind: "Misión académica", program: "Posgrados", institution: "UPB Bucaramanga" },
  { year: 2016, countries: ["argentina", "brasil"], kind: "Misión académica", program: "Posgrados", institution: "UPB Bucaramanga" },
  { year: 2017, countries: ["emiratos"], kind: "Misión académica", program: "Misión académica", institution: "Universidad Piloto de Colombia" },
  { year: 2018, countries: ["brasil"], kind: "Misión académica", program: "Posgrado en Ingeniería Financiera", institution: "Universidad Piloto de Colombia" },
  { year: 2018, countries: ["emiratos"], kind: "Misión académica", program: "Ingeniería Civil", institution: "Universidad Piloto de Colombia" },
  { year: 2019, countries: ["emiratos"], kind: "Misión académica", program: "Ingeniería Financiera", institution: "Universidad Piloto de Colombia" },
  { year: 2019, countries: ["mexico"], kind: "Misión académica", program: "Posgrado en Ingeniería Financiera", institution: "Universidad Piloto de Colombia" },
  { year: 2022, countries: ["mexico"], kind: "Misión académica", program: "Posgrado en Ingeniería Financiera", institution: "Universidad Piloto de Colombia" },
];

/* ---------- Derivados (no se editan a mano) ---------- */

/** Nombre legible de los países de un viaje: "Argentina y Brasil". */
export const tripPlace = (t: Trip) =>
  t.countries.map((k) => countries[k].name).join(" y ") + (t.place ? ` (${t.place})` : "");

/** Viajes de un país, del más reciente al más antiguo. */
export const tripsByCountry = (key: CountryKey) =>
  trips.filter((t) => t.countries.includes(key)).sort((a, b) => b.year - a.year);

/** Países visitados, en el orden en que se visitaron por primera vez. */
export const visitedCountries: CountryKey[] = [
  ...new Set([...trips].sort((a, b) => a.year - b.year).flatMap((t) => t.countries)),
];

/** Año de la primera visita a cada país. */
export const firstVisit = Object.fromEntries(
  visitedCountries.map((k) => [k, Math.min(...tripsByCountry(k).map((t) => t.year))]),
) as Record<CountryKey, number>;

export const institutions = [...new Set(trips.map((t) => t.institution))];
export const programs = [...new Set(trips.map((t) => t.program).filter((p) => p !== "Misión académica"))];
export const firstYear = Math.min(...trips.map((t) => t.year));