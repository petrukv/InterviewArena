from app.models.progress import UserQuestionProgress
from app.repositories.progress_repository import ProgressRepository


class ProgressService:
    def __init__(self, progress_repository: ProgressRepository):
        self.progress_repository = progress_repository
        
    async def record_quiz_answer(
        self,
        user_id: int,
        question_id: int,
        is_correct: bool,
    ) -> UserQuestionProgress:
        return await self.progress_repository.update_quiz_progress(
            user_id=user_id,
            question_id=question_id,
            is_correct=is_correct,
        )
        
    async def record_flashcard_feedback(
        self,
        user_id: int,
        question_id: int,
        status: str,
    ):
        return await self.progress_repository.update_flashcard_progress(
            user_id=user_id,
            question_id=question_id,
            status=status,
        )