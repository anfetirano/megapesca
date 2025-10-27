"use client";

import { ReactNode, useMemo } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Falta NEXT_PUBLIC_CONVEX_URL en tu .env");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  const patchedUseAuth = useMemo(() => {
    return () => ({
      ...auth,
      getToken: async (opts?: { template?: string }) => {
        const token = await auth.getToken({ ...opts, template: "convex" });
        // Debug opcional:
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("[Convex JWT] iss:", payload.iss, "aud:", payload.aud);
          } catch {}
        }
        return token;
      },
    });
  }, [auth]);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={patchedUseAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
