import PromoPopup from "@/components/ui/PromoPopup";
import { mediaUrl } from "@/lib/media";
import { getPopup, type PopupRow } from "@/lib/proximas";

export default async function Promo() {
  let popup: PopupRow | null = null;
  try {
    popup = await getPopup();
  } catch (e) {
    console.error("[Pop-up]", e);
  }
  if (!popup) return null;
  return (
    <PromoPopup
      src={mediaUrl(popup.imagen)}
      alt={popup.alt}
      href={popup.enlace}
      version={popup.actualizado}
      title={popup.titulo}
      text={popup.texto}
      cta={popup.boton}
    />
  );
}