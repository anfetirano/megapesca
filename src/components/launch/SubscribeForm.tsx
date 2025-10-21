"use client";

import * as React from "react";

type YesNo = "yes" | "no" | "";

export default function SubscribeForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [isClient, setIsClient] = React.useState<YesNo>("");
  const [joinWA, setJoinWA] = React.useState<YesNo>("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);

  const validEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const validPhone = (v: string) =>
    v.trim() === "" || /^\+?\d[\d\s-]{6,}$/.test(v.trim());

  const isValid =
    name.trim().length >= 2 &&
    validEmail(email) &&
    validPhone(whatsapp) &&
    isClient !== "" &&
    joinWA !== "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);

    if (!isValid) {
      setError("Por favor completa los campos requeridos.");
      return;
    }

    try {
      setLoading(true);
      // Aquí integrarás tu backend/Convex/Sendgrid/etc.
      console.log("Suscripción:", {
        name,
        email,
        whatsapp,
        isClient,
        joinWA,
      });

      setOk(true);
      // setName(""); setEmail(""); setWhatsapp(""); setIsClient(""); setJoinWA("");
    } catch {
      setError("Ocurrió un error al enviar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-md bg-white/10 border border-white/15 text-white placeholder:text-zinc-400 h-10 px-3 outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent";

  const groupLabel = "text-left text-sm font-medium text-zinc-200";

  const yesNoBox = (checked: boolean) =>
    `flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition ${
      checked
        ? "bg-white/15 border-white/30"
        : "bg-white/5 border-white/15 hover:bg-white/10"
    }`;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Campos principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="col-span-1">
          <label className={groupLabel} htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Tu nombre"
            className={`${inputCls} mt-1`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="col-span-1">
          <label className={groupLabel} htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            className={`${inputCls} mt-1`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className={groupLabel} htmlFor="whatsapp">
            WhatsApp <span className="text-zinc-400 font-normal">(opcional)</span>
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            placeholder="+57 3xx xxx xxxx"
            className={`${inputCls} mt-1`}
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
      </div>

      {/* Ya eres cliente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="col-span-1">
          <p className={groupLabel}>¿Ya eres cliente?</p>
          <div className="mt-2 flex items-center gap-3">
            <label className={yesNoBox(isClient === "yes")}>
              <input
                type="checkbox"
                className="accent-white"
                checked={isClient === "yes"}
                onChange={() => setIsClient(isClient === "yes" ? "" : "yes")}
              />
              <span>Sí</span>
            </label>
            <label className={yesNoBox(isClient === "no")}>
              <input
                type="checkbox"
                className="accent-white"
                checked={isClient === "no"}
                onChange={() => setIsClient(isClient === "no" ? "" : "no")}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Unirse al grupo de WhatsApp */}
        <div className="col-span-1">
          <p className={groupLabel}>¿Quieres unirte a nuestro grupo de WhatsApp?</p>
          <div className="mt-2 flex items-center gap-3">
            <label className={yesNoBox(joinWA === "yes")}>
              <input
                type="checkbox"
                className="accent-white"
                checked={joinWA === "yes"}
                onChange={() => setJoinWA(joinWA === "yes" ? "" : "yes")}
              />
              <span>Sí</span>
            </label>
            <label className={yesNoBox(joinWA === "no")}>
              <input
                type="checkbox"
                className="accent-white"
                checked={joinWA === "no"}
                onChange={() => setJoinWA(joinWA === "no" ? "" : "no")}
              />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>

      {/* Estados */}
      {error && (
        <p className="text-sm text-red-300 bg-red-900/30 border border-red-500/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {ok && (
        <p className="text-sm text-emerald-300 bg-emerald-900/20 border border-emerald-500/30 rounded-md px-3 py-2">
          ¡Listo! Te avisaremos del lanzamiento y novedades.
        </p>
      )}

      {/* Enviar */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={!isValid || loading}
          className="rounded-md bg-[#d6a354] text-black font-semibold px-6 h-10 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 transition"
        >
          {loading ? "Enviando..." : "Quiero estar al tanto"}
        </button>
      </div>

      <p className="text-center text-xs text-zinc-400">
        Sin spam. Solo noticias del lanzamiento y ofertas.
      </p>
    </form>
  );
}
