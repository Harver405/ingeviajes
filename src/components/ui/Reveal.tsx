"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Dirección desde la que aparece */
  from?: "up" | "left" | "right";
};

const offset = { up: { y: 32 }, left: { x: -40 }, right: { x: 40 } };

/** Aparición suave al entrar en pantalla. Se reutiliza en todas las secciones. */
export default function Reveal({ children, className, delay = 0, from = "up" }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, ...offset[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}