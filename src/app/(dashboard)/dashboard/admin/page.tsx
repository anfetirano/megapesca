"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  // whoami: null | user; undefined = cargando
  const me = useQuery(
    api.functions.users.whoami,
    isAuthenticated ? {} : "skip"
  );

  // Asegura doc usuario si alguien entra directo a /dashboard/admin
  const ensureMe = useMutation(api.functions.users.ensureMe);
  const ensuredOnce = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    // No autenticado → login
    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }

    // Autenticado pero BD aún no respondió
    if (me === undefined) return;

    // Si aún no existe en BD, intenta asegurar (una sola vez)
    if (me === null && !ensuredOnce.current) {
      ensuredOnce.current = true;
      (async () => {
        try {
          await ensureMe({});
        } catch (e) {
          console.error("ensureMe en admin falló:", e);
        }
      })();
      return;
    }

    // Si existe y NO es admin → al dashboard de cliente
    if (me && me.role !== "admin") {
      router.replace("/dashboard/client");
      return;
    }
  }, [isAuthenticated, isLoading, me, ensureMe, router]);

  // Estados de carga o transición
  if (isLoading || (isAuthenticated && me === undefined)) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center">
        <p className="text-sm text-zinc-400">Verificando permisos…</p>
      </main>
    );
  }

  // Si no autenticado ya se redirigió; si no es admin ya se redirigió.
  // Render cuando es admin.
  if (!me || me.role !== "admin") return null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-zinc-400">Métricas: ventas, usuarios y pedidos.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Ventas hoy", "Usuarios activos", "Tickets abiertos", "Pedidos pendientes"].map((t) => (
          <div key={t} className="rounded-xl border border-white/10 p-4 bg-white/5">
            <h3 className="font-semibold">{t}</h3>
            <p className="text-2xl font-bold mt-2">—</p>
          </div>
        ))}
      </section>
    </div>
  );
}
