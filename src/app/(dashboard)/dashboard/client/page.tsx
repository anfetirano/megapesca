"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Doc } from "@/../convex/_generated/dataModel";

export default function ClientDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Si no está autenticado, mándalo a login
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isAuthenticated, isLoading, router]);

  const captures = useQuery(
    api.functions.captures.listMine,
    isAuthenticated ? {} : "skip"
  );

  const loading = isLoading || captures === undefined;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center">
        <p className="text-sm text-zinc-400">Redirigiendo a inicio de sesión…</p>
      </main>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Mi Dashboard</h1>
        <p className="text-zinc-400">
          Aquí verás tus compras, capturas, equipo y favoritos.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 p-4 bg-white/5">
        <h3 className="font-semibold">Capturas</h3>

        <div className="mt-4">
          {loading && <p className="text-sm text-zinc-400">Cargando…</p>}

          {!loading && captures && captures.length === 0 && (
            <p className="text-sm text-zinc-400">
              Aún no tienes capturas.
            </p>
          )}

          {!loading && captures && captures.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {captures.map((c: Doc<"captures">) => (
                <li
                  key={c._id}
                  className="rounded-lg border border-white/10 p-3 bg-white/5"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.species}</span>
                    <span className="text-zinc-400">
                      {new Date(c.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {c.location} • {c.weightKg ?? "?"} kg • {c.lengthCm ?? "?"} cm
                  </p>
                  {c.notes && (
                    <p className="text-xs text-zinc-500 mt-1">{c.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
