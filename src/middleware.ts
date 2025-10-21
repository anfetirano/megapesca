// src/middleware.ts — Clerk v5 (simple con rutas públicas)
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/home",
    "/first-opportunity",
    "/blog",
    "/contact",
    "/shop",
    "/trips",
    "/(marketing)(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/(.*)",
    "/favicon.ico",
  ],
});

// Matcher recomendado por Clerk para App Router
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};
