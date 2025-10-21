"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

export default function ClientDashboardPage() {
  const upsertUser = useMutation(api.functions.users.upsert);
  const getUserByEmail = useQuery(api.functions.users.getByEmail, {
    email: "test@megapesca.co",
  });

  // El _id de Convex NO es string: es Id<"users">
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  // Crear/asegurar usuario demo (solo pruebas)
  useEffect(() => {
    (async () => {
      if (getUserByEmail === undefined) return; // cargando
      if (!getUserByEmail) {
        await upsertUser({
          email: "test@megapesca.co",
          name: "Usuario Demo",
          image: undefined,
          role: "client",
        });
      }
    })();
  }, [getUserByEmail, upsertUser]);

  // Guardar el Id tipado correctamente
  useEffect(() => {
    if (getUserByEmail?._id) {
      setUserId(getUserByEmail._id); // _id ya es Id<"users">
    }
  }, [getUserByEmail]);

  // Listar capturas del usuario (usa "skip" mientras no haya userId)
  const captures = useQuery(
    api.functions.captures.listByUser,
    userId ? { userId } : "skip"
  );

  // Crear captura de prueba
  const createCapture = useMutation(api.functions.captures.create);

  async function handleCreateCapture() {
    if (!userId) return;
    await createCapture({
      userId, // Id<"users">
      date: Date.now(),
      location: "Laguna de prueba",
      species: "Dorado",
      weightKg: 3.2,
      lengthCm: 58,
      notes: "Captura de prueba",
      imageUrl: undefined,
    });
  }

  const loading = getUserByEmail === undefined || captures === undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Mi Dashboard</h1>
        <p className="text-zinc-400">
          Aquí verás tus compras, capturas, equipo y favoritos.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 p-4 bg-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Capturas</h3>
          <button
            onClick={handleCreateCapture}
            disabled={!userId}
            className="rounded-md bg-[#d6a354] text-black font-semibold px-4 py-2 disabled:opacity-50"
          >
            + Agregar captura (demo)
          </button>
        </div>

        <div className="mt-4">
          {loading && <p className="text-sm text-zinc-400">Cargando…</p>}
          {!loading && captures && captures.length === 0 && (
            <p className="text-sm text-zinc-400">
              Aún no tienes capturas. Crea una de prueba con el botón.
            </p>
          )}
          {!loading && captures && captures.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {captures.map((c) => (
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
