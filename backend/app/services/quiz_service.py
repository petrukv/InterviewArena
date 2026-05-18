from app.models.question import Question
from app.repositories.question_repository import QuestionRepository
from app.schemas.quiz import SubmitQuizAnswerResponse


class QuizService:
    def __init__(self, question_repository: QuestionRepository):
        self.question_repository = question_repository
        
    async def get_random_quiz_question(
        self,
        topic_id: int | None = None
    ) -> Question | None:
        return await self.question_repository.get_random_quiz_question(
            topic_id=topic_id,
        )
        
    async def submit_answer(
        self,
        question_id: int,
        option_id: int
    ) -> SubmitQuizAnswerResponse:
        
        question = await self.question_repository.get_by_id(question_id)
        
        if not question:
            raise ValueError("Question not found")
        
        option = await self.question_repository.get_option_by_id(option_id)
        
        if not option or option.question_id != question.id:
            raise ValueError("Invalid option")
        
        correct_option = next(
            option for option in question.options if option.is_correct
        )
        
        return SubmitQuizAnswerResponse(
            is_correct=option.is_correct,
            correct_option_id=correct_option.id,
            explanation=question.explanation,
        )
        
    async def get_adaptive_quiz_question(
        self,
        user_id: int,
        topic_id: int | None = None,
    ) -> Question | None:
        return await self.question_repository.get_adaptive_quiz_question(
            user_id=user_id,
            topic_id=topic_id,
        )