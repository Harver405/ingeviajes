"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import { navLinks } from "@/data/site";

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const reduce = useReducedMotion();


  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.body.style.overflow = "";
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", `#${id}`);
    });
  };

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 400 && !open);
  });


  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);


  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? "bg-paper shadow-[var(--shadow-soft)]" : "bg-paper"
      }`
    }
    >
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Logo />

        {/* Navegación escritorio */}
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={`group relative px-2 py-2 font-display whitespace-nowrap xl:px-3 text-sm font-semibold transition-colors hover:text-ink ${active === l.id ? "text-ink" : "text-carbon"}`}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-2 -bottom-0.5 xl:inset-x-3 h-0.5 origin-left bg-lima transition-transform duration-300 ${
                      active === l.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button href="#contacto" className="whitespace-nowrap">
            Solicitar cotización
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-lima-soft lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-movil"
            aria-label="Menú móvil"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
          >
            <ul className="container-site flex flex-col py-4">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={goTo(l.id)}
                    className={`flex items-center gap-3 border-b border-line py-4 font-display text-lg font-semibold ${
                      active === l.id ? "text-ink" : "text-carbon"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-0.5 bg-lima transition-all ${active === l.id ? "w-6" : "w-3"}`}
                    />
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-6">
                <Button href="#contacto" className="w-full" onClick={goTo("contacto")}>
                  Solicitar cotización
                </Button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}