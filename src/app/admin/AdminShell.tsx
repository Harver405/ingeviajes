import type { ReactNode } from "react";
import AdminNav from "./AdminNav";
import { logout } from "./actions";

/* Estructura común de las páginas del panel: menú, título y botón Salir. */
export default function AdminShell({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-4xl px-5 py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminNav />
        <form action={logout}>
          <button className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-carbon hover:border-carbon">
            Salir
          </button>
        </form>
      </div>
      <h1 className="mt-10 font-display text-3xl font-bold text-ink">{title}</h1>
      <p className="mt-1 text-muted">{intro}</p>
      {children}
    </main>
  );
}

export function NoAccess() {
  return (
    <p className="mt-10 rounded-[var(--radius-card)] bg-paper p-6 text-carbon">
      Tu usuario no tiene permiso de administrador.
    </p>
  );
}