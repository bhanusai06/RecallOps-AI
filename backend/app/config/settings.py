from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    project_name: str = "IncidentMind AI"
    version: str = "0.1.0"
    database_url: str = "sqlite+aiosqlite:///./incidentmind.db"
    openrouter_api_key: str = ""
    hindsight_api_key: str = ""

    cascadeflow_api_key: str = ""
    cascadeflow_max_budget: float = 100.0
    default_model: str = "gpt-4-turbo"
    cheap_model: str = "gemini-flash"
    premium_model: str = "gpt-4-turbo"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
