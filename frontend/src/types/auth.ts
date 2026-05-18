export type LoginResponse = {
    access_token: string;
    token_type: string;
}

export type User = {
    id: number;
    email: string;
    username: string;
    created_at: string;
    xp: number;
    level: number;
    current_streak: number;
    last_activity_date: string | null;
};