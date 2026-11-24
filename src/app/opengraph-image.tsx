import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/* Imagen que aparece al compartir el enlace en WhatsApp, Facebook, LinkedIn, etc. (1200 × 630). */
export const alt = "INGEVIAJES · Especialistas en Turismo Pedagógico";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const toDataUrl = (file: Buffer, type: string) => `data:${type};base64,${file.toString("base64")}`;

export default async function OpengraphImage() {
  // Rutas fijas para que Vercel solo incluya estos archivos
  const [photoFile, logoFile, bold, medium] = await Promise.all([
    readFile(join(process.cwd(), "public/fotos/UAE-home.jpeg")),
    readFile(join(process.cwd(), "public/brand/logo.png")),
    readFile(join(process.cwd(), "node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff")),
    readFile(join(process.cwd(), "node_modules/@fontsource/montserrat/files/montserrat-latin-500-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", fontFamily: "Montserrat" }}>
        <img
          src={toDataUrl(photoFile, "image/jpeg")}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              "linear-gradient(90deg, rgba(12,12,12,0.94) 0%, rgba(12,12,12,0.82) 48%, rgba(12,12,12,0.15) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: 720,
            height: 630,
            padding: "0 72px",
          }}
        >
          <div style={{ display: "flex", background: "white", borderRadius: 20, padding: "14px 20px" }}>
            <img src={toDataUrl(logoFile, "image/png")} alt="" width={115} height={100} />
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 60, fontWeight: 700, color: "white", lineHeight: 1.08 }}>
            Especialistas en Turismo Pedagógico
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 28, fontWeight: 500, color: "#a6d64b", lineHeight: 1.3 }}>
            Misiones académicas y visitas técnicas internacionales
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Montserrat", data: bold, weight: 700, style: "normal" },
        { name: "Montserrat", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}