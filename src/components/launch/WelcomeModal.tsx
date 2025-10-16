"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function WelcomeModal() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const seen =
      typeof window !== "undefined" && localStorage.getItem("mp_welcome_seen");
    if (!seen) setOpen(true);
  }, []);

  const handle = (v: boolean) => {
    setOpen(v);
    if (!v) localStorage.setItem("mp_welcome_seen", "1");
  };

  return (
    <Dialog open={open} onOpenChange={handle}>
      <DialogContent className="sm:max-w-md p-6">
        {/* Accesibilidad: Título/Descripción ocultos para lectores de pantalla */}
        <DialogHeader className="sr-only">
          {/* Opción A: usar clase sr-only (ya satisface el requisito) */}
          <DialogTitle>Bienvenido a Megapesca</DialogTitle>
          <DialogDescription>
            Modal de bienvenida del pre-lanzamiento de Megapesca.
          </DialogDescription>
        </DialogHeader>

        {/* Opción B (equivalente): usar VisuallyHidden
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Bienvenido a Megapesca</DialogTitle>
            <DialogDescription>
              Modal de bienvenida del pre-lanzamiento de Megapesca.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        */}

        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/brand/megapesca-logo.png"
            alt="Megapesca"
            width={280}
            height={80}
            priority
          />
          <p className="text-base text-muted-foreground">
            ¡Bienvenido! Estamos afinando redes, señuelos y código. Muy pronto
            el lanzamiento 🐟
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
