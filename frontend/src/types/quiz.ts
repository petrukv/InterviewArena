export type QuizOption = {
    id: number;
    option_text: string;
}

export type QuizQuestion = {
    id: number;
    question_text: string;
    difficulty: string;
    options: QuizOption[];
}

export type SubmitAnswerResponse = {
    is_correct: boolean;
    correct_option_id: number;
    explanation: string;
    xp_gained: number;
    total_xp: number;
    level: number;
    current_streak: number;
}