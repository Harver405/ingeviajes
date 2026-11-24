import Image from "next/image";
import Link from "next/link";

type Props = {
  /** Añade una placa blanca detrás del logo (para fondos oscuros o el video). */
  plate?: boolean;
  className?: string;
};

/* Logo original sin modificar. Para reemplazarlo: sustituye public/brand/logo.png
   y actualiza width/height con las medidas reales del nuevo archivo. */
export default function Logo({ plate = false, className = "" }: Props) {
  return (
    <Link
      href="/#inicio"
      aria-label="INGEVIAJES, ir al inicio"
      className={`inline-flex shrink-0 items-center rounded-xl transition-[background-color,padding] duration-300 ${
        plate ? "bg-paper px-2 py-1" : "px-0 py-0"
      } ${className}`}
    >
      <Image
        src="/brand/logo.png"
        alt="IngeViajes"
        width={321}
        height={280}
        priority
        className="h-12 w-auto md:h-14"
      />
    </Link>
  );
}