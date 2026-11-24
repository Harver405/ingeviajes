export const site = {
  name: "INGEVIAJES",
  legalName: "INGEVIAJES SAS",
  tagline: "Especialistas en Turismo Pedagógico",
  city: "Bucaramanga, Colombia",
  nit: "900.687.996",
  rnt: "28353",
  address: "",
  whatsapp: "573112301208",
  phone: { display: "311 230 1208", tel: "+573112301208" },
  email: "ingeviajes2@gmail.com",
  social: {
    facebook: "https://www.facebook.com/Ingeviajes",
    instagram: "https://www.instagram.com/ingeviajes/",
  },
} as const;

export const navLinks = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "trayectoria", label: "Trayectoria" },
  { id: "experiencias", label: "Experiencias" },
  { id: "proximas", label: "Próximas salidas" },
  { id: "video", label: "Video" },
  { id: "contacto", label: "Contacto" },
] as const;

/** Enlace de WhatsApp con un mensaje ya escrito. */
export const whatsappLink = (text: string) =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : "#contacto";