from app.models.topic import Topic
from app.repositories.topic_repository import TopicRepository


class TopicService:
    def __init__(self, topic_repository: TopicRepository):
        self.topic_repository = topic_repository

    async def list_topics(self) -> list[Topic]:
        return await self.topic_repository.list_all()