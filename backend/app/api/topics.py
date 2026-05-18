from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db_session
from app.api.auth_deps import get_current_user
from app.models.user import User
from app.repositories.topic_repository import TopicRepository
from app.schemas.topic import TopicRead
from app.services.topic_service import TopicService


router = APIRouter(prefix='/topics', tags=['topics'])

@router.get('/', response_model=list[TopicRead])
async def list_topics(
    db: AsyncSession = Depends(get_db_session),
    #current_user: User = Depends(get_current_user)
):
    topic_repository = TopicRepository(db)
    topic_service = TopicService(topic_repository)
    
    return await topic_service.list_topics()

