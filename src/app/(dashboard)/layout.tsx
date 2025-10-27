// src/app/(dashboard)/layout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => setMounted(true), []);
  if (!mounted || !isLoaded) return null;

  const userName = user?.fullName?.split(" ")[0] || "Usuario";

  return (
    <ConvexClientProvider>
      <div className="min-h-screen bg-black text-white grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* SIDEBAR */}
        <aside className="border-r border-white/10 p-4 bg-black/70 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#d6a354]">Megapesca</h2>
              <p className="text-xs text-zinc-400">Panel privado</p>
            </div>

            <nav className="space-y-2 text-sm">
              <Link href="/dashboard/client" className="block hover:text-[#d6a354] transition">
                🧭 Cliente — Resumen
              </Link>
              <Link href="/dashboard/admin" className="block hover:text-[#d6a354] transition">
                🛠️ Admin — Resumen
              </Link>
            </nav>
          </div>

          <div className="text-xs text-zinc-500 mt-6 border-t border-white/10 pt-3">
            Protegido con Clerk + Convex
          </div>
        </aside>

        {/* MAIN */}
        <main className="p-6 relative overflow-hidden">
          {/* HEADER SUPERIOR */}
          <header className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h1 className="text-xl font-semibold tracking-wide">
              👋 Hola, <span className="text-[#d6a354]">{userName}</span>
            </h1>

            <div className="flex items-center gap-3">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="text-sm rounded-md border border-white/20 px-3 py-1 hover:bg-white/10 transition"
                >
                  Iniciar sesión
                </Link>
              </SignedOut>
            </div>
          </header>

          {/* CONTENIDO */}
          {children}
        </main>
      </div>
    </ConvexClientProvider>
  );
}