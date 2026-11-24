import { ArrowUpRight, MessageCircle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { site, whatsappLink } from "@/data/site";

const rows = [
  { label: "Teléfono y WhatsApp", value: site.phone.display, href: `tel:${site.phone.tel}` },
  { label: "Correo", value: site.email, href: `mailto:${site.email}` },
  { label: "Facebook", value: "facebook.com/Ingeviajes", href: site.social.facebook, external: true },
  { label: "Instagram", value: "@ingeviajes", href: site.social.instagram, external: true },
];

export default function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-paper py-24 md:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6">
          <h2
            id="contacto-titulo"
            className="text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink"
          >
            Contacto
          </h2>
          <p className="mt-4 text-xl text-lima-ink md:text-2xl">Cuéntanos tu idea y armamos la propuesta.</p>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-carbon">
            Escríbenos con el programa, la institución y el destino que tienes en mente, y te respondemos con una
            cotización a la medida de tu grupo.
          </p>
          <a
            href={whatsappLink("Hola, quiero solicitar una cotización para un viaje académico con INGEVIAJES.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-lima px-7 py-4 font-display text-lg font-semibold text-ink transition-colors hover:bg-ink hover:text-lima"
          >
            <MessageCircle aria-hidden className="size-6" />
            Escribir por WhatsApp
          </a>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:self-end">
          <dl>
            {rows.map((r) => (
              <div key={r.label} className="border-t border-line py-5">
                <dt className="text-sm text-muted">{r.label}</dt>
                <dd className="mt-1">
                  <a
                    href={r.href}
                    {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex items-center gap-2 font-display text-xl font-semibold break-all text-ink transition-colors hover:text-lima-ink md:text-2xl"
                  >
                    {r.value}
                    <ArrowUpRight
                      aria-hidden
                      className="size-5 shrink-0 text-lima-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </dd>
              </div>
            ))}
            <div className="border-y border-line py-5">
              <dt className="text-sm text-muted">Ciudad</dt>
              <dd className="mt-1 font-display text-xl font-semibold text-ink md:text-2xl">{site.city}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}