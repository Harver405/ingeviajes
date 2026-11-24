/* Banderas en SVG. Solo se usa en componentes de servidor:
   así el navegador recibe únicamente las banderas que se muestran. */
import * as icons from "country-flag-icons/react/3x2";

type Icon = (props: { className?: string }) => React.ReactNode;

export default function CountryFlags({ codes }: { codes: string[] }) {
  return (
    <span aria-hidden className="flex shrink-0 -space-x-2">
      {codes.map((code) => {
        const Flag = (icons as unknown as Record<string, Icon>)[code];
        return Flag ? (
          <Flag key={code} className="h-6 w-9 rounded-[4px] shadow-[0_2px_6px_rgb(0_0_0/0.3)] ring-1 ring-paper/60" />
        ) : null;
      })}
    </span>
  );
}