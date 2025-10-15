export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-zinc-300 mb-8">
          Noticias, técnicas, comparativas de equipos y coberturas de torneos.
        </p>

        <article className="rounded-xl border border-white/10 p-6 bg-white/5">
          <h3 className="font-semibold mb-1">Primer post de ejemplo</h3>
          <p className="text-sm text-zinc-400">
            Aquí irá el contenido. Más adelante conectamos un CMS o Convex para gestión.
          </p>
        </article>
      </section>
    </main>
  );
}
