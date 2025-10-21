"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const email = useMemo(() => {
    if (!user?.primaryEmailAddress) return null;
    return user.primaryEmailAddress.emailAddress.toLowerCase();
  }, [user]);

  const getUser = useQuery(
    api.functions.users.getByEmail,
    email ? { email } : "skip"
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }
    if (getUser === undefined) return; // cargando
    if (!getUser || getUser.role !== "admin") {
      router.replace("/dashboard/client");
      return;
    }
  }, [isLoaded, isSignedIn, getUser, router]);

  if (!getUser || getUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Verificando permisos…</p>
      </main>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-zinc-400">Métricas: ventas, clientes online y tickets.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Ventas hoy", "Clientes online", "Tickets abiertos", "Pedidos pendientes"].map((t) => (
          <div key={t} className="rounded-xl border border-white/10 p-4 bg-white/5">
            <h3 className="font-semibold">{t}</h3>
            <p className="text-2xl font-bold mt-2">—</p>
          </div>
        ))}
      </section>
    </div>
  );
}
