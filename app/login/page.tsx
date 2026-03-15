"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/agentvitals-icon.png"
            alt=""
            className="h-12 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            AgentVitals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to access the analyzer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm
                text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                transition-all"
              autoComplete="username"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm
                text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                transition-all"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm
              hover:bg-slate-800 active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
