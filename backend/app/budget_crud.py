from sqlalchemy.orm import Session

from app.budget_models import Budget
from app.budget_schemas import BudgetCreate


# ==========================================
# GET BUDGET FOR CURRENT USER AND MONTH
# ==========================================

def get_budget(
    db: Session,
    month: str,
    user_id: int
):

    return (
        db.query(Budget)
        .filter(
            Budget.month == month,
            Budget.user_id == user_id
        )
        .first()
    )


# ==========================================
# CREATE OR UPDATE BUDGET
# ==========================================

def create_or_update_budget(
    db: Session,
    budget_data: BudgetCreate,
    user_id: int
):

    existing_budget = get_budget(
        db=db,
        month=budget_data.month,
        user_id=user_id
    )

    # ======================================
    # UPDATE EXISTING BUDGET
    # ======================================

    if existing_budget:

        existing_budget.amount = budget_data.amount

        db.commit()

        db.refresh(existing_budget)

        return existing_budget

    # ======================================
    # CREATE NEW BUDGET
    # ======================================

    new_budget = Budget(
        user_id=user_id,
        month=budget_data.month,
        amount=budget_data.amount
    )

    db.add(new_budget)

    db.commit()

    db.refresh(new_budget)

    return new_budget