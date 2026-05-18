from app.models.question import Question
from app.repositories.question_repository import QuestionRepository


class QuestionService:
    def __init__(self, question_repository: QuestionRepository):
        self.question_repository = question_repository
        
    async def list_questions(
        self,
        topic_id: int | None = None,
        question_type: str | None = None,
    ) -> list[Question]:
        return await self.question_repository.list_all(
            topic_id=topic_id,
            question_type=question_type,
        )
    
    async def get_question(self, question_id: int) -> Question | None:
        return await self.question_repository.get_by_id(question_id)