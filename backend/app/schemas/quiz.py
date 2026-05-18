from pydantic import BaseModel


class QuizOptionRead(BaseModel):
    id: int
    option_text: str

    class Config:
        from_attributes = True


class QuizQuestionRead(BaseModel):
    id: int
    question_text: str
    difficulty: str
    options: list[QuizOptionRead]

    class Config:
        from_attributes = True


class SubmitQuizAnswerRequest(BaseModel):
    question_id: int
    option_id: int


class SubmitQuizAnswerResponse(BaseModel):
    is_correct: bool
    correct_option_id: int
    explanation: str | None
    
    xp_gained: int | None = None
    total_xp: int | None = None
    level: int | None = None
    current_streak: int | None = None