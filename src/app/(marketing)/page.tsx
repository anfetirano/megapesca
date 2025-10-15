import Link from "next/link";

export default function MarketingHome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white text-center px-6">
      <h1 className="text-4xl font-bold tracking-tight">Megapesca</h1>
      <p className="max-w-2xl text-zinc-300">
        Comunidad, torneos en tiempo real y una MEGATIENDA de pesca. <br />
        Estamos construyendo algo grande para pescadores de habla hispana.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/shop" className="rounded-md bg-[#d6a354] text-black font-semibold px-5 py-2 hover:brightness-110 transition">
          Ir a la tienda
        </Link>
        <Link href="/trips" className="rounded-md border border-white/20 px-5 py-2 hover:bg-white/10 transition">
          Viajes Megapesca
        </Link>
        <Link href="/blog" className="rounded-md border border-white/20 px-5 py-2 hover:bg-white/10 transition">
          Blog
        </Link>
        <Link href="/contact" className="rounded-md border border-white/20 px-5 py-2 hover:bg-white/10 transition">
          Contáctenos
        </Link>
        <Link href="/first-opportunity" className="rounded-md border border-white/20 px-5 py-2 hover:bg-white/10 transition">
          Vista First-Opportunity
        </Link>
      </div>
    </main>
  );
}
