from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.topic import Topic


class TopicRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
        
    
    async def list_all(self) -> list[Topic]:
        result = await self.db.execute(select(Topic).order_by(Topic.id))
        return list(result.scalars().all())