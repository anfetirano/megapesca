// src/components/layout/SiteHeader.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="relative z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mx-auto w-full sm:px-8 py-3 sm:py-4">
        <Link href="/" className="flex items-center justify-center">
          <div className="relative flex items-center justify-center h-32 sm:h-40 w-auto">
            <Image
              src="/brand/megapesca-logo.png"
              alt="Megapesca"
              fill
              sizes="(max-width: 640px) 80vw, 400px"
              className="object-contain drop-shadow-[0_4px_12px_rgba(255,255,255,0.3)]"
              priority
            />
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-8 text-sm text-zinc-300 font-medium mt-2 sm:mt-0">
          <Link href="/first-opportunity#lanzamiento" className="hover:text-white transition">
            Lanzamiento
          </Link>
          <Link href="/first-opportunity#suscribe" className="hover:text-white transition">
            Suscríbete
          </Link>
        </nav>
      </div>
    </header>
  );
}
