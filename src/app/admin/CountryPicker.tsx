"use client";

import { X } from "lucide-react";
import { field, label } from "./ui";

type Country = { code: string; name: string };

/* Selector de 1 a 4 países, que se muestran con su bandera en la página. */
export default function CountryPicker({
  countries,
  value,
  onChange,
}: {
  countries: Country[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const nameOf = (code: string) => countries.find((c) => c.code === code)?.name ?? code;
  return (
    <div>
      {value.map((c) => (
        <input key={c} type="hidden" name="pais" value={c} />
      ))}
      <label className={label}>
        Países (aparecen con su bandera)
        <select
          value=""
          disabled={value.length >= 4}
          onChange={(e) => e.target.value && onChange([...value, e.target.value])}
          className={field}
        >
          <option value="">{value.length >= 4 ? "Máximo 4 países" : "Agregar país…"}</option>
          {countries
            .filter((c) => !value.includes(c.code))
            .map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
        </select>
      </label>
      {value.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {value.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== c))}
                className="inline-flex items-center gap-1.5 rounded-full bg-lima-soft px-3 py-1.5 text-sm font-semibold text-carbon hover:bg-line"
                aria-label={`Quitar ${nameOf(c)}`}
              >
                {nameOf(c)}
                <X aria-hidden className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}