import type { NextConfig } from "next";

/* Imágenes subidas desde el panel (Supabase Storage). */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl}/storage/v1/object/public/medios/**`)] : [],
  },
};

export default nextConfig;