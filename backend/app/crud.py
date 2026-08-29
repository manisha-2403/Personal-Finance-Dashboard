from sqlalchemy.orm import Session

from app import models
from app import schemas

from app.security import (
    verify_password,
    hash_password
)


# ==========================================
# TRANSACTION FUNCTIONS
# ==========================================


def get_transactions(
    db: Session,
    user_id: int
):

    return (
        db.query(models.Transaction)
        .filter(
            models.Transaction.user_id == user_id
        )
        .order_by(
            models.Transaction.id.desc()
        )
        .all()
    )


def create_transaction(
    db: Session,
    transaction: schemas.TransactionCreate,
    user_id: int
):

    new_transaction = models.Transaction(
        user_id=user_id,
        title=transaction.title,
        amount=transaction.amount,
        type=transaction.type,
        category=transaction.category,
        date=transaction.date,
        notes=transaction.notes
    )

    db.add(new_transaction)

    db.commit()

    db.refresh(new_transaction)

    return new_transaction


def update_transaction(
    db: Session,
    transaction_id: int,
    transaction: schemas.TransactionCreate,
    user_id: int
):

    existing_transaction = (
        db.query(models.Transaction)
        .filter(
            models.Transaction.id == transaction_id,
            models.Transaction.user_id == user_id
        )
        .first()
    )

    if existing_transaction is None:
        return None

    existing_transaction.title = (
        transaction.title
    )

    existing_transaction.amount = (
        transaction.amount
    )

    existing_transaction.type = (
        transaction.type
    )

    existing_transaction.category = (
        transaction.category
    )

    existing_transaction.date = (
        transaction.date
    )

    existing_transaction.notes = (
        transaction.notes
    )

    db.commit()

    db.refresh(existing_transaction)

    return existing_transaction


def delete_transaction(
    db: Session,
    transaction_id: int,
    user_id: int
):

    transaction = (
        db.query(models.Transaction)
        .filter(
            models.Transaction.id == transaction_id,
            models.Transaction.user_id == user_id
        )
        .first()
    )

    if transaction is None:

        return {
            "message": "Transaction not found"
        }

    db.delete(transaction)

    db.commit()

    return {
        "message": "Transaction deleted successfully"
    }


# ==========================================
# USER FUNCTIONS
# ==========================================


def get_user_by_email(
    db: Session,
    email: str
):

    return (
        db.query(models.User)
        .filter(
            models.User.email == email
        )
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: int
):

    return (
        db.query(models.User)
        .filter(
            models.User.id == user_id
        )
        .first()
    )


def create_user(
    db: Session,
    user: schemas.UserCreate
):

    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(
            user.password
        )
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user


# ==========================================
# AUTHENTICATE USER
# ==========================================


def authenticate_user(
    db: Session,
    email: str,
    password: str
):

    user = get_user_by_email(
        db,
        email
    )

    if user is None:
        return None

    password_valid = verify_password(
        password,
        user.hashed_password
    )

    if not password_valid:
        return None

    return user