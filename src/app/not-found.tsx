import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { whatsappLink } from "@/data/site";

export const metadata = { title: "Página no encontrada" };

/* Página 404: cuando alguien entra a una dirección que no existe. */
export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-lima-soft px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-10 font-display text-7xl font-bold text-lima-ink md:text-8xl">404</p>
        <h1 className="mt-4 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight text-ink">Esta página no existe</h1>
        <p className="mx-auto mt-4 max-w-[42ch] text-lg text-carbon">
          Puede que el enlace esté mal escrito o que la página se haya movido. Te llevamos de vuelta al inicio.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-lima px-6 py-3 font-display font-semibold text-ink transition-colors hover:bg-ink hover:text-lima"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Volver al inicio
          </Link>
          <a
            href={whatsappLink("Hola, estaba en la página de INGEVIAJES y quiero más información.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 font-display font-semibold text-ink transition-colors hover:border-ink"
          >
            <MessageCircle aria-hidden className="size-4" />
            Escríbenos
          </a>
        </div>
      </div>
    </main>
  );
}