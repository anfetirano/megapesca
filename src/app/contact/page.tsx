"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle"|"sent">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Aquí conectaremos Convex / Email API
    setStatus("sent");
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <section className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Contáctenos</h1>
        <p className="text-zinc-300 mb-8">
          Escríbenos y te respondemos pronto.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tu nombre"
            className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/15"
            required
          />
          <input
            type="email"
            placeholder="Tu correo"
            className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/15"
            required
          />
          <textarea
            placeholder="¿Cómo podemos ayudarte?"
            className="w-full h-32 p-3 rounded-md bg-white/10 border border-white/15"
            required
          />
          <button
            type="submit"
            className="rounded-md bg-[#d6a354] text-black font-semibold px-6 h-10 hover:brightness-110 transition"
          >
            Enviar
          </button>

          {status === "sent" && (
            <p className="text-emerald-300 text-sm">
              ¡Mensaje enviado! Te contactaremos pronto.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
