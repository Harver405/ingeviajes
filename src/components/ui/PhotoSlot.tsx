import Image, { type StaticImageData } from "next/image";
import { ImageIcon } from "lucide-react";

type Props = {
  /** Ruta en /public ("/fotos/x.jpg") o foto importada. Sin src: espacio provisional. */
  src?: StaticImageData | string;
  alt: string;
  /** Qué foto real debe ir aquí (se muestra mientras no exista). */
  hint: string;
  /**
   * cover: la foto llena el recuadro (puede recortarse).
   * contain: la foto se ve completa y el espacio libre se rellena
   * con la misma foto desenfocada.
   */
  fit?: "cover" | "contain";
  framed?: boolean;
  className?: string;
  sizes?: string;
};

const imgFx = "transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-105";

/* Fotografía con marco de marca. Mientras no haya foto real muestra un
   espacio provisional claramente identificado (no usa imágenes de stock). */
export default function PhotoSlot({
  src,
  alt,
  hint,
  fit = "cover",
  framed = false,
  className = "",
  sizes = "100vw",
}: Props) {
  const frame = framed
    ? "photo-frame"
    : "overflow-hidden rounded-[var(--radius-photo)] border border-line";

  if (!src) {
    return (
      <div className={`relative ${frame} ${className}`}>
        <div className="flex size-full flex-col items-center justify-center gap-3 bg-lima-soft p-6 text-center">
          <ImageIcon aria-hidden className="size-10 text-lima-ink" />
          <p className="font-display text-sm font-semibold text-carbon">Fotografía provisional</p>
          <p className="max-w-xs text-xs text-muted">{hint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative bg-carbon ${frame} ${className}`}>
      {fit === "contain" && (
        // Fondo: la misma foto ampliada y desenfocada (decorativa)
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          sizes="10vw"
          quality={40}
          className="scale-125 object-cover opacity-70 blur-2xl"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={90}
        className={`${fit === "contain" ? "object-contain" : "object-cover"} ${imgFx}`}
      />
    </div>
  );
}