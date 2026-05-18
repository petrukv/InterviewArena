from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.questions import router as questions_router
from app.api.topics import router as topics_router
from app.api.learning import router as learning_router
from app.api.quiz import router as quiz_router


app = FastAPI(
    title="Interview Prep API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(topics_router)
app.include_router(questions_router)
app.include_router(learning_router)
app.include_router(quiz_router)