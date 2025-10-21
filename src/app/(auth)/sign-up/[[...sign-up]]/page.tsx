"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="rounded-xl border border-white/10 p-6 bg-white/5">
        <SignUp signInUrl="/sign-in" />
      </div>
    </main>
  );
}
