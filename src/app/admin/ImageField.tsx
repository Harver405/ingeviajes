"use client";

import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { ACCEPT } from "./upload";
import { label as labelCls, hint } from "./ui";

/* Selector de imagen con vista previa. La imagen se sube al guardar, no al elegirla. */
export default function ImageField({
  text,
  help,
  current,
  file,
  onFile,
}: {
  text: string;
  help: string;
  current?: string; // dirección de la imagen actual
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- la URL temporal depende del archivo elegido
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = file ? preview : current;

  return (
    <div>
      <span className={labelCls}>{text}</span>
      <label className="mt-1.5 flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-line bg-paper p-3 transition-colors hover:border-lima-ink">
        <span className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-lima-soft">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa local
            <img src={shown} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <ImagePlus aria-hidden className="size-7 text-lima-ink" />
          )}
        </span>
        <span className="text-sm text-carbon">
          <span className="font-semibold">{shown ? "Cambiar imagen" : "Elegir imagen"}</span>
          <span className="block text-muted">{file ? file.name : "JPG, PNG o WebP"}</span>
        </span>
        <input
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <p className={hint}>{help}</p>
    </div>
  );
}