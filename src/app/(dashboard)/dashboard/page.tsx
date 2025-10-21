"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const ADMIN_EMAILS = [
  "info@megapesca.co",
];

export default function DashboardIndex() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const email = useMemo(() => {
    if (!user?.primaryEmailAddress) return null;
    return user.primaryEmailAddress.emailAddress.toLowerCase();
  }, [user]);

  const name =
    user?.firstName ||
    user?.fullName ||
    user?.username ||
    "pescador/a";

  const image = user?.imageUrl || undefined;

  const upsertUser = useMutation(api.functions.users.upsert);
  const getUser = useQuery(
    api.functions.users.getByEmail,
    email ? { email } : "skip"
  );

  // Si no hay sesión, llevar a sign-in 
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }
  }, [isLoaded, isSignedIn, router]);

  // Upsert + redirección por rol
  useEffect(() => {
    (async () => {
      if (!email) return;
      if (getUser === undefined) return; // aún cargando

      const shouldBeAdmin = ADMIN_EMAILS.includes(email);
      const role = shouldBeAdmin ? "admin" : "client";

      if (
        !getUser ||
        getUser.role !== role ||
        getUser.name !== name ||
        getUser.image !== image
      ) {
        await upsertUser({ email, name, image, role });
      }

      router.replace(shouldBeAdmin ? "/dashboard/admin" : "/dashboard/client");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, getUser, name, image, upsertUser, router]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-zinc-400">Preparando tu panel…</p>
        <h1 className="mt-2 text-2xl font-semibold">
          ¡Bienvenido a tu área, {name}!
        </h1>
        <p className="mt-1 text-zinc-400 text-sm">
          En segundos te llevaremos a tu panel Megapesca.
        </p>
      </div>
    </main>
  );
}
