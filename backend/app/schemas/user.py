from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    

class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: str
    created_at: datetime
    xp: int
    level: int
    current_streak: int
    last_activity_date: date | None

    class Config:
        from_attributes = True
        
