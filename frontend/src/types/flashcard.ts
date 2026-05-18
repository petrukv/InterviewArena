export type Flashcard = {
    id: number;
    question_text: string;
    answer_text: string;
    explanation: string;
    difficulty: string;
}

export type FlashcardFeedbackRequest = {
  question_id: number;
  status: "knew" | "almost" | "didnt_know";
};