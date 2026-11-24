import type { ReactNode } from "react";

type Tone = "white" | "soft" | "dark";

const tones: Record<Tone, string> = {
  white: "bg-paper",
  soft: "bg-lima-soft",
  dark: "bg-carbon text-paper [&_h2]:text-paper",
};

type Props = {
  id: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  tone?: Tone;
  className?: string;
  children?: ReactNode;
};

/** Sección estándar: espaciado, ancho máximo y encabezado coherentes en todo el sitio. */
export default function Section({ id, eyebrow, title, intro, tone = "white", className = "", children }: Props) {
  return (
    <section id={id} className={`py-20 md:py-28 ${tones[tone]} ${className}`}>
      <div className="container-site">
        {(eyebrow || title || intro) && (
          <header className="mb-12 max-w-2xl">
            {eyebrow && (
              <p className="mb-3 flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.2em]">
                <span aria-hidden className="h-0.5 w-8 bg-lima" />
                <span className={tone === "dark" ? "text-lima" : "text-lima-ink"}>{eyebrow}</span>
              </p>
            )}
            {title && <h2 className="text-3xl leading-tight md:text-4xl">{title}</h2>}
            {intro && (
              <p className={`mt-4 text-lg ${tone === "dark" ? "text-paper/80" : "text-muted"}`}>{intro}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}