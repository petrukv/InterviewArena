from pydantic import BaseModel


class TopicRead(BaseModel):
    id: int
    title: str
    slug: str
    description: str | None

    class Config:
        from_attributes = True