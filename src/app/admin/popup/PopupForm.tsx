"use client";

import { useActionState, useState, useTransition } from "react";
import type { PopupRow } from "@/lib/proximas";
import { site } from "@/data/site";
import type { Result } from "../actions";
import { deletePopup, savePopup } from "./actions";
import ImageField from "../ImageField";
import { uploadImage } from "../upload";
import { field, ghost, hint, label, primary } from "../ui";

type Popup = PopupRow & { imageUrl: string };

const shortcuts = [
  { label: "Próximas salidas", value: "#proximas" },
  { label: "Contacto", value: "#contacto" },
  ...(site.whatsapp ? [{ label: "WhatsApp", value: `https://wa.me/${site.whatsapp}` }] : []),
];

export default function PopupForm({ popup }: { popup: Popup | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState(popup?.alt ?? "");
  const [enlace, setEnlace] = useState(popup?.enlace ?? "");
  const [titulo, setTitulo] = useState(popup?.titulo ?? "");
  const [texto, setTexto] = useState(popup?.texto ?? "");
  const [boton, setBoton] = useState(popup?.boton ?? "");
  const [activo, setActivo] = useState(popup?.activo ?? true);
  const [confirming, setConfirming] = useState(false);
  const [deleting, start] = useTransition();

  const [state, action, pending] = useActionState<Result, FormData>(async (prev, form) => {
    if (!file && !popup) return { error: "Elige el afiche." };
    try {
      if (file) form.set("imagen", await uploadImage(file, "popup"));
    } catch (e) {
      return { error: e instanceof Error ? e.message : "No se pudo subir la imagen." };
    }
    const r = await savePopup(prev, form);
    if (r.ok) setFile(null);
    return r;
  }, {});

  return (
    <section className="mt-8 rounded-[var(--radius-card)] bg-paper p-6 md:p-8">
      {popup && (
        <p className="mb-6 rounded-xl bg-lima-soft px-4 py-3 text-sm text-carbon">
          Estado: <strong>{popup.activo ? "se está mostrando en la página" : "apagado"}</strong>
        </p>
      )}
      <form action={action} className="grid gap-5">
        <input type="hidden" name="imagen" value={popup?.imagen ?? ""} />
        <input type="hidden" name="anterior" value={popup?.imagen ?? ""} />

        <ImageField
          text="Afiche"
          help="Si escribes título o texto, la imagen se recorta como portada horizontal. Si solo subes un afiche (sin título ni texto), se muestra completo."
          current={popup?.imageUrl}
          file={file}
          onFile={setFile}
        />

        <label className={label}>
          Título (opcional)
          <input
            name="titulo"
            maxLength={80}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Inscripciones abiertas: México 2027"
            className={field}
          />
        </label>

        <label className={label}>
          Texto (opcional)
          <textarea
            name="texto"
            rows={3}
            maxLength={240}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Misión académica de 10 días con visitas a empresas. Cupos limitados."
            className={`${field} resize-y`}
          />
          <span className={`${hint} block text-right`}>{texto.length} / 240</span>
        </label>

        <label className={label}>
          Descripción de la imagen
          <input
            name="alt"
            required
            maxLength={200}
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Misión académica a México, junio 2027. Inscripciones abiertas."
            className={field}
          />
          <span className={`${hint} block`}>Para personas que usan lector de pantalla y para Google.</span>
        </label>

        <div>
          <label className={label}>
            ¿A dónde lleva al hacer clic? (opcional)
            <input
              name="enlace"
              maxLength={500}
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
              placeholder="https://… o #proximas"
              className={field}
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {shortcuts.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setEnlace(s.value)}
                className="rounded-full bg-lima-soft px-3 py-1.5 text-sm font-semibold text-carbon hover:bg-line"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {enlace && (
          <label className={label}>
            Texto del botón
            <input
              name="boton"
              maxLength={30}
              value={boton}
              onChange={(e) => setBoton(e.target.value)}
              placeholder="Ver más"
              className={field}
            />
            <span className={`${hint} block`}>Vacío = &quot;Ver más&quot;.</span>
          </label>
        )}

        <label className="flex items-center gap-3 text-sm font-semibold text-carbon">
          <input
            type="checkbox"
            name="activo"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="size-5 accent-[var(--color-lima-ink)]"
          />
          Mostrar en la página
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-error">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p role="status" className="text-sm font-semibold text-lima-ink">
            Guardado.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button disabled={pending} className={primary}>
            {pending ? "Guardando…" : "Guardar"}
          </button>
          {popup &&
            (confirming ? (
              <>
                <span className="text-sm text-carbon">¿Eliminar el pop-up?</span>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => start(() => deletePopup())}
                  className="rounded-full bg-error px-4 py-2 text-sm font-semibold text-paper disabled:opacity-60"
                >
                  Sí, eliminar
                </button>
                <button type="button" onClick={() => setConfirming(false)} className={ghost}>
                  No
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className={ghost}>
                Eliminar pop-up
              </button>
            ))}
        </div>
      </form>
    </section>
  );
}