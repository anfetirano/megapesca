import HeroCarousel from "@/components/launch/HeroCarousel";
import SubscribeForm from "@/components/launch/SubscribeForm";
import WelcomeModal from "@/components/launch/WelcomeModal";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <WelcomeModal />

      {/* HERO FULLSCREEN */}
      <section id="lanzamiento" className="relative h-screen overflow-hidden">
        <HeroCarousel />

        {/* LOGO (un poco más arriba y un toque más compacto) */}
        <div className="pointer-events-none absolute top-0 sm:top-[2%] left-1/2 -translate-x-1/2 z-40">
          <div
            className="
              relative
              w-[66vw] max-w-[340px]           /* móvil */
              sm:w-[27vw] sm:max-w-[460px]      /* desktop */
              aspect-[5/2]
              logo-anim-intro logo-anim-float
            "
          >
            <Image
              src="/brand/megapesca-logo.png"
              alt="Megapesca"
              fill
              sizes="(max-width: 640px) 66vw, 460px"
              className="object-contain drop-shadow-[0_8px_24px_rgba(255,255,255,0.30)]"
              priority
            />
          </div>
        </div>

        {/* CARD SIN SCROLL: un poquito más abajo y con un pelín más de alto */}
        <div className="absolute inset-x-4 top-[16vh] sm:top-[22vh] bottom-[6vh] z-30">
          <div className="h-full max-w-4xl mx-auto flex items-center justify-center">
            <div className="w-full h-full rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 p-4 md:p-6 text-center shadow-2xl flex flex-col">
              {/* Título ligeramente más compacto */}
              <h1 className="text-[clamp(20px,4.2vw,38px)] font-bold leading-tight mb-2">
                ¡Prepárate para el gran lanzamiento de{" "}
                <span className="whitespace-nowrap text-[#d6a354]">Megapesca.co</span>!
              </h1>

              <p className="text-zinc-300 text-[clamp(12px,1.3vw,16px)] mb-3">
                Ofertas exclusivas, torneos en tiempo real y una MEGATIENDA con rifas y mucho más.
                Esta es una plataforma única pensada para el pescador. Estamos afinando cada detalle para ti.
              </p>

              {/* El formulario ocupa el espacio disponible y el botón queda dentro */}
              <div id="suscribe" className="flex-1 flex items-center">
                <div className="w-full">
                  <SubscribeForm />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER overlay (no quita altura al hero) */}
        <footer className="absolute bottom-2 left-0 right-0 z-30 text-center text-xs sm:text-sm text-zinc-400">
          © {new Date().getFullYear()} Megapesca. Todos los derechos reservados.
        </footer>
      </section>
    </div>
  );
}
