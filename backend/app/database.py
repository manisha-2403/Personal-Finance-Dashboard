import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

# backend/ directory
BASE_DIR = Path(__file__).resolve().parent.parent

# backend/.env
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


# ==========================================
# DATABASE CONFIGURATION
# ==========================================

DATABASE_URL = os.getenv("DATABASE_URL")


if not DATABASE_URL:
    raise RuntimeError(
        f"DATABASE_URL is not set. "
        f"Please check your .env file at: {ENV_FILE}"
    )


# ==========================================
# DATABASE ENGINE
# ==========================================

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)


# ==========================================
# DATABASE SESSION
# ==========================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ==========================================
# BASE MODEL
# ==========================================

Base = declarative_base()


# ==========================================
# DATABASE DEPENDENCY
# ==========================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()