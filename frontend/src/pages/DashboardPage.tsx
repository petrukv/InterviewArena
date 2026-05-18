import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuthStore } from "../store/authStore";
import type { User } from "../types/auth";

export function DashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const response = await apiClient.get<User>("/auth/me");
      setUser(response.data);
    }

    loadUser();
  }, []);

  const currentLevelStart = user ? (user.level - 1) * 100 : 0;
  const nextLevelXp = user ? user.level * 100 : 100;
  const levelProgress = user
    ? ((user.xp - currentLevelStart) / (nextLevelXp - currentLevelStart)) * 100
    : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">Interview Arena</h1>
            <p className="mt-2 text-white/50">
              Навчайтесь ефективніше з адаптивними квізами.
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="rounded-xl border border-white/10 px-5 py-3 text-white/70 transition hover:bg-white/5"
          >
            Вийти
          </button>
        </header>

        <section className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-6 shadow-[0_0_50px_rgba(139,92,246,0.10)]">
            <p className="text-sm text-white/40">Рівень</p>
            <p className="mt-2 text-4xl font-black">{user?.level ?? "..."}</p>
          </div>

          <div className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-6 shadow-[0_0_50px_rgba(139,92,246,0.10)]">
            <p className="text-sm text-white/40">Досвід</p>
            <p className="mt-2 text-4xl font-black">{user?.xp ?? "..."}</p>
          </div>

          <div className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-6 shadow-[0_0_50px_rgba(139,92,246,0.10)]">
            <p className="text-sm text-white/40">Серія</p>
            <p className="mt-2 text-4xl font-black">
              🔥 {user?.current_streak ?? "..."}
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-[#0B1120]/80 p-8 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Вітаємо, {user?.username ?? "student"}
              </h2>
              <p className="text-white/50">{user?.email}</p>
            </div>

            <span className="rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              Рівень {user?.level ?? 1}
            </span>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm text-white/50">
              <span>Прогрес рівня</span>
              <span>
                {user?.xp ?? 0} / {nextLevelXp} XP
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                style={{ width: `${Math.min(levelProgress, 100)}%` }}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
            <button
                onClick={() => navigate("/quiz")}
                className="group rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-fuchsia-600/10 p-8 text-left transition hover:scale-[1.01] hover:shadow-[0_0_60px_rgba(139,92,246,0.25)]"
            >
                <div className="mb-6 text-5xl">🧠</div>

                <h3 className="text-2xl font-bold">
                Почати адаптивний квіз
                </h3>

                <p className="mt-3 text-white/50">
                Отримуйте питання на основі ваших помилок та прогресу.
                </p>
            </button>

            <button
                onClick={() => navigate("/flashcards")}
                className="group rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 text-left transition hover:scale-[1.01] hover:shadow-[0_0_60px_rgba(6,182,212,0.18)]"
            >
                <div className="mb-6 text-5xl">🃏</div>

                <h3 className="text-2xl font-bold">
                Флешкартки
                </h3>

                <p className="mt-3 text-white/50">
                Швидко повторюйте матеріал та закріплюйте знання за допомогою інтерактивних карток.
                </p>
            </button>
        </section>
      </div>
    </main>
  );
}