"use client";

import { motion, useReducedMotion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import PhotoSlot from "@/components/ui/PhotoSlot";
import Parallax from "@/components/ui/Parallax";

/* Cómo trabaja INGEVIAJES. Solo información confirmada por la empresa. */
const principles = [
  {
    title: "Propósito formativo",
    text: "Cada viaje parte de lo que el grupo necesita aprender y lo conecta con escenarios reales.",
  },
  {
    title: "Red internacional",
    text: "Contactos construidos desde 2011 con universidades, empresas y proyectos del sector productivo.",
  },
  {
    title: "Diseño a la medida",
    text: "Experiencias nacionales e internacionales según el interés específico de cada grupo.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function About() {
  const reduce = useReducedMotion();

  return (
        <section id="nosotros" aria-labelledby="nosotros-titulo" className="overflow-x-clip bg-paper py-24 md:py-32">
      <div className="container-site">
        {/* Planteamiento: titular protagonista + texto de apoyo */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <h2
              id="nosotros-titulo"
              className="text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink"
            >
              El conocimiento no tiene fronteras.{" "}
              <span className="text-lima-ink">Llevamos el aprendizaje más lejos.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="max-w-[62ch] text-lg leading-relaxed text-carbon">
              INGEVIAJES es una empresa especializada en turismo pedagógico. Diseñamos misiones académicas y
              visitas técnicas que conectan a estudiantes, docentes y profesionales con universidades, empresas
              y proyectos del sector productivo.
            </p>
          </Reveal>
        </div>

        {/* Fotografía protagonista + detalle + forma de trabajar */}
        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Foto principal: se revela como una cortina al entrar en pantalla (momento principal de la sección) */}
          <motion.figure
            className="lg:col-span-8"
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              variants={{ hidden: { clipPath: "inset(0 0 100% 0)" }, show: { clipPath: "inset(0 0 0% 0)" } }}
              transition={{ duration: 1.1, ease }}
              className="overflow-hidden rounded-[var(--radius-photo)]"
            >
              <motion.div
                variants={{ hidden: { scale: 1.12 }, show: { scale: 1 } }}
                transition={{ duration: 1.6, ease }}
              >
                <PhotoSlot
                  framed
                  src="/fotos/UAE-nosotros-1.jpeg"
                  className="aspect-[16/9] w-full"
                  alt="Delegación de la Universidad Piloto de Colombia frente a las pantallas de cotizaciones de una bolsa de valores en Emiratos Árabes Unidos"
                  hint="Misión académica Universidad Piloto de Colombia 2017."
                  sizes="(min-width: 1024px) 66vw, 100vw"
                />
              </motion.div>
            </motion.div>
            <figcaption className="mt-4 flex items-center gap-3 text-sm text-muted">
              <span aria-hidden className="h-px w-8 bg-lima" />
              Misión académica · Universidad Piloto de Colombia · Emiratos Árabes Unidos 2017
            </figcaption>
          </motion.figure>

          {/* Foto de apoyo: alineada abajo para escalonar la composición */}
          <Parallax offset={-24} className="lg:col-span-4 lg:self-end">
            <Reveal from="right" delay={0.2}>
              <figure>
                <PhotoSlot
                  src="/fotos/UAE-nosotros-2.jpeg"
                  className="aspect-[3/2] w-full shadow-[0_18px_40px_rgb(0_0_0/0.12)]"
                  alt="Estudiantes de Ingeniería Financiera de la Universidad Piloto de Colombia en una sala de juntas durante una misión académica"
                  hint="Misión académica Ingeniería Financiera 2018."
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
                <figcaption className="mt-4 text-sm text-muted">
                  Misión académica · Ingeniería Financiera · Universidad Piloto · 2018
                </figcaption>
              </figure>
            </Reveal>
          </Parallax>
        </div>

        {/* Forma de trabajar: texto editorial con filetes, sin tarjetas */}
        <div className="mt-20 grid gap-8 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-3">
            <h3 className="font-display text-xl font-bold text-ink">Cómo trabajamos</h3>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-9">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={0.1 * i}>
                <div className="group border-t border-line pt-5 transition-colors duration-500 hover:border-lima">
                  <h4 className="font-display font-semibold text-ink">{p.title}</h4>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}