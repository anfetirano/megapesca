"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-xl font-semibold mb-4">Ingresar</h1>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <SignIn
            routing="path"
            path="/sign-in"
            redirectUrl="/dashboard"
            afterSignInUrl="/dashboard"
            appearance={{
              variables: { colorPrimary: "#d6a354" },
              layout: { socialButtonsVariant: "iconButton" },
            }}
          />
        </div>
      </div>
    </main>
  );
}
