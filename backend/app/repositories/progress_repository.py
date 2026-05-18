from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.progress import UserQuestionProgress


class ProgressRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def get_by_user_and_question(
        self,
        user_id: int,
        question_id: int
    ) -> UserQuestionProgress | None:
        result = await self.db.execute(
            select(UserQuestionProgress)
            .where(
                UserQuestionProgress.user_id == user_id,
                UserQuestionProgress.question_id == question_id
            )
        )
        return result.scalar_one_or_none()
    
    async def update_quiz_progress(
        self,
        user_id: int,
        question_id: int,
        is_correct: bool
    ) -> UserQuestionProgress:
        progress = await self.get_by_user_and_question(user_id, question_id)
        
        if not progress:
            progress = UserQuestionProgress(
                user_id=user_id,
                question_id=question_id,
                attempts_count=0,
                correct_count=0,
                wrong_count=0,
            )
            self.db.add(progress)
            
        progress.attempts_count += 1
        
        if is_correct:
            progress.correct_count += 1
        else:
            progress.wrong_count += 1
            
        progress.last_answered_at = datetime.now(timezone.utc)
        
        await self.db.commit()
        await self.db.refresh(progress)
        return progress
    
    async def update_flashcard_progress(
        self,
        user_id: int,
        question_id: int,
        status: str
    ) -> UserQuestionProgress:
        
        progress = await self.get_by_user_and_question(user_id, question_id)
        
        if not progress:
            progress = UserQuestionProgress(
                user_id=user_id,
                question_id=question_id,
                attempts_count=0,
                correct_count=0,
                wrong_count=0,
            )
            self.db.add(progress)
        
        progress.attempts_count += 1
        progress.flashcard_status = status
        progress.last_answered_at = datetime.now(timezone.utc)

        if status == 'knew':
            progress.correct_count += 1
        elif status == 'didnt_know':
            progress.wrong_count += 1
        
        await self.db.commit()
        await self.db.refresh(progress)
        
        return progress