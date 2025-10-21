"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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
      // RUTA REAL (los route groups no aparecen en la URL)
      router.replace("/first-opportunity");
      return;
    }

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

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* NAV provisional */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Megapesca
          </Link>

          <nav className="hidden sm:flex items-center gap-5 text-sm text-zinc-300">
            <Link href="/home" className="hover:text-white transition">Home</Link>
            <Link href="/shop" className="hover:text-white transition">Tienda</Link>
            <Link href="/trips" className="hover:text-white transition">Viajes</Link>
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
            <Link href="/contact" className="hover:text-white transition">Contáctenos</Link>
            <Link href="/first-opportunity" className="hover:text-white transition">First-Opportunity</Link>
          </nav>

          <div className="flex items-center gap-2">
            <SignedOut>
              <Link
                href="/sign-in"
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 transition"
              >
                Ingresar
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md bg-[#d6a354] text-black font-semibold px-3 py-1.5 text-sm hover:brightness-110 transition"
              >
                Registrarse
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 transition"
              >
                Mi panel
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* HERO simple para dev */}
      <section className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Megapesca — Home (Dev)</h1>
        <p className="text-zinc-300 max-w-xl">
          Menú provisional y botones de autenticación. La redirección a la landing ocurre solo la primera vez.
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
      </section>

      {/* FOOTER simple */}
      <footer className="border-t border-white/10 text-center text-xs text-zinc-400 py-4">
        © {new Date().getFullYear()} Megapesca. Todos los derechos reservados.
      </footer>
    </main>
  );
}
