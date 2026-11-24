"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Álbumes" },
  { href: "/admin/proximas", label: "Próximas salidas" },
  { href: "/admin/popup", label: "Pop-up" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Panel" className="flex flex-wrap gap-2">
      {links.map((l) => {
        const active = path === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active ? "bg-ink text-paper" : "bg-paper text-carbon hover:bg-line"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}