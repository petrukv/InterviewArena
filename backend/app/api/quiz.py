from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth_deps import get_current_user
from app.api.deps import get_db_session
from app.models.user import User
from app.repositories.question_repository import QuestionRepository
from app.repositories.progress_repository import ProgressRepository
from app.services.progress_service import ProgressService
from app.services.gamification_service import GamificationService
from app.schemas.quiz import (
    QuizQuestionRead,
    SubmitQuizAnswerRequest,
    SubmitQuizAnswerResponse,
)
from app.services.quiz_service import QuizService
from app.repositories import progress_repository


router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"],
)


@router.get("/random", response_model=QuizQuestionRead)
async def get_random_quiz_question(
    topic_id: int | None = Query(default=None),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    repository = QuestionRepository(db)
    service = QuizService(repository)

    question = await service.get_random_quiz_question(topic_id=topic_id)

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz question not found",
        )

    return question


@router.post("/answer", response_model=SubmitQuizAnswerResponse)
async def submit_quiz_answer(
    data: SubmitQuizAnswerRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    question_repository = QuestionRepository(db)
    quiz_service = QuizService(question_repository)

    
    progress_repository = ProgressRepository(db)
    progress_service = ProgressService(progress_repository)

    try:
        result = await quiz_service.submit_answer(
            question_id=data.question_id,
            option_id=data.option_id,
        )

        await progress_service.record_quiz_answer(
            user_id=current_user.id,
            question_id=data.question_id,
            is_correct=result.is_correct,
        )
        
        gamification_service = GamificationService()
        gamification_result = await gamification_service.apply_quiz_reward(
            user=current_user,
            is_correct=result.is_correct,
        )
        
        await db.commit()
        await db.refresh(current_user)

        result.xp_gained = gamification_result["xp_gained"]
        result.total_xp = gamification_result["total_xp"]
        result.level = gamification_result["level"]
        result.current_streak = gamification_result["current_streak"]
        

        return result

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
        
@router.get("/adaptive", response_model=QuizQuestionRead)
async def get_adaptive_quiz_question(
    topic_id: int | None = Query(default=None),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    repository = QuestionRepository(db)
    service = QuizService(repository)

    question = await service.get_adaptive_quiz_question(
        user_id=current_user.id,
        topic_id=topic_id,
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Adaptive quiz question not found",
        )

    return question