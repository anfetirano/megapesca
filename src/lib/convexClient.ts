import { ConvexReactClient } from "convex/react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  // Opcional: ayuda en dev si te olvidas la URL
  // console.warn("Falta NEXT_PUBLIC_CONVEX_URL en .env.local");
}

export const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || ""
);
