import Image from "next/image";
import { CalendarDays, MessageCircle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CountryFlags from "@/components/ui/CountryFlags";
import { placeOf } from "@/lib/albums";
import { mediaUrl } from "@/lib/media";
import { dateRange, days, getProximas, type ProximaRow } from "@/lib/proximas";
import { whatsappLink } from "@/data/site";

/* Próximas salidas: se publican desde /admin/proximas y desaparecen solas cuando pasa la fecha de salida. */
export default async function UpcomingTrips() {
  let trips: ProximaRow[] = [];
  try {
    trips = await getProximas();
  } catch (e) {
    console.error("[Próximas]", e);
  }

  return (
    <section id="proximas" aria-labelledby="proximas-titulo" className="bg-lima-soft py-24 md:py-32">
      <div className="container-site">
        <Reveal>
          <h2
            id="proximas-titulo"
            className="text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink"
          >
            Próximas salidas
          </h2>
          <p className="mt-4 max-w-[48ch] text-xl text-lima-ink md:text-2xl">
            Reserva tu cupo en nuestras próximas misiones y visitas técnicas.
          </p>
        </Reveal>

        {trips.length === 0 ? (
          <Reveal delay={0.1} className="mt-12">
            <div className="flex flex-col items-start gap-5 rounded-[var(--radius-card)] bg-paper p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <p className="max-w-[50ch] text-lg text-carbon">
                Estamos preparando nuevas salidas. Escríbenos y te contamos primero cuando abramos inscripciones.
              </p>
              <WhatsAppButton text="Hola, quiero que me avisen cuando abran nuevas salidas de INGEVIAJES.">
                Quiero que me avisen
              </WhatsAppButton>
            </div>
          </Reveal>
        ) : (
          <ul className="mt-12 grid gap-8 md:mt-16">
            {trips.map((t, i) => (
              <li key={t.id}>
                <Reveal delay={Math.min(i, 2) * 0.08}>
                  <Trip trip={t} priority={i === 0} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Trip({ trip: t, priority }: { trip: ProximaRow; priority: boolean }) {
  const place = placeOf(t.paises);
  const when = dateRange(t.salida, t.regreso);
  const soldOut = t.cupos === 0;
  const few = t.cupos !== null && t.cupos > 0 && t.cupos <= 10;

  return (
    <article className="grid overflow-hidden rounded-[var(--radius-card)] bg-paper shadow-[0_24px_60px_-40px_rgb(0_0_0/0.45)] lg:grid-cols-12">
      <div className="relative aspect-[4/3] lg:col-span-5 lg:aspect-auto lg:min-h-[22rem]">
        <Image
          src={mediaUrl(t.imagen)}
          alt={`${t.titulo}, ${place}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
        {t.cupos !== null && (
          <span
            className={`absolute top-4 left-4 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
              soldOut ? "bg-ink/80 text-paper" : few ? "bg-lima text-ink" : "bg-paper/90 text-ink"
            }`}
          >
            {soldOut ? "Cupos agotados" : few ? `¡Quedan ${t.cupos} cupos!` : `${t.cupos} cupos disponibles`}
          </span>
        )}
      </div>

      <div className="flex flex-col p-6 md:p-10 lg:col-span-7">
        <div className="flex items-center gap-3">
          <CountryFlags codes={t.paises} />
          <span className="font-display font-bold text-carbon">{place}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl leading-tight font-bold text-ink md:text-3xl">{t.titulo}</h3>
        <p className="mt-3 flex items-center gap-2 text-carbon">
          <CalendarDays aria-hidden className="size-5 text-lima-ink" />
          <span>
            {when} · {days(t.salida, t.regreso)} días
          </span>
        </p>
        {t.descripcion && (
          <p className="mt-5 max-w-[62ch] leading-relaxed whitespace-pre-line text-carbon">{t.descripcion}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-5 pt-8">
          {t.precio ? <p className="font-display text-xl font-bold text-ink">{t.precio}</p> : <span />}
          <WhatsAppButton
            text={
              soldOut
                ? `Hola, quiero estar en la lista de espera de "${t.titulo}" (${when}).`
                : `Hola, me interesa la experiencia "${t.titulo}" (${when}). ¿Me pueden dar más información?`
            }
          >
            {soldOut ? "Lista de espera" : "Me interesa"}
          </WhatsAppButton>
        </div>
      </div>
    </article>
  );
}

function WhatsAppButton({ text, children }: { text: string; children: React.ReactNode }) {
  const href = whatsappLink(text);
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-lima px-6 py-3 font-display font-semibold text-ink transition-colors hover:bg-ink hover:text-lima"
    >
      <MessageCircle aria-hidden className="size-5" />
      {children}
    </a>
  );
}