import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Todo lo que cuelga de /dashboard requiere sesión.
// Recuerda: los route groups (paréntesis) no forman parte de la URL.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }
});

// Matcher recomendado por Clerk (App Router)
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
