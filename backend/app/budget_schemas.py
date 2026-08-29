from pydantic import BaseModel


class BudgetCreate(BaseModel):

    month: str

    amount: float


class BudgetResponse(BaseModel):

    id: int

    user_id: int

    month: str

    amount: float

    class Config:
        from_attributes = True