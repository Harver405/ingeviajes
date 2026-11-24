import { cacheLife } from "next/cache";
import Logo from "@/components/brand/Logo";
import { navLinks, site } from "@/data/site";

/* Año actual guardado en caché (se renueva a diario). */
async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const linkCls = "text-paper/75 transition-colors hover:text-lima";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <Logo plate />
          <p className="mt-5 max-w-[32ch] text-paper/75">
            {site.tagline}. Misiones académicas y visitas técnicas internacionales.
          </p>
        </div>

        <nav aria-label="Pie de página" className="md:col-span-3">
          <p className="font-display font-semibold">Navegación</p>
          <ul className="mt-4 grid gap-2.5">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`/#${l.id}`} className={linkCls}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="font-display font-semibold">Contacto</p>
          <ul className="mt-4 grid gap-2.5">
            <li>
              <a href={`tel:${site.phone.tel}`} className={linkCls}>
                {site.phone.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={`${linkCls} break-all`}>
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className={linkCls}>
                Facebook
              </a>
            </li>
            <li>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}>
                Instagram
              </a>
            </li>
            <li className="text-paper/75">{site.city}</li>
          </ul>
        </div>
      </div>

        <div className="border-t border-paper/10">
        <div className="container-site flex flex-col gap-3 py-6 text-sm text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>
            © <Year /> {site.legalName} · NIT {site.nit} · RNT {site.rnt}
          </p>
          <a href="/privacidad" className="transition-colors hover:text-lima">
            Política de tratamiento de datos personales
          </a>
        </div>
      </div>
    </footer>
  );
}