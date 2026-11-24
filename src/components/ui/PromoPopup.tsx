"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  href: string;
  version: string;
  title: string;
  text: string;
  cta: string;
};

const KEY = "ingeviajes-popup";

/* Pop-up promocional que aparece una vez por visita. Si el cliente lo cambia en el panel, vuelve a aparecer.
   Con título, texto o enlace se muestra como tarjeta; con solo la imagen, como afiche completo. */
export default function PromoPopup({ src, alt, href, version, title, text, cta }: Props) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const hasCopy = Boolean(title || text || href);
  const external = href.startsWith("http");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === version) return;
    } catch {}
    const t = window.setTimeout(() => setOpen(true), 1500);
    return () => window.clearTimeout(t);
  }, [version]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, version);
    } catch {}
  }, [version]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panel.current?.focus({ preventScroll: true }); // lectores de pantalla anuncian el pop-up
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          {...(title ? { "aria-labelledby": "promo-titulo" } : { "aria-label": alt })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-4 backdrop-blur-md sm:p-6"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            ref={panel}
            tabIndex={-1}
            className={`relative max-h-[92dvh] w-full overflow-y-auto rounded-[var(--radius-card)] bg-paper outline-none shadow-[0_40px_120px_-30px_rgb(0_0_0/0.65)] ${
              hasCopy ? "max-w-[34rem]" : "max-w-fit"
            }`}
          >
            <div className="bg-ink">
              <Image
                src={src}
                alt={hasCopy ? "" : alt}
                width={1080}
                height={1350}
                sizes="(min-width: 640px) 34rem, 92vw"
                className={
                  hasCopy
                    ? "block h-auto max-h-[46dvh] w-full object-cover"
                    : "block h-auto max-h-[86dvh] w-auto max-w-full"
                }
              />
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-ink/55 text-paper backdrop-blur-sm transition-colors hover:bg-lima hover:text-ink"
            >
              <X className="size-5" />
            </button>

            {hasCopy && (
              <div className="p-6 sm:p-8">
                {title && (
                  <h2 id="promo-titulo" className="font-display text-2xl leading-tight font-bold text-ink sm:text-[1.75rem]">
                    {title}
                  </h2>
                )}
                {text && <p className={`leading-relaxed text-carbon ${title ? "mt-3" : ""}`}>{text}</p>}
                <div className={`flex flex-wrap items-center gap-2 ${title || text ? "mt-6" : ""}`}>
                  {href && (
                    <a
                      href={href}
                      onClick={close}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group inline-flex items-center gap-2 rounded-full bg-lima px-6 py-3 font-display font-semibold text-ink transition-colors hover:bg-ink hover:text-lima"
                    >
                      {cta || "Ver más"}
                      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-full px-4 py-3 text-sm font-semibold text-muted transition-colors hover:text-ink"
                  >
                    Ahora no
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}