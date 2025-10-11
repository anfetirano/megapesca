"use client";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";
import Image from "next/image";

type Props = {
  slides?: string[];
  /** Posiciones CSS para cada imagen, p. ej. "50% 40%" (x y). */
  positions?: string[];
};

const defaultSlides = [
  "/launch/01.jpg",
  "/launch/02.jpg",
  "/launch/03.jpg",
  "/launch/04.jpg",
  "/launch/05.jpg",
];

/** 🎯 Enfoque por imagen (la #3 bajada para mostrar más la cara) */
const defaultPositions = [
  "50% 50%", // img 1 centrada
  "50% 50%", // img 2 centrada
  "50% 20%", // img 3 bajada (muestra más la parte superior)
  "50% 50%", // img 4 centrada
  "50% 50%", // img 5 centrada
];

export default function HeroCarousel({
  slides = defaultSlides,
  positions = defaultPositions,
}: Props) {
  const [viewportRef, api] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: 30,
  });

  // Autoplay
  React.useEffect(() => {
    if (!api) return;
    const t = setInterval(() => api.scrollNext(), 4500);
    return () => clearInterval(t);
  }, [api]);

  // Asegura que siempre haya una posición para cada slide
  const effectivePositions = React.useMemo(() => {
    const out = [...positions];
    for (let i = 0; i < slides.length; i++) {
      if (!out[i]) out[i] = "50% 50%";
    }
    return out;
  }, [positions, slides]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={viewportRef} className="absolute inset-0 h-full">
        <div className="flex h-full">
          {slides.map((src, i) => (
            <div key={i} className="relative min-w-full h-full">
              <Image
                src={src}
                alt={`Megapesca ${i + 1}`}
                fill
                sizes="100vw"
                style={{
                  objectFit: "cover",
                  objectPosition: effectivePositions[i], // 👈 enfoque por slide
                }}
                className="z-0"
                priority={i === 0}
              />
              {/* Vignette para contraste del contenido */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
