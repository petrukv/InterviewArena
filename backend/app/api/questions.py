from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db_session
from app.api.auth_deps import get_current_user
from app.models.user import User
from app.repositories.question_repository import QuestionRepository
from app.schemas.question import QuestionRead
from app.services.question_service import QuestionService


router = APIRouter(prefix='/questions', tags=['questions'])

@router.get('/', response_model=list[QuestionRead])
async def list_questions(
    topic_id: int | None = Query(default=None),
    question_type: str | None = Query(None),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    repository = QuestionRepository(db)
    service = QuestionService(repository)
    
    return await service.list_questions(
        topic_id=topic_id,
        question_type=question_type,
    )
    
@router.get('/{question_id}', response_model=QuestionRead)
async def get_question(
    question_id: int, 
    db: AsyncSession = Depends(get_db_session), 
    current_user: User = Depends(get_current_user)
):
    repository = QuestionRepository(db)
    service = QuestionService(repository)
    
    question = await service.get_question(question_id)
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )
        
    return question