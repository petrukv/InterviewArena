from app.models.question import Question
from app.repositories.question_repository import QuestionRepository


class LearningService:
    def __init__(self, question_repository: QuestionRepository):
        self.question_repository = question_repository
    
    async def get_random_flashcard(
        self,
        topic_id: int | None = None
    ) -> Question | None:
        return await self.question_repository.get_random_flashcard(
            topic_id=topic_id,
        )