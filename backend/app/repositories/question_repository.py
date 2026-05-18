import random
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.question import Question, QuestionOption
from app.models.progress import UserQuestionProgress


class QuestionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
        
    
    async def list_all(self, 
                       topic_id: int | None = None, 
                       question_type: str | None = None
                    ) -> list[Question]:
        query = (
            select(Question)
            .options(selectinload(Question.options))
            .where(Question.is_active.is_(True))
            .order_by(Question.id)
        )
        
        if topic_id is not None:
            query = query.where(Question.topic_id == topic_id)
            
        if question_type is not None:
            query = query.where(Question.question_type == question_type)
            
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    
    async def get_by_id(self, question_id: int) -> Question | None:
        result = await self.db.execute(
            select(Question)
            .options(selectinload(Question.options))
            .where(
                Question.id == question_id,
                Question.is_active.is_(True),
            )
        )
        return result.scalar_one_or_none()
    
    async def get_random_flashcard(
        self,
        topic_id: int | None = None,
    ) -> Question | None:
        query = (
            select(Question)
            .where(
                Question.is_active.is_(True),
                Question.question_type == 'flashcard',
            )
            .order_by(func.random())
            .limit(1)
           )
        
        if topic_id is not None:
            query = query.where(Question.topic_id == topic_id)
            
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_random_quiz_question(
        self,
        topic_id: int | None = None,
    ) -> Question | None:
        query = (
            select(Question)
            .options(selectinload(Question.options))
            .where(
                Question.is_active.is_(True),
                Question.question_type == 'single_choice',
            )
            .order_by(func.random())
            .limit(1)
        )
        
        if topic_id is not None:
            query = query.where(Question.topic_id == topic_id)
            
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_option_by_id(self, option_id: int) -> QuestionOption | None:
        result = await self.db.execute(
            select(QuestionOption)
            .where(QuestionOption.id == option_id)
        )
        return result.scalar_one_or_none()
    
    async def get_adaptive_quiz_question(
        self, 
        user_id: int,
        topic_id: int | None = None, 
    ) -> Question | None:
        
        """
            Returns an adaptive quiz question for the user.

            Strategy:
            - 70% chance: try to return a new unanswered question
            - 30% chance: try to return a weak question
            - weak question = wrong_count > correct_count
            - recently answered questions are ignored for a cooldown period
            - if preferred type is not found, fallback to the other type
            - final fallback: random quiz question
        """
        
        cooldown_time = datetime.now(timezone.utc) - timedelta(minutes=5)
        prefer_new = random.random() < 0.7
        
        async def get_new_question() -> Question | None:
            query = (
                select(Question)
                .options(selectinload(Question.options))
                .where(
                    Question.is_active.is_(True),
                    Question.question_type == "single_choice",
                    ~Question.id.in_(
                        select(UserQuestionProgress.question_id).where(
                            UserQuestionProgress.user_id == user_id
                        )
                    ),
                )
                .order_by(func.random())
                .limit(1)
            )
            
            if topic_id is not None:
                query = query.where(Question.topic_id == topic_id)
            
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        
        async def get_weak_question() -> Question | None:
            query = (
                select(Question)
                .join(
                    UserQuestionProgress,
                    UserQuestionProgress.question_id == Question.id,
                )
                .options(selectinload(Question.options))
                .where(
                    UserQuestionProgress.user_id == user_id,
                    Question.is_active.is_(True),
                    Question.question_type == "single_choice",
                    UserQuestionProgress.wrong_count > UserQuestionProgress.correct_count,
                    UserQuestionProgress.last_answered_at < cooldown_time,
                )
                .order_by(func.random())
                .limit(1)
            )

            if topic_id is not None:
                query = query.where(Question.topic_id == topic_id)

            result = await self.db.execute(query)
            return result.scalar_one_or_none()
            
        if prefer_new:
            question = await get_new_question()
            if question:
                return question

            question = await get_weak_question()
            if question:
                return question
        else:
            question = await get_weak_question()
            if question:
                return question

            question = await get_new_question()
            if question:
                return question
            
        return await self.get_random_quiz_question(topic_id=topic_id)