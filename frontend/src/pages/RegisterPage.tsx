import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";

export function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
    }

    try {
      await apiClient.post("/auth/register", {
        email,
        username,
        password,
      });

      navigate("/login");
    } catch {
      setError("Registration failed");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-[32px] border border-purple-500/20 bg-[#0B1120]/80 p-10 shadow-[0_0_80px_rgba(139,92,246,0.15)] backdrop-blur-xl"
        >
          <h1 className="mb-3 text-center text-5xl font-black">Create account</h1>
          <p className="mb-10 text-center text-white/50">
            Start your adaptive interview training.
          </p>

          <div className="space-y-5">
            <input
              className="h-14 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-5 outline-none focus:border-purple-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="h-14 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-5 outline-none focus:border-purple-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="h-14 w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-5 outline-none focus:border-purple-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          <button className="mt-8 h-14 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-bold transition hover:scale-[1.01]">
            Register
          </button>

          <p className="mt-6 text-center text-white/50">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-purple-300 hover:text-purple-200"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}