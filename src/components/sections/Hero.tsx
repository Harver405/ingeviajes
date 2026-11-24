"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Pause, Play } from "lucide-react";
import Button from "@/components/ui/Button";
import { site } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

// Aparición escalonada de los textos
const item = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 + i * 0.12, ease } }),
};

/* Lo que ofrece INGEVIAJES, visible desde la portada (enlaza a Experiencias). */
const offer = ["Misiones académicas internacionales", "Visitas técnicas especializadas", "Experiencias a la medida"];

/* Evidencia real: fotos de viajes de INGEVIAJES (public/fotos).
   Para agregar una, añade un objeto; el carrusel la incluye solo. */
const proof = [
  { src: "/fotos/Mexico-home.jpg", caption: "México 2022", detail: "Misión académica · Universidad Piloto", alt: "Delegación del Programa Formativo Internacional México 2022" },
  { src: "/fotos/UAE-home.jpeg", caption: " Emiratos Árabes Unidos 2017", detail: "Misión académica · Universidad Piloto", alt: "Delegación de INGEVIAJES en Dubái, 2017" },
];

const SLIDE_MS = 5500;

/** Foto destacada que rota sola; se detiene al pasar el mouse o con el foco. */
function ProofShowcase({ reduce }: { reduce: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % proof.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, reduce]);

  const current = proof[index];

  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carrusel"
      aria-label="Experiencias reales de nuestros grupos"
      className="relative"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-photo)] bg-ink shadow-[0_30px_70px_rgb(0_0_0/0.45)] ring-1 ring-paper/15">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.9 }, scale: { duration: SLIDE_MS / 1000 + 1, ease: "linear" } }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1280px) 560px, (min-width: 1024px) 48vw, 0px"
              quality={90}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Pie sobre la foto, con degradado solo en la franja inferior */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-5 pt-14 pb-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figcaption
              key={current.caption}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
            >
              <p className="font-display text-lg font-bold text-paper">{current.caption}</p>
              <p className="text-sm text-paper/75">{current.detail}</p>
            </motion.figcaption>
          </AnimatePresence>
        </div>
      </div>

      {/* Selector de fotos con barra de tiempo */}
      <div className="mt-4 flex items-center gap-2">
        {proof.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver foto: ${p.caption}`}
            aria-current={i === index}
            className="flex-1 py-2"
          >
            <span className="relative block h-1 overflow-hidden rounded-full bg-paper/30">
              {i === index && (
                <motion.span
                  key={`${index}-${paused}`}
                  className="absolute inset-y-0 left-0 bg-lima"
                  initial={{ width: reduce || paused ? "100%" : "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: reduce || paused ? 0 : SLIDE_MS / 1000, ease: "linear" }}
                />
              )}
              {i < index && <span className="absolute inset-0 bg-paper/70" />}
            </span>
          </button>
        ))}
      </div>
    </motion.figure>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);

  // Parallax suave del video al bajar
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  // Si el usuario prefiere menos movimiento, el video arranca en pausa
  useEffect(() => {
    if (reduce) videoRef.current?.pause();
  }, [reduce]);

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-carbon pt-20 text-paper"
    >
      {/* Video de fondo (public/video). Para cambiarlo, reemplaza esos archivos. */}
      <motion.div style={{ y: reduce ? 0 : videoY }} className="absolute inset-0 -z-20">
        <video
          ref={videoRef}
          className="size-full scale-105 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster.jpg"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-hidden
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Sombra dirigida: oscurece solo donde va el texto y deja ver la industria a la derecha */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(0_0_0/0.82)_0%,rgb(0_0_0/0.55)_45%,rgb(0_0_0/0.1)_75%),linear-gradient(0deg,rgb(0_0_0/0.7)_0%,transparent_35%)]"
      />

      {/* Contenido principal */}
      <motion.div
        style={reduce ? undefined : { y: contentY }}
        className="container-site grid flex-1 items-center gap-12 py-14 lg:grid-cols-12 lg:py-20"
      >
        <motion.div initial="hidden" animate="show" className="lg:col-span-6">
          <motion.p
            custom={0}
            variants={item}
            className="mb-6 flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-lima"
          >
            <span aria-hidden className="h-0.5 w-10 bg-lima" />
            {site.tagline}
          </motion.p>

          <motion.h1 custom={1} variants={item} className="text-paper">
            <span className="block font-display text-2xl font-semibold text-paper/80 sm:text-3xl">
              Aprender viajando:
            </span>
            <span className="mt-2 block text-[clamp(2.5rem,4.2vw,4rem)] leading-[1.02] tracking-tight">
              del aula a{" "}
              <span className="relative inline-block text-lima">
                escenarios reales
                {/* Trazo de ruta que se dibuja bajo la frase clave */}
                <svg
                  aria-hidden
                  viewBox="0 0 300 20"
                  preserveAspectRatio="none"
                  className="absolute -bottom-3 left-0 h-3 w-full overflow-visible"
                >
                  <motion.path
                    d="M2 14 C 80 4, 160 4, 298 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.9, ease }}
                  />
                </svg>
              </span>
            </span>
          </motion.h1>

          <motion.p custom={2} variants={item} className="mt-9 max-w-xl text-lg leading-relaxed text-paper/85">
            Misiones académicas internacionales y visitas técnicas hechas a la medida de cada grupo, para
            conectar a estudiantes, docentes y profesionales con universidades, empresas y proyectos reales.
          </motion.p>

          <motion.div custom={3} variants={item} className="mt-10 flex flex-wrap gap-4">
            <Button href="#experiencias">Conocer experiencias</Button>
            <Button href="#contacto" variant="light">
              Solicitar cotización
            </Button>
          </motion.div>
        </motion.div>

        {/* Evidencia real (escritorio): foto destacada que rota entre viajes reales */}
        <div className="hidden lg:col-span-6 lg:block">
          <ProofShowcase reduce={reduce ?? false} />
        </div>
      </motion.div>

      {/* Franja inferior: oferta + trayectoria + control del video */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1, ease }}
        className="border-t border-paper/15 bg-ink/30"
      >
        <div className="container-site flex items-center gap-6 py-4">
          <p className="shrink-0 font-display text-sm font-semibold">
            <span className="text-lima">Desde 2011</span>
            <span className="hidden text-paper/60 sm:inline xl:hidden"> · experiencias educativas</span>
          </p>

          <ol className="hidden flex-1 items-center justify-center gap-8 xl:flex">
            {offer.map((o, i) => (
              <li key={o}>
                <a
                  href="#experiencias"
                  className="group flex items-baseline gap-2 whitespace-nowrap text-sm text-paper/80 transition-colors hover:text-paper"
                >
                  <span className="font-display text-xs font-bold text-lima">{String(i + 1).padStart(2, "0")}</span>
                  <span className="border-b border-transparent transition-colors group-hover:border-lima">{o}</span>
                </a>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={toggleVideo}
            aria-label={playing ? "Pausar video de fondo" : "Reproducir video de fondo"}
            className="ml-auto grid size-10 shrink-0 place-items-center rounded-full border border-paper/40 text-paper transition-colors hover:bg-paper hover:text-ink xl:ml-0"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
        </div>
      </motion.div>
    </section>
  );
}