from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth_deps import get_current_user
from app.api.deps import get_db_session
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserRead
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post('/register', response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db_session)):
    user_repository = UserRepository(db)
    auth_service = AuthService(user_repository)
    
    try:
        return await auth_service.register(data)
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))
    
    
@router.post('/login', response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db_session)):
    user_repository = UserRepository(db)
    auth_service = AuthService(user_repository)
    
    try:
        return await auth_service.login(
            email=data.email,
            password=data.password,
        )
        
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
        
@router.get('/me', response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return current_user


