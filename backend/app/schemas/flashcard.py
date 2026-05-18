from pydantic import BaseModel


class FlashcardRead(BaseModel):
    id: int
    topic_id: int
    question_text: str
    answer_text: str | None
    explanation: str | None
    difficulty: str

    class Config:
        from_attributes = True
        
        
class FlashcardFeedbackRequest(BaseModel):
    question_id: int
    status: str


class FlashcardFeedbackResponse(BaseModel):
    status: str
    xp_gained: int
    total_xp: int
    level: int
    current_streak: int