import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";
import type { QuizQuestion, SubmitAnswerResponse } from "../types/quiz";

export function QuizPage() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [result, setResult] = useState<SubmitAnswerResponse | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingQuestion, setIsChangingQuestion] = useState(false);
  const [error, setError] = useState("");

  async function loadQuestion() {
    setIsChangingQuestion(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 250));

    setIsLoading(true);
    setResult(null);
    setSelectedOptionId(null);

    try {
      const response = await apiClient.get<QuizQuestion>("/quiz/adaptive");
      setQuestion(response.data);
    } catch {
      setError("Не вдалося завантажити питання");
    } finally {
      setIsLoading(false);
      setIsChangingQuestion(false);
    }
  }

  async function submitAnswer(optionId: number) {
    if (!question || result || isSubmitting) return;

    setIsSubmitting(true);
    setSelectedOptionId(optionId);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 350));

    try {
      const response = await apiClient.post<SubmitAnswerResponse>("/quiz/answer", {
        question_id: question.id,
        option_id: optionId,
      });

      setResult(response.data);
    } catch {
      setError("Не вдалося відправити відповідь");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    loadQuestion();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-5 md:px-6 md:py-8">
        <header className="mb-6 flex items-center justify-between md:mb-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 md:px-5 md:py-3 md:text-base"
          >
            ← Головна
          </button>

          <div className="rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-200 md:px-5">
            Адаптивний квіз
          </div>
        </header>

        <section className="flex flex-1 items-center py-4 md:py-0">
          <div
            className={`w-full rounded-[28px] border border-purple-500/20 bg-[#0B1120]/80 p-6 shadow-[0_0_80px_rgba(139,92,246,0.15)] backdrop-blur-xl transition-all duration-300 md:rounded-[32px] md:p-8 ${
              isChangingQuestion
                ? "translate-y-4 scale-[0.98] opacity-0"
                : "translate-y-0 scale-100 opacity-100"
            }`}
          >
            {isLoading || !question ? (
              <div className="py-24 text-center text-white/50">
                Завантаження питання...
              </div>
            ) : (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/50">
                    Складність: {question.difficulty}
                  </span>

                  {result && (
                    <span className="rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
                      +{result.xp_gained} XP
                    </span>
                  )}
                </div>

                <h1 className="mb-8 text-3xl font-black leading-tight md:mb-10 md:text-5xl">
                  {question.question_text}
                </h1>

                {error && (
                  <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
                    {error}
                  </div>
                )}

                <div className="grid gap-4">
                  {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect = result?.correct_option_id === option.id;
                    const isWrongSelected =
                      result && isSelected && !result.is_correct;

                    let classes =
                      "rounded-2xl border px-5 py-4 text-left text-base transition-all duration-300 md:px-6 md:py-5 md:text-lg";

                    if (!result) {
                      classes +=
                        " border-white/10 bg-white/[0.03] hover:border-purple-500/50 hover:bg-purple-500/10 hover:translate-x-1";
                    } else if (isCorrect) {
                      classes +=
                        " border-green-400/40 bg-green-500/15 text-green-200 shadow-[0_0_35px_rgba(34,197,94,0.15)]";
                    } else if (isWrongSelected) {
                      classes +=
                        " border-red-400/40 bg-red-500/15 text-red-200 shadow-[0_0_35px_rgba(239,68,68,0.15)]";
                    } else {
                      classes += " border-white/10 bg-white/[0.02] text-white/40";
                    }

                    if (isSubmitting && isSelected) {
                      classes += " scale-[0.99] border-purple-400/50 bg-purple-500/10";
                    }

                    return (
                      <button
                        key={option.id}
                        disabled={!!result || isSubmitting}
                        onClick={() => submitAnswer(option.id)}
                        className={classes}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span>{option.option_text}</span>

                          {isSubmitting && isSelected && (
                            <span className="text-sm text-purple-200">
                              Перевірка...
                            </span>
                          )}

                          {result && isCorrect && <span>✅</span>}
                          {result && isWrongSelected && <span>❌</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {result && (
                    <div
                        className={`mt-8 rounded-3xl border p-6 transition-all duration-500 animate-[fadeInUp_0.35s_ease-out] ${
                            result.is_correct
                            ? "border-green-500/20 bg-green-500/10"
                            : "border-red-500/20 bg-red-500/10"
                        }`}
                    >
                    <h2 className="text-2xl font-bold">
                      {result.is_correct ? "Правильно!" : "Не зовсім"}
                    </h2>

                    {result.explanation && (
                      <p className="mt-3 text-white/70">{result.explanation}</p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
                      <span className="rounded-full bg-white/5 px-4 py-2">
                        +{result.xp_gained} XP
                      </span>

                      <span className="rounded-full bg-white/5 px-4 py-2">
                        Загальний досвід: {result.total_xp}
                      </span>

                      <span className="rounded-full bg-white/5 px-4 py-2">
                        Рівень: {result.level}
                      </span>

                      <span className="rounded-full bg-white/5 px-4 py-2">
                        Серія: 🔥 {result.current_streak}
                      </span>
                    </div>

                    <button
                      onClick={loadQuestion}
                      className="mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-4 text-lg font-bold transition hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                    >
                      Наступне питання →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}