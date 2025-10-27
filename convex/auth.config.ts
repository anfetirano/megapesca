import type { AuthConfig } from "convex/server";
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!, // 👈 el issuer de arriba
      applicationID: "convex",                       // 👈 nombre de la plantilla JWT
    },
  ],
} satisfies AuthConfig;
