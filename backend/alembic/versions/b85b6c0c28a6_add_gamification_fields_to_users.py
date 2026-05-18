"""add gamification fields to users

Revision ID: b85b6c0c28a6
Revises: b3ab8f783077
Create Date: 2026-05-18 13:04:31.938508

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b85b6c0c28a6'
down_revision: Union[str, Sequence[str], None] = 'b3ab8f783077'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("xp", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "users",
        sa.Column("level", sa.Integer(), nullable=False, server_default="1"),
    )
    op.add_column(
        "users",
        sa.Column("current_streak", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "users",
        sa.Column("last_activity_date", sa.Date(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "last_activity_date")
    op.drop_column("users", "current_streak")
    op.drop_column("users", "level")
    op.drop_column("users", "xp")