import type { AuthConfig } from "convex/server";

/**
 * Convex validará los JWT emitidos por Clerk con el template "convex".
 * El domain lo tomamos de la variable de entorno CLERK_JWT_ISSUER_DOMAIN.
 */
export default {
  providers: [
    {
      // 👇 Este domain debe ser el "Issuer" de tu plantilla JWT "convex" en Clerk
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      // 👇 El nombre del template en Clerk (debe llamarse exactamente "convex")
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
