export default function TripsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Viajes Megapesca</h1>
        <p className="text-zinc-300 mb-8">
          Explora salidas guiadas, expediciones y destinos de pesca. Pronto podrás reservar directamente.
        </p>

        <div className="space-y-4">
          {[1,2].map((i) => (
            <div key={i} className="rounded-xl border border-white/10 p-6 bg-white/5">
              <h3 className="font-semibold">Expedición #{i}</h3>
              <p className="text-sm text-zinc-400">
                Fechas tentativas, especies objetivo, equipo recomendado y requisitos.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
