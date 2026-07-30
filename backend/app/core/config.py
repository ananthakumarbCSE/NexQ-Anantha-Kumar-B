"""Q-Edge Guardian – Core configuration loaded from environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application-wide settings backed by `.env` file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PROJECT_NAME: str = "Q-Edge Guardian"
    DATABASE_URL: str = "sqlite:///./q_edge_guardian.db"
    DEBUG: bool = True


settings = Settings()
