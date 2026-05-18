import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";
import type {
  Flashcard,
  FlashcardFeedbackRequest,
} from "../types/flashcard";


export function FlashcardsPage() {
    const navigate = useNavigate();

    const [card, setCard] = useState<Flashcard | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(false);

    async function loadFlashcard() {
        setLoading(true);
        setShowAnswer(false);

        try {
            const response = await apiClient.get<Flashcard>('/flashcards/random');
            setCard(response.data);
        } catch{
            alert("Не вдалося завантажити картку. Спробуйте ще раз.");
            navigate("/dashboard");
        }  finally {
            setLoading(false);
        }
    }

    async function submitFeedback(
        status: FlashcardFeedbackRequest["status"]
        ) {
        if (!card) return;

        await apiClient.post("/flashcards/feedback", {
            question_id: card.id,
            status,
        });

        await loadFlashcard();
    }

    useEffect(() => {
        loadFlashcard();
    }, []);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-5 md:px-6 md:py-8">
            <header className="mb-6 flex items-center justify-between md:mb-10">
                <button
                onClick={() => navigate("/dashboard")}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 md:px-5 md:py-3 md:text-base"
                >
                ← Головна
                </button>

                <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 md:px-5">
                Флешкартки
                </div>
            </header>

            <section className="flex flex-1 items-center justify-center py-4 md:py-0">
                {loading || !card ? (
                <div className="text-white/50">Завантаження картки...</div>
                ) : (
                <div className="w-full">
            <div
                className={`rounded-[28px] border bg-[#0B1120]/80 p-5 shadow-[0_0_80px_rgba(139,92,246,0.12)] backdrop-blur-xl transition-all duration-500 md:rounded-[32px] md:p-10 ${
                showAnswer
                    ? "border-cyan-500/20 opacity-100 scale-100"
                    : "border-purple-500/20 opacity-100 scale-100"
                }`}
            >
                <div className="mb-8 flex items-center justify-between">
                <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/50">
                    {card.difficulty}
                </span>

                <span
                    className={`rounded-full px-4 py-2 text-sm ${
                    showAnswer
                        ? "bg-cyan-500/10 text-cyan-200"
                        : "bg-purple-500/10 text-purple-200"
                    }`}
                >
                    {showAnswer ? "Відповідь" : "Питання"}
                </span>
                </div>

                <div
                    key={showAnswer ? "answer" : "question"}
                    className="transition-all duration-500 animate-[fadeInUp_0.35s_ease-out]"
                    >
                {!showAnswer ? (
                    <div className="flex min-h-[500px] flex-col justify-between md:min-h-[520px]">
                    <div>
                        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/30 md:text-sm">
                        Флешкартка
                        </p>

                        <h1 className="max-w-3xl text-3xl font-black leading-tight md:text-5xl">
                        {card.question_text}
                        </h1>
                    </div>

                    <button
                        onClick={() => setShowAnswer(true)}
                        className="mt-10 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-4 text-lg font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] md:py-5 md:text-xl"
                    >
                        Показати відповідь
                    </button>
                    </div>
                ) : (
                    <div className="flex min-h-[500px] flex-col justify-between md:min-h-[520px]">
                    <div>
                        <h2 className="mb-5 text-2xl font-bold leading-snug text-cyan-100 md:text-4xl">
                        {card.answer_text}
                        </h2>

                        {card.explanation && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
                            <h3 className="mb-3 text-base font-semibold text-white/80 md:text-lg">
                            Пояснення
                            </h3>

                            <p className="text-sm leading-relaxed text-white/60 md:text-lg">
                            {card.explanation}
                            </p>
                        </div>
                        )}
                    </div>

                    <div className="mt-8 grid gap-3 md:grid-cols-3 md:gap-4">
                        <button
                        onClick={() => submitFeedback("knew")}
                        className="rounded-2xl border border-green-500/20 bg-green-500/10 py-4 text-base font-semibold text-green-200 transition-all duration-300 hover:scale-[1.01] hover:bg-green-500/20 md:py-5 md:text-lg"
                        >
                        😎 Знав
                        </button>

                        <button
                        onClick={() => submitFeedback("almost")}
                        className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 py-4 text-base font-semibold text-yellow-200 transition-all duration-300 hover:scale-[1.01] hover:bg-yellow-500/20 md:py-5 md:text-lg"
                        >
                        🤔 Майже знав
                        </button>

                        <button
                        onClick={() => submitFeedback("didnt_know")}
                        className="rounded-2xl border border-red-500/20 bg-red-500/10 py-4 text-base font-semibold text-red-200 transition-all duration-300 hover:scale-[1.01] hover:bg-red-500/20 md:py-5 md:text-lg"
                        >
                        💀 Не знав
                        </button>
                    </div>
                    </div>
                )}
                </div>
            </div>
            </div>
                )}
            </section>
            </div>
        </main>
    );
}