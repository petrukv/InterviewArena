import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuthStore } from "../store/authStore";
import type { LoginResponse } from "../types/auth"


export function LoginPage() {
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        try {
            const response = await apiClient.post<LoginResponse>("/auth/login", {
                email,
                password,
            });
            setToken(response.data.access_token);
            navigate("/dashboard");
        } catch {
            setError("Invalid email or password");
        }
    }

    return (
  <main className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

    <div className="absolute inset-0 opacity-[0.03]">
      <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:80px_80px]" />
    </div>

    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-[32px] border border-purple-500/20 bg-[#0B1120]/80 p-10 backdrop-blur-xl shadow-[0_0_80px_rgba(139,92,246,0.15)]"
      >
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 shadow-[0_0_50px_rgba(139,92,246,0.35)]">
            <span className="text-3xl">⚡</span>
          </div>

          <h1 className="mb-3 text-center text-6xl font-black tracking-tight">
            Welcome back
          </h1>

          <p className="text-center text-lg text-white/50">
            Continue your interview preparation.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-white/70">
              Email
            </label>

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-16 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-5 text-lg outline-none transition focus:border-purple-500 focus:shadow-[0_0_30px_rgba(139,92,246,0.35)]"
                placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-white/70">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-16 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-5 text-lg outline-none transition focus:border-purple-500 focus:shadow-[0_0_30px_rgba(139,92,246,0.35)]"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-red-300">
            {error}
          </div>
        )}

        <button className="mt-8 h-16 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-lg font-bold transition hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(139,92,246,0.45)] active:scale-[0.99]">
          Login →
        </button>
        <p className="mt-6 text-center text-white/50">
            Don't have an account?{" "}
            <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-purple-300 hover:text-purple-200"
            >
                Sign up
            </button>
            </p>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />

          <span className="text-sm text-white/40">
            Adaptive Interview Prep
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </div>
      </form>
    </div>
  </main>
);
}