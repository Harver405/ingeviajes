"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Images, RotateCw, X } from "lucide-react";
import type { Photo } from "@/lib/facebook";

const ease = [0.22, 1, 0.36, 1] as const;

export type GalleryAlbum = {
  id: string;
  title: string;
  detail: string;
  year: number;
  place: string; // "Brasil y Argentina"
  flags: ReactNode; // banderas ya dibujadas en el servidor
  count: number;
  images: string[]; // fotos para la portada que va cambiando
};

/* Portada que cambia sola entre fotos del álbum, en orden aleatorio.
   Precarga la siguiente foto antes de mostrarla para que el cambio sea suave. */
function RotatingCover({ images, offset }: { images: string[]; offset: number }) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduce || images.length < 2) return;
    let alive = true;
    let timer = 0;
    const tick = (cur: number) => {
      let next = cur;
      while (next === cur) next = Math.floor(Math.random() * images.length);
      const img = new window.Image();
      img.onload = () => {
        if (!alive) return;
        setIdx(next);
        timer = window.setTimeout(() => tick(next), 6000);
      };
      img.onerror = () => alive && (timer = window.setTimeout(() => tick(cur), 6000));
      img.src = images[next];
    };
    timer = window.setTimeout(() => tick(0), 3000 + offset);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [images, reduce, offset]);

  if (!images.length) {
    return (
      <span className="absolute inset-0 grid place-items-center bg-carbon">
        <Images aria-hidden className="size-10 text-paper/25" />
      </span>
    );
  }

  return (
    <span className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-105">
      <AnimatePresence initial={false}>
        <motion.span
          key={idx}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={images[idx]}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type Loaded = { status: "ok"; photos: Photo[] } | { status: "error" };

export default function ExperiencesGallery({ albums }: { albums: GalleryAlbum[] }) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);
  const [viewer, setViewer] = useState<number | null>(null); // foto ampliada
  const [loaded, setLoaded] = useState<Record<string, Loaded>>({});
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const album = albums.find((a) => a.id === openId) ?? null;
  const state = openId ? loaded[openId] : undefined;
  const photos = state?.status === "ok" ? state.photos : [];

  const load = useCallback((id: string) => {
    fetch(`/api/fotos/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { photos: Photo[] }) => setLoaded((s) => ({ ...s, [id]: { status: "ok", photos: d.photos } })))
      .catch(() => setLoaded((s) => ({ ...s, [id]: { status: "error" } })));
  }, []);

  const open = (id: string, el: HTMLElement) => {
    opener.current = el;
    setViewer(null);
    setOpenId(id);
    if (!loaded[id] || loaded[id].status === "error") load(id);
  };

  const close = useCallback(() => {
    setOpenId(null);
    setViewer(null);
    opener.current?.focus();
  }, []);

  const retry = () => {
    if (!openId) return;
    setLoaded((s) => {
      const next = { ...s };
      delete next[openId];
      return next;
    });
    load(openId);
  };

  const step = useCallback(
    (dir: 1 | -1) => setViewer((v) => (v === null || !photos.length ? v : (v + dir + photos.length) % photos.length)),
    [photos.length],
  );

  // Teclado, bloqueo del scroll de fondo y foco al abrir
  useEffect(() => {
    if (!openId) return;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewer !== null) setViewer(null);
        else close();
      }
      if (viewer !== null && e.key === "ArrowRight") step(1);
      if (viewer !== null && e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openId, viewer, close, step]);

  return (
    <>
      {/* Álbumes */}
      <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {albums.map((a, i) => {
          return (
            <motion.li
              key={a.id}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease }}
            >
              <button
                type="button"
                onClick={(e) => open(a.id, e.currentTarget)}
                aria-label={`Ver fotos: ${a.place} ${a.year}, ${a.title}`}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] bg-carbon text-left"
              >
                <RotatingCover images={a.images} offset={i * 1100} />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

                {a.count > 0 && (
                  <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1 text-xs font-semibold text-paper backdrop-blur-sm">
                    <Images aria-hidden className="size-3.5" />
                    {a.count} fotos
                  </span>
                )}

                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="flex items-center gap-3">
                    {a.flags}
                    <span className="font-display text-lg font-bold text-paper">
                      {a.place} <span className="font-semibold text-paper/70">· {a.year}</span>
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm text-paper/80">{a.title}</span>
                  <span className="mt-3 inline-flex translate-y-1 items-center gap-1.5 text-sm font-semibold text-lima opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    Ver fotos
                    <ChevronRight aria-hidden className="size-4" />
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      {/* Ventana emergente del álbum */}
      <AnimatePresence>
        {album && (
          <motion.div
            key="album"
            role="dialog"
            aria-modal="true"
            aria-labelledby="album-titulo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-ink/90 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              initial={reduce ? false : { y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className="mx-auto min-h-full max-w-6xl bg-carbon sm:my-8 sm:min-h-0 sm:rounded-[var(--radius-card)]"
            >
              {/* Encabezado */}
              <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-paper/10 bg-carbon/95 px-5 py-4 backdrop-blur-sm sm:rounded-t-[var(--radius-card)] md:px-8">
                {album.flags}
                <div className="min-w-0 flex-1">
                  <h3 id="album-titulo" className="truncate font-display text-lg font-bold text-paper md:text-xl">
                    {album.place} · {album.year}
                  </h3>
                  <p className="truncate text-sm text-paper/70">
                    {album.title} · {album.detail}
                  </p>
                </div>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={close}
                  aria-label="Cerrar galería"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-paper/20 text-paper transition-colors hover:border-lima hover:bg-lima hover:text-ink"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Contenido */}
              <div className="p-5 md:p-8" aria-live="polite">
                {!state && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Cargando fotos">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="aspect-square animate-pulse rounded-xl bg-paper/10" />
                    ))}
                  </div>
                )}

                {state?.status === "error" && (
                  <div className="grid place-items-center gap-4 py-16 text-center">
                    <p className="text-paper/80">No pudimos cargar las fotos de este viaje en este momento.</p>
                    <button
                      type="button"
                      onClick={retry}
                      className="inline-flex items-center gap-2 rounded-full bg-lima px-5 py-2.5 font-display text-sm font-semibold text-ink"
                    >
                      <RotateCw aria-hidden className="size-4" />
                      Intentar de nuevo
                    </button>
                  </div>
                )}

                {state?.status === "ok" && photos.length === 0 && (
                  <p className="py-16 text-center text-paper/80">Este álbum todavía no tiene fotos publicadas.</p>
                )}

                {photos.length > 0 && (
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {photos.map((p, i) => (
                      <li key={p.full}>
                        <button
                          type="button"
                          onClick={() => setViewer(i)}
                          aria-label={`Ampliar foto ${i + 1} de ${photos.length}`}
                          className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-paper/5"
                        >
                          <Image
                            src={p.thumb}
                            alt=""
                            fill
                            unoptimized
                            loading="lazy"
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                            className="object-cover transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-105"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>

            {/* Foto ampliada */}
            <AnimatePresence>
              {viewer !== null && photos[viewer] && (
                <motion.div
                  key="viewer"
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Foto ${viewer + 1} de ${photos.length}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[80] flex flex-col bg-ink/95"
                  onClick={(e) => e.target === e.currentTarget && setViewer(null)}
                >
                  <div className="flex items-center justify-between px-5 py-4 text-paper">
                    <span className="text-sm tabular-nums text-paper/70">
                      {viewer + 1} / {photos.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewer(null)}
                      aria-label="Volver al álbum"
                      className="grid size-10 place-items-center rounded-full border border-paper/20 transition-colors hover:border-lima hover:bg-lima hover:text-ink"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <div
                    className="relative flex-1"
                    onClick={(e) => e.target === e.currentTarget && setViewer(null)}
                  >
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.div
                        key={viewer}
                        className="absolute inset-0 mx-4 mb-4 md:mx-20"
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        drag={reduce ? false : "x"}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.4}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -80) step(1);
                          else if (info.offset.x > 80) step(-1);
                        }}
                      >
                        <Image
                          src={photos[viewer].full}
                          alt={`Foto ${viewer + 1} de ${album.place} ${album.year}`}
                          fill
                          unoptimized
                          sizes="100vw"
                          className="pointer-events-none object-contain select-none"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {photos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => step(-1)}
                          aria-label="Foto anterior"
                          className="absolute top-1/2 left-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-paper transition-colors hover:bg-lima hover:text-ink md:left-5"
                        >
                          <ChevronLeft className="size-6" />
                        </button>
                        <button
                          type="button"
                          onClick={() => step(1)}
                          aria-label="Foto siguiente"
                          className="absolute top-1/2 right-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-paper transition-colors hover:bg-lima hover:text-ink md:right-5"
                        >
                          <ChevronRight className="size-6" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}