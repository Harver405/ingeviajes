import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold " +
  "transition-[transform,background-color,color,box-shadow] duration-300 ease-[var(--ease-brand)] " +
  "hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Texto negro sobre lima: contraste ~11:1
  primary: "bg-lima text-ink hover:bg-carbon hover:text-paper hover:shadow-[var(--shadow-soft)]",
  outline: "border-2 border-carbon text-carbon hover:bg-carbon hover:text-paper",
  // Para usar sobre fondos oscuros o el video
  light: "border-2 border-paper text-paper hover:bg-paper hover:text-ink",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: never } & Omit<ComponentProps<"button">, "className" | "children">;

export default function Button({ variant = "primary", className = "", children, ...rest }: AsLink | AsButton) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link className={classes} {...(rest as Omit<AsLink, keyof Common>)}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as Omit<AsButton, keyof Common>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}