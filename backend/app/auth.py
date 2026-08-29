from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.database import get_db

from app import models

from app.security import verify_access_token


# ============================================================
# OAUTH2 CONFIGURATION
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# ============================================================
# GET CURRENT LOGGED-IN USER
# ============================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    # ========================================================
    # VERIFY JWT
    # ========================================================

    user_id = verify_access_token(
        token
    )

    if user_id is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


    # ========================================================
    # CONVERT USER ID
    # ========================================================

    try:

        user_id = int(user_id)

    except (
        TypeError,
        ValueError
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


    # ========================================================
    # FIND USER
    # ========================================================

    user = (
        db.query(models.User)
        .filter(
            models.User.id == user_id
        )
        .first()
    )


    if user is None:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )


    # ========================================================
    # RETURN LOGGED-IN USER
    # ========================================================

    return user