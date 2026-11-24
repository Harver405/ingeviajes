"use client";

import { useActionState, useState, useTransition, type ReactNode } from "react";
import { Eye, EyeOff, Pencil, Trash2, X } from "lucide-react";
import { checkAlbum, deleteAlbum, saveAlbum, setVisible, type Result } from "./actions";

type Country = { code: string; name: string };
type AdminAlbum = {
  id: string;
  title: string;
  countries: string[];
  detail: string;
  year: number;
  visible: boolean;
  place: string;
  flags: ReactNode;
};

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none transition-colors focus:border-lima-ink";
const label = "text-sm font-semibold text-carbon";
const primary =
  "rounded-full bg-lima px-5 py-2.5 font-display text-sm font-semibold text-ink transition-opacity disabled:opacity-60";
const ghost = "rounded-full border border-line px-4 py-2 text-sm font-semibold text-carbon hover:border-carbon";

export default function AlbumManager({ albums, countries }: { albums: AdminAlbum[]; countries: Country[] }) {
  const [addKey, setAddKey] = useState(0);
  return (
    <>
      <AddAlbum key={addKey} countries={countries} onSaved={() => setAddKey((k) => k + 1)} />

      <h2 className="mt-12 font-display text-xl font-bold text-ink">En la página ({albums.length})</h2>
      {albums.length === 0 ? (
        <p className="mt-4 text-muted">Todavía no hay álbumes. Agrega el primero arriba.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {albums.map((a) => (
            <AlbumItem key={a.id} album={a} countries={countries} />
          ))}
        </ul>
      )}
    </>
  );
}

/* Paso 1: pegar el enlace. Paso 2: completar los datos. */
function AddAlbum({ countries, onSaved }: { countries: Country[]; onSaved: () => void }) {
  const [state, action, pending] = useActionState<Result, FormData>(checkAlbum, {});
  const found = state.ok ? state.album : undefined;

  return (
    <section className="mt-8 rounded-[var(--radius-card)] bg-paper p-6 md:p-8">
      <h2 className="font-display text-xl font-bold text-ink">Agregar álbum</h2>
      {!found ? (
        <form action={action} className="mt-4">
          <label className={label}>
            Enlace del álbum en Facebook
            <input
              name="link"
              required
              defaultValue={state.value}
              placeholder="https://www.facebook.com/media/set/?set=a.123…"
              className={field}
            />
          </label>
          <p className="mt-2 text-sm text-muted">
            Abre el álbum en la Página de Facebook y copia la dirección que aparece en el navegador.
          </p>
          {state.error && (
            <p role="alert" className="mt-3 text-sm text-error">
              {state.error}
            </p>
          )}
          <button disabled={pending} className={`${primary} mt-4`}>
            {pending ? "Buscando…" : "Buscar álbum"}
          </button>
        </form>
      ) : (
        <>
          <p className="mt-3 rounded-xl bg-lima-soft px-4 py-3 text-sm text-carbon">
            Encontrado en Facebook: <strong>{found.name || "Álbum sin nombre"}</strong> · {found.count} fotos
          </p>
          <AlbumFields
            mode="crear"
            id={found.id}
            initial={{ title: found.name.slice(0, 120), countries: [], detail: "", year: new Date().getFullYear() }}
            countries={countries}
            onDone={onSaved}
            onCancel={onSaved}
          />
        </>
      )}
    </section>
  );
}

type Initial = { title: string; countries: string[]; detail: string; year: number };

function AlbumFields({
  mode,
  id,
  initial,
  countries,
  onDone,
  onCancel,
}: {
  mode: "crear" | "editar";
  id: string;
  initial: Initial;
  countries: Country[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(initial.countries);
  const [title, setTitle] = useState(initial.title);
  const [detail, setDetail] = useState(initial.detail);
  const [year, setYear] = useState(String(initial.year));
  const [state, action, pending] = useActionState<Result, FormData>(async (prev, form) => {
    const r = await saveAlbum(prev, form);
    if (r.ok) onDone();
    return r;
  }, {});
  const nameOf = (code: string) => countries.find((c) => c.code === code)?.name ?? code;

  return (
    <form action={action} className="mt-5 grid gap-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="modo" value={mode} />
      {selected.map((c) => (
        <input key={c} type="hidden" name="pais" value={c} />
      ))}

      <label className={label}>
        Título
        <input
          name="titulo"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={field}
        />
      </label>

      <div>
        <label className={label}>
          Países (aparecen con su bandera)
          <select
            value=""
            disabled={selected.length >= 4}
            onChange={(e) => e.target.value && setSelected((s) => [...s, e.target.value])}
            className={field}
          >
            <option value="">{selected.length >= 4 ? "Máximo 4 países" : "Agregar país…"}</option>
            {countries
              .filter((c) => !selected.includes(c.code))
              .map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
          </select>
        </label>
        {selected.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {selected.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => setSelected((s) => s.filter((x) => x !== c))}
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

      <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
        <label className={label}>
          Detalle (institución, programa)
          <input
            name="detalle"
            maxLength={120}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Universidad … · Posgrado"
            className={field}
          />
        </label>
        <label className={label}>
          Año
          <input
            name="anio"
            type="number"
            required
            min={1990}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={field}
          />
        </label>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button disabled={pending} className={primary}>
          {pending ? "Guardando…" : mode === "crear" ? "Publicar en la página" : "Guardar cambios"}
        </button>
        <button type="button" onClick={onCancel} className={ghost}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function AlbumItem({ album, countries }: { album: AdminAlbum; countries: Country[] }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  return (
    <li className={`rounded-[var(--radius-card)] bg-paper p-5 ${album.visible ? "" : "opacity-70"}`}>
      <div className="flex flex-wrap items-center gap-4">
        {album.flags}
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-ink">
            {album.place} · {album.year}
            {!album.visible && (
              <span className="ml-2 rounded-full bg-line px-2 py-0.5 align-middle text-xs font-semibold text-muted">
                Oculto
              </span>
            )}
          </p>
          <p className="truncate text-sm text-muted">
            {album.title}
            {album.detail && ` · ${album.detail}`}
          </p>
        </div>

        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-carbon">¿Eliminar de la página?</span>
            <button
              disabled={pending}
              onClick={() => start(() => deleteAlbum(album.id))}
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
            <IconButton label={editing ? "Cerrar edición" : "Editar"} onClick={() => setEditing((v) => !v)}>
              {editing ? <X className="size-4" /> : <Pencil className="size-4" />}
            </IconButton>
            <IconButton
              label={album.visible ? "Ocultar de la página" : "Mostrar en la página"}
              disabled={pending}
              onClick={() => start(() => setVisible(album.id, !album.visible))}
            >
              {album.visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </IconButton>
            <IconButton label="Eliminar" onClick={() => setConfirming(true)}>
              <Trash2 className="size-4" />
            </IconButton>
          </div>
        )}
      </div>

      {editing && (
        <AlbumFields
          mode="editar"
          id={album.id}
          initial={{ title: album.title, countries: album.countries, detail: album.detail, year: album.year }}
          countries={countries}
          onDone={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      )}
    </li>
  );
}

function IconButton({
  label: text,
  children,
  ...props
}: { label: string; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={text}
      title={text}
      className="grid size-10 place-items-center rounded-full border border-line text-carbon transition-colors hover:border-carbon disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  );
}