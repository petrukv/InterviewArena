from app.core.security import create_access_token, verify_password, hash_password
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.schemas.auth import TokenResponse
from app.models.user import User


class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        
    async def register(self, data: UserCreate) -> User:
        existing_email = await self.user_repository.get_by_email(data.email)
        
        if existing_email:
            raise ValueError("Email already registered")
        
        existing_username = await self.user_repository.get_by_username(data.username)
        
        if existing_username:
            raise ValueError("Username already taken")
        
        password_hash = hash_password(data.password)
        
        return await self.user_repository.create(
            email=data.email,
            username=data.username,
            password_hash=password_hash
        )
        
    async def login(self, email: str, password: str) -> TokenResponse:
        user = await self.user_repository.get_by_email(email)
        
        if not user:
            raise ValueError("Invalid email or password")
        
        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password")
        
        access_token = create_access_token(subject=str(user.id))
        
        return TokenResponse(access_token=access_token)