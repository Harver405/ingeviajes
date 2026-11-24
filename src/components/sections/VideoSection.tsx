"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/* Video institucional en YouTube. Para cambiarlo, reemplaza el ID
   (lo que va después de "watch?v=" en el enlace). */
const VIDEO_ID = "jzS3qiukBDc";
const VIDEO_TITLE = "Nuestra historia: INGEVIAJES";
const watchUrl = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

const ease = [0.22, 1, 0.36, 1] as const;

export default function VideoSection() {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  // Miniatura en alta resolución; si YouTube no la tiene, usa la estándar; si tampoco carga, se oculta
  const [thumb, setThumb] = useState<string | null>(`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`);
  const onThumbError = () =>
    setThumb((t) => (t?.includes("maxresdefault") ? `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg` : null));

  return (
    <section id="video" aria-labelledby="video-titulo" className="overflow-x-clip bg-carbon py-24 text-paper md:py-32">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <h2
              id="video-titulo"
              className="text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-paper"
            >
              Nuestra <span className="text-lima">historia</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="max-w-[52ch] text-lg leading-relaxed text-paper/80">
              Conoce cómo nació INGEVIAJES y cómo, viaje a viaje, hemos llevado a estudiantes y profesionales a
              aprender en escenarios reales.
            </p>
          </Reveal>
        </div>

        {/* Reproductor: carga YouTube solo al hacer clic (la página no se pone lenta) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
          className="relative mt-14 aspect-video overflow-hidden rounded-[var(--radius-photo)] bg-ink shadow-[0_30px_70px_rgb(0_0_0/0.45)] ring-1 ring-paper/10 md:mt-16"
        >
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
              title={VIDEO_TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Reproducir video: ${VIDEO_TITLE}`}
              className="group absolute inset-0 size-full cursor-pointer"
            >
              {thumb && (
                <Image
                  key={thumb}
                  src={thumb}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 1152px) 1088px, 100vw"
                  onError={onThumbError}
                  className="object-cover opacity-80 transition-[transform,opacity] duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.03] group-hover:opacity-100"
                />
              )}
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

              {/* Botón de reproducir */}
              <span className="absolute inset-0 grid place-items-center">
                <span className="relative grid size-20 place-items-center rounded-full bg-lima text-ink shadow-[0_12px_30px_rgb(0_0_0/0.35)] transition-transform duration-300 group-hover:scale-110 md:size-24">
                  {!reduce && (
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-ping rounded-full bg-lima/40 [animation-duration:2.4s]"
                    />
                  )}
                  <Play aria-hidden className="relative ml-1 size-8 fill-current md:size-9" />
                </span>
              </span>

              <span className="absolute bottom-5 left-5 text-left md:bottom-7 md:left-7">
                <span className="block font-display text-lg font-bold text-paper md:text-2xl">{VIDEO_TITLE}</span>
                <span className="text-sm text-paper/70">Ver video</span>
              </span>
            </button>
          )}
        </motion.div>

        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-paper/70 underline decoration-lima/60 underline-offset-4 transition-colors hover:text-paper hover:decoration-lima"
        >
          Ver en YouTube
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">(se abre en otra pestaña)</span>
        </a>
      </div>
    </section>
  );
}