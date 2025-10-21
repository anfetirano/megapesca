"use client";

import { ReactNode, useEffect, useState } from "react";
import { ConvexProvider } from "convex/react";
import { convex } from "@/lib/convexClient";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ConvexProvider client={convex}>
      <div className="min-h-screen bg-black text-white grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-white/10 p-4 bg-black/70">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Megapesca — Panel</h2>
            <p className="text-xs text-zinc-400">Área privada</p>
          </div>

          <nav className="space-y-2 text-sm">
            {/* URLs reales */}
            <Link href="/dashboard/client" className="block hover:text-[#d6a354]">
              🧭 Cliente — Resumen
            </Link>
            <Link href="/dashboard/admin" className="block hover:text-[#d6a354]">
              🛠️ Admin — Resumen
            </Link>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-zinc-400">
              (Protegido con Clerk)
            </div>
          </nav>
        </aside>

        <main className="p-6">
          <div className="flex items-center justify-end mb-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm rounded-md border border-white/20 px-3 py-1 hover:bg-white/10 transition"
              >
                Ingresar
              </Link>
            </SignedOut>
          </div>
          {children}
        </main>
      </div>
    </ConvexProvider>
  );
}
