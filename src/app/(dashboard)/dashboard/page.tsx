"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const ADMIN_EMAILS = [
  "info@megapesca.co",
  // "admin2@megapesca.co",
  // "admin3@megapesca.co",
  // "admin4@megapesca.co",
];

export default function DashboardIndex() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const email = useMemo(() => {
    if (!user?.primaryEmailAddress) return null;
    return user.primaryEmailAddress.emailAddress.toLowerCase();
  }, [user]);

  const name = user?.fullName || user?.username || undefined;
  const image = user?.imageUrl || undefined;

  const upsertUser = useMutation(api.functions.users.upsert);
  const getUser = useQuery(
    api.functions.users.getByEmail,
    email ? { email } : "skip"
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    (async () => {
      if (!email) return;
      if (getUser === undefined) return; // cargando

      const shouldBeAdmin = ADMIN_EMAILS.includes(email);
      const role = shouldBeAdmin ? "admin" : "client";

      if (!getUser || getUser.role !== role || getUser.name !== name || getUser.image !== image) {
        await upsertUser({ email, name, image, role });
      }

      router.replace(shouldBeAdmin ? "/dashboard/admin" : "/dashboard/client");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, getUser, name, image, upsertUser, router]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-sm text-zinc-400">Entrando a tu panel…</p>
    </main>
  );
}
