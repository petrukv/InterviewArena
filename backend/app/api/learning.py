from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth_deps import get_current_user
from app.api.deps import get_db_session
from app.models.user import User
from app.repositories.question_repository import QuestionRepository
from app.repositories.progress_repository import ProgressRepository
from app.schemas.flashcard import FlashcardRead
from app.schemas.flashcard import (
    FlashcardRead,
    FlashcardFeedbackRequest,
    FlashcardFeedbackResponse,
)
from app.services.learning_service import LearningService
from app.services.gamification_service import GamificationService
from app.services.progress_service import ProgressService


router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"],
)


@router.get("/random", response_model=FlashcardRead)
async def get_random_flashcard(
    topic_id: int | None = Query(default=None),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    repository = QuestionRepository(db)
    service = LearningService(repository)

    flashcard = await service.get_random_flashcard(topic_id=topic_id)

    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found",
        )

    return flashcard

@router.post("/feedback", response_model=FlashcardFeedbackResponse)
async def submit_flashcard_feedback(
    data: FlashcardFeedbackRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    allowed_statuses = {"knew", "almost", "didnt_know"}

    if data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid flashcard status",
        )

    progress_repository = ProgressRepository(db)
    progress_service = ProgressService(progress_repository)

    await progress_service.record_flashcard_feedback(
        user_id=current_user.id,
        question_id=data.question_id,
        status=data.status,
    )

    gamification_service = GamificationService()

    gamification_result = await gamification_service.apply_flashcard_reward(
        user=current_user,
        status=data.status,
    )

    await db.commit()
    await db.refresh(current_user)

    return FlashcardFeedbackResponse(
        status=data.status,
        xp_gained=gamification_result["xp_gained"],
        total_xp=gamification_result["total_xp"],
        level=gamification_result["level"],
        current_streak=gamification_result["current_streak"],
    )