"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sword } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      username: form.get("username"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials. The gate remains closed.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background grid effect */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #FFD700 1px, transparent 1px),
            linear-gradient(to bottom, #FFD700 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-neon-yellow/40 clip-card mb-4 glow-yellow">
            <Sword className="w-8 h-8 text-neon-yellow" />
          </div>
          <h1 className="font-display text-3xl font-bold text-neon-yellow tracking-widest uppercase text-glow-yellow">
            Monarch Protocol
          </h1>
          <p className="text-muted text-sm mt-1 tracking-wider">
            AUTHENTICATION REQUIRED
          </p>
        </div>

        {/* Login card */}
        <div className="bg-surface border border-border clip-card p-6">
          <div className="border-l-2 border-neon-yellow pl-3 mb-6">
            <p className="font-display text-sm text-neon-yellow tracking-widest uppercase font-semibold">
              Hunter Gate
            </p>
            <p className="text-muted text-xs mt-0.5">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-widest text-muted uppercase">
                Username
              </label>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-widest text-muted uppercase">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors"
              />
            </div>

            {error && (
              <p className="text-neon-red text-xs border border-neon-red/30 bg-neon-red/10 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-yellow text-background font-display font-bold text-sm tracking-widest uppercase py-3 clip-card-sm hover:bg-neon-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "AUTHENTICATING..." : "ENTER THE GATE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
