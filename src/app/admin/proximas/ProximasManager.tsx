"use client";

import { useActionState, useState, useTransition, type ReactNode } from "react";
import Image from "next/image";
import { Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import type { ProximaRow } from "@/lib/proximas";
import type { Result } from "../actions";
import { deleteProxima, saveProxima, setProximaVisible } from "./actions";
import CountryPicker from "../CountryPicker";
import ImageField from "../ImageField";
import { uploadImage } from "../upload";
import { field, ghost, hint, iconBtn, label, primary } from "../ui";

type Country = { code: string; name: string };
type Trip = ProximaRow & { place: string; when: string; imageUrl: string; past: boolean; flags: ReactNode };

export default function ProximasManager({ trips, countries }: { trips: Trip[]; countries: Country[] }) {
  const [adding, setAdding] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const upcoming = trips.filter((t) => !t.past);
  const past = trips.filter((t) => t.past);

  return (
    <>
      <section className="mt-8 rounded-[var(--radius-card)] bg-paper p-6 md:p-8">
        {adding ? (
          <>
            <h2 className="font-display text-xl font-bold text-ink">Nueva salida</h2>
            <TripForm
              key={formKey}
              countries={countries}
              onDone={() => {
                setAdding(false);
                setFormKey((k) => k + 1);
              }}
            />
          </>
        ) : (
          <button onClick={() => setAdding(true)} className={`${primary} inline-flex items-center gap-2`}>
            <Plus aria-hidden className="size-4" />
            Nueva salida
          </button>
        )}
      </section>

      <h2 className="mt-12 font-display text-xl font-bold text-ink">Próximas ({upcoming.length})</h2>
      {upcoming.length === 0 ? (
        <p className="mt-4 text-muted">No hay salidas próximas. En la página se muestra un mensaje para que escriban.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {upcoming.map((t) => (
            <TripItem key={t.id} trip={t} countries={countries} />
          ))}
        </ul>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-xl font-bold text-ink">Ya salieron ({past.length})</h2>
          <p className="mt-1 text-sm text-muted">No se muestran en la página. Puedes eliminarlas.</p>
          <ul className="mt-4 grid gap-3">
            {past.map((t) => (
              <TripItem key={t.id} trip={t} countries={countries} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function TripForm({ trip, countries, onDone }: { trip?: Trip; countries: Country[]; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [paises, setPaises] = useState<string[]>(trip?.paises ?? []);
  const [v, setV] = useState({
    titulo: trip?.titulo ?? "",
    salida: trip?.salida ?? "",
    regreso: trip?.regreso ?? "",
    precio: trip?.precio ?? "",
    cupos: trip?.cupos === null || trip?.cupos === undefined ? "" : String(trip.cupos),
    descripcion: trip?.descripcion ?? "",
  });
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));

  const [state, action, pending] = useActionState<Result, FormData>(async (prev, form) => {
    if (!file && !trip) return { error: "Elige una imagen." };
    try {
      if (file) form.set("imagen", await uploadImage(file, "proximas"));
    } catch (e) {
      return { error: e instanceof Error ? e.message : "No se pudo subir la imagen." };
    }
    const r = await saveProxima(prev, form);
    if (r.ok) onDone();
    return r;
  }, {});

  return (
    <form action={action} className="mt-5 grid gap-5">
      <input type="hidden" name="id" value={trip?.id ?? ""} />
      <input type="hidden" name="imagen" value={trip?.imagen ?? ""} />
      <input type="hidden" name="anterior" value={trip?.imagen ?? ""} />

      <ImageField
        text="Imagen"
        help="Foto horizontal del destino. Se reduce automáticamente para que cargue rápido."
        current={trip?.imageUrl}
        file={file}
        onFile={setFile}
      />

      <label className={label}>
        Título
        <input
          name="titulo"
          required
          maxLength={120}
          value={v.titulo}
          onChange={set("titulo")}
          placeholder="Misión académica Ingeniería Industrial"
          className={field}
        />
      </label>

      <CountryPicker countries={countries} value={paises} onChange={setPaises} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Salida
          <input name="salida" type="date" required value={v.salida} onChange={set("salida")} className={field} />
        </label>
        <label className={label}>
          Regreso
          <input
            name="regreso"
            type="date"
            required
            min={v.salida || undefined}
            value={v.regreso}
            onChange={set("regreso")}
            className={field}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
        <label className={label}>
          Precio
          <input
            name="precio"
            maxLength={60}
            value={v.precio}
            onChange={set("precio")}
            placeholder="Desde USD 2.300"
            className={field}
          />
          <span className={`${hint} block`}>Texto libre. Vacío = no se muestra.</span>
        </label>
        <label className={label}>
          Cupos
          <input
            name="cupos"
            type="number"
            min={0}
            max={999}
            value={v.cupos}
            onChange={set("cupos")}
            className={field}
          />
          <span className={`${hint} block`}>Vacío = no se muestra. 0 = agotado.</span>
        </label>
      </div>

      <label className={label}>
        Descripción
        <textarea
          name="descripcion"
          rows={5}
          maxLength={600}
          value={v.descripcion}
          onChange={set("descripcion")}
          placeholder="Qué visitarán, a quién va dirigido, qué incluye…"
          className={`${field} resize-y`}
        />
        <span className={`${hint} block text-right`}>{v.descripcion.length} / 600</span>
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button disabled={pending} className={primary}>
          {pending ? "Guardando…" : trip ? "Guardar cambios" : "Publicar en la página"}
        </button>
        <button type="button" onClick={onDone} className={ghost}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function TripItem({ trip: t, countries }: { trip: Trip; countries: Country[] }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  return (
    <li className={`rounded-[var(--radius-card)] bg-paper p-4 ${t.visible && !t.past ? "" : "opacity-70"}`}>
      <div className="flex flex-wrap items-center gap-4">
        <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-lima-soft">
          <Image src={t.imageUrl} alt="" fill sizes="6rem" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-display font-bold text-ink">
            {t.flags}
            {t.place}
            {!t.visible && <Badge>Oculta</Badge>}
            {t.cupos === 0 && <Badge>Agotado</Badge>}
          </p>
          <p className="truncate text-sm text-muted">
            {t.titulo} · {t.when}
          </p>
        </div>

        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-carbon">¿Eliminar?</span>
            <button
              disabled={pending}
              onClick={() => start(() => deleteProxima(t.id))}
              className="rounded-full bg-error px-4 py-2 text-sm font-semibold text-paper disabled:opacity-60"
            >
              Sí, eliminar
            </button>
            <button onClick={() => setConfirming(false)} className={ghost}>
              No
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              className={iconBtn}
              aria-label={editing ? "Cerrar edición" : "Editar"}
              title={editing ? "Cerrar edición" : "Editar"}
              onClick={() => setEditing((e) => !e)}
            >
              {editing ? <X className="size-4" /> : <Pencil className="size-4" />}
            </button>
            {!t.past && (
              <button
                type="button"
                className={iconBtn}
                disabled={pending}
                aria-label={t.visible ? "Ocultar de la página" : "Mostrar en la página"}
                title={t.visible ? "Ocultar de la página" : "Mostrar en la página"}
                onClick={() => start(() => setProximaVisible(t.id, !t.visible))}
              >
                {t.visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            )}
            <button
              type="button"
              className={iconBtn}
              aria-label="Eliminar"
              title="Eliminar"
              onClick={() => setConfirming(true)}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}
      </div>

      {editing && <TripForm trip={t} countries={countries} onDone={() => setEditing(false)} />}
    </li>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-line px-2 py-0.5 text-xs font-semibold text-muted">{children}</span>;
}