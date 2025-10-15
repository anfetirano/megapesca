export default function ShopPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">MEGATIENDA</h1>
        <p className="text-zinc-300 mb-8">
          Próximamente: catálogo de cañas, carretes, líneas, señuelos y más. Integración con proveedores locales.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="rounded-xl border border-white/10 p-6 bg-white/5">
              <div className="h-40 rounded-lg bg-white/10 mb-4" />
              <h3 className="font-semibold">Producto #{i}</h3>
              <p className="text-sm text-zinc-400">Descripción breve del producto.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
