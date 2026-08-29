from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import UniqueConstraint

from app.database import Base


class Budget(Base):

    __tablename__ = "budgets"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "month",
            name="uq_budget_user_month"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    month = Column(
        String,
        nullable=False,
        index=True
    )

    amount = Column(
        Float,
        nullable=False
    )