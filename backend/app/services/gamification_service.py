from datetime import date, timedelta

from app.models.user import User


class GamificationService:
    CORRECT_ANSWER_XP = 10
    WRONG_ANSWER_XP = 2
    XP_PER_LEVEL = 100
    
    async def apply_quiz_reward(
        self,
        user: User,
        is_correct: bool,
    ) -> dict:
        xp_gained = self.CORRECT_ANSWER_XP if is_correct else self.WRONG_ANSWER_XP
        
        user.xp += xp_gained
        user.level = user.xp // self.XP_PER_LEVEL + 1
        
        today = date.today()
        
        if user.last_activity_date is None:
            user.current_streak = 1
        elif user.last_activity_date == today:
            pass
        elif user.last_activity_date == today - timedelta(days=1):
            user.current_streak += 1
        else:
            user.current_streak = 1
            
        user.last_activity_date = today
        
        return {
            "xp_gained": xp_gained,
            "total_xp": user.xp,
            "level": user.level,
            "current_streak": user.current_streak,
        }
        
    async def apply_flashcard_reward(
        self,
        user: User,
        status: str,
    ) -> dict:
        xp_map = {
            "knew": 5,
            "almost": 3,
            "didnt_know": 1,
        }

        xp_gained = xp_map.get(status, 0)

        user.xp += xp_gained
        user.level = user.xp // self.XP_PER_LEVEL + 1

        today = date.today()

        if user.last_activity_date is None:
            user.current_streak = 1
        elif user.last_activity_date == today:
            pass
        elif user.last_activity_date == today - timedelta(days=1):
            user.current_streak += 1
        else:
            user.current_streak = 1

        user.last_activity_date = today

        return {
            "xp_gained": xp_gained,
            "total_xp": user.xp,
            "level": user.level,
            "current_streak": user.current_streak,
        }