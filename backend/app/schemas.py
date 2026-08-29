from pydantic import BaseModel, ConfigDict, Field


# ==========================================
# TRANSACTION SCHEMAS
# ==========================================

class TransactionCreate(BaseModel):
    title: str
    amount: float
    type: str
    category: str
    date: str
    notes: str = ""


class Transaction(TransactionCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# BUDGET SCHEMAS
# ==========================================

class BudgetCreate(BaseModel):
    month: str
    amount: float


class BudgetResponse(BaseModel):
    id: int
    month: str
    amount: float

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# USER SCHEMAS
# ==========================================

class UserCreate(BaseModel):
    username: str
    email: str
    password: str


# ==========================================
# USER RESPONSE
# ==========================================

class UserResponse(BaseModel):
    id: int

    username: str 
    email: str

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# LOGIN SCHEMAS
# ==========================================

class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    user: UserResponse