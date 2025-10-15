"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Permitir anular redirección con ?noredirect=1
    const params = new URLSearchParams(window.location.search);
    const noRedirect = params.get("noredirect") === "1";

    // Si ya redirigió una vez, no vuelve a redirigir
    const already = localStorage.getItem("mp_redirected_once") === "1";

    if (!noRedirect && !already) {
      localStorage.setItem("mp_redirected_once", "1");
      router.replace("/first-opportunity");
      return;
    }

    // Mostrar la home normalmente
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-zinc-400 animate-pulse">Cargando Megapesca...</p>
          {/* Enlace de respaldo si falla JS */}
          <Link href="/first-opportunity" className="text-xs text-[#d6a354] underline underline-offset-4">
            Ir ahora
          </Link>
        </div>
      </main>
    );
  }

  // Tu home real para trabajar el menú y ver avances
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl sm:text-4xl font-bold">Megapesca — Home (Dev)</h1>
      <p className="text-zinc-300 px-6 text-center">
        Aquí trabajas el menú y ves avances. La redirección a la landing ocurre solo la primera vez.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/first-opportunity"
          className="rounded-md bg-[#d6a354] text-black font-semibold px-5 py-2 hover:brightness-110 transition"
        >
          Ver “first-opportunity”
        </Link>
        <button
          onClick={() => localStorage.removeItem("mp_redirected_once")}
          className="text-xs text-zinc-400 underline underline-offset-4"
          title="Borrar marca de redirección"
        >
          Reset redirección (debug)
        </button>
      </div>

      <p className="text-xs text-zinc-500">
        Tip: añade <code>?noredirect=1</code> a la URL para bloquear la redirección temporalmente.
      </p>
    </main>
  );
}
