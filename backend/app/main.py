from fastapi import Depends
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session

import csv
import io

from app.security import hash_password
from app.security import verify_password
from app.security import create_access_token

from app.auth import get_current_user

from app.database import Base
from app.database import engine
from app.database import get_db

from app import crud
from app import schemas

from app import budget_models
from app import budget_crud
from app import budget_schemas
from typing import Optional

# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# CREATE FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Personal Finance Dashboard",
    version="1.0"
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://personal-finance-dashboard-xi-two.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Backend Running Successfully"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "Healthy"
    }


# ==========================================
# GET ALL TRANSACTIONS
# ==========================================

@app.get("/transactions")
def read_transactions(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return crud.get_transactions(
        db,
        current_user.id
    )

# ==========================================
# ADD TRANSACTION
# ==========================================

@app.post("/transactions")
def add_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return crud.create_transaction(
        db,
        transaction,
        current_user.id
    )

# ==========================================
# UPDATE TRANSACTION
# ==========================================

@app.put("/transactions/{transaction_id}")
def edit_transaction(
    transaction_id: int,
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    result = crud.update_transaction(
        db,
        transaction_id,
        transaction,
        current_user.id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return result

# ==========================================
# DELETE TRANSACTION
# ==========================================

@app.delete("/transactions/{transaction_id}")
def remove_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return crud.delete_transaction(
        db,
        transaction_id,
        current_user.id
    )

# ==========================================
# EXPORT CURRENT USER TRANSACTIONS TO CSV
# ==========================================

@app.get("/transactions/export/csv")
def export_transactions_csv(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    transactions = crud.get_transactions(
        db,
        current_user.id
    )

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "ID",
        "Title",
        "Amount",
        "Type",
        "Category",
        "Date",
        "Notes"
    ])

    for transaction in transactions:

        writer.writerow([
            transaction.id,
            transaction.title,
            transaction.amount,
            transaction.type,
            transaction.category,
            transaction.date,
            transaction.notes
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
                "attachment; filename=finance_transactions.csv"
        }
    )

# ==========================================
# GET MONTHLY BUDGET
# ==========================================

@app.get("/budget/{month}")
def get_budget(
    month: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    budget = budget_crud.get_budget(
        db=db,
        month=month,
        user_id=current_user.id
    )

    return {
        "budget": budget
    }


# ==========================================
# CREATE OR UPDATE MONTHLY BUDGET
# ==========================================

@app.post("/budget")
def create_or_update_budget(
    budget_data: budget_schemas.BudgetCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if budget_data.amount <= 0:

        raise HTTPException(
            status_code=400,
            detail="Budget amount must be greater than zero"
        )

    budget = budget_crud.create_or_update_budget(
        db=db,
        budget_data=budget_data,
        user_id=current_user.id
    )

    return {
        "message": "Budget saved successfully",
        "budget": budget
    }

# ==========================================
# REGISTER USER
# ==========================================

@app.post(
    "/auth/register",
    response_model=schemas.UserResponse
)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    # Check whether email already exists

    existing_user = crud.get_user_by_email(
        db,
        user.email
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # crud.create_user() handles password hashing

    return crud.create_user(
        db,
        user
    )

# ==========================================
# LOGIN USER
# ==========================================

@app.post("/auth/login")
def login_user(
    user: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    authenticated_user = crud.authenticate_user(
        db,
        user.email,
        user.password
    )

    if not authenticated_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": str(authenticated_user.id)
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": authenticated_user.id,
            "username": authenticated_user.username,
            "email": authenticated_user.email
        }
    }
# ==========================================
# PROTECTED USER PROFILE
# ==========================================

@app.get("/auth/me")
def get_my_profile(
    current_user=Depends(get_current_user)
):

    return {
        "message": "Authentication successful",
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email
        }
    }