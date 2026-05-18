from pydantic import BaseModel


class QuestionOptionRead(BaseModel):
    id: int
    option_text: str

    class Config:
        from_attributes = True
        
        
class QuestionRead(BaseModel):
    id: int
    topic_id: int
    question_text: str
    answer_text: str
    

class QuestionRead(BaseModel):
    id: int
    topic_id: int
    question_text: str
    answer_text: str | None
    explanation: str | None
    difficulty: str
    question_type: str
    options: list[QuestionOptionRead] = []

    class Config:
        from_attributes = True