"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/../convex/_generated/api";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user, isLoaded } = useUser();

  // estado de mensajes
  const [message, setMessage] = useState("Validando tu sesión…");

  // mutación principal
  const ensureMe = useMutation(api.functions.users.ensureMe);

  // query de identidad
  const whoami = useQuery(
    api.functions.users.whoami,
    isAuthenticated ? {} : "skip"
  );

  // efecto principal
  useEffect(() => {
    async function run() {
      // Esperar que Clerk y Convex estén listos
      if (!isLoaded || isLoading) return;
      if (!isAuthenticated) {
        router.push("/sign-in");
        return;
      }

      setMessage("Preparando tu panel…");

      try {
        // Garantiza que el usuario exista en Convex
        await ensureMe();

        // Si ya tenemos el doc de usuario
        if (whoami) {
          const role = whoami.role;
          const name = whoami.name || user?.fullName || "Usuario";

          setMessage(`Bienvenido, ${name}`);

          // Pequeño delay visual
          setTimeout(() => {
            if (role === "admin") router.push("/dashboard/admin");
            else router.push("/dashboard/client");
          }, 1200);
        }
      } catch (error) {
        console.error("Error al inicializar dashboard:", error);
        setMessage("Error al conectar. Intenta de nuevo.");
      }
    }

    run();
  }, [isAuthenticated, isLoaded, isLoading, whoami, user, ensureMe, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold tracking-wide">{message}</h1>
        <p className="text-sm text-zinc-400">Megapesca Dashboard</p>
      </div>
    </main>
  );
}
