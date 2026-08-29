"""Application configuration."""
import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    PORT = int(os.getenv("PORT", 5000))
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-secret-change-me-in-production-0123456789")

    # --- Database (SQLite by default; set DATABASE_URL for Postgres etc.) ---
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR = os.path.join(BASE_DIR, "data")
    os.makedirs(DATA_DIR, exist_ok=True)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(DATA_DIR, "portfolio.db").replace("\\", "/"),
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- File uploads (images, PDFs, documents) ---
    UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    MAX_CONTENT_LENGTH = 15 * 1024 * 1024  # 15 MB
    ALLOWED_UPLOAD_EXTENSIONS = {
        "png", "jpg", "jpeg", "gif", "webp", "svg", "ico",
        "pdf", "txt", "md", "doc", "docx", "ppt", "pptx",
        "xls", "xlsx", "csv", "zip", "mp4", "webm",
        "mp3", "wav",
    }

    # --- JWT admin auth ---
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 12  # 12h sessions

    # --- Admin credentials (seeded on first run) ---
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "faraz2026")

