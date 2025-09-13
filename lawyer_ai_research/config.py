"""
Configuration settings for the Lawyer AI Research Tool
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    app_name: str = "Lawyer AI Research Tool"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Server Settings
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Database Settings
    database_url: Optional[str] = None
    redis_url: Optional[str] = None
    
    # AI Model Settings
    classification_model: str = "facebook/bart-large-mnli"
    sentence_transformer_model: str = "all-MiniLM-L6-v2"
    classification_method: str = "ensemble"
    top_k_sections: int = 5
    
    # Similarity Thresholds
    similarity_threshold: float = 0.7
    precedent_threshold: float = 0.85
    
    # File Storage
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    
    # Security
    secret_key: str = "your-secret-key-here"
    access_token_expire_minutes: int = 30
    
    # CORS Settings
    cors_origins: list = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list = ["*"]
    cors_allow_headers: list = ["*"]
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 60  # seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()

# Environment-specific configurations
class DevelopmentSettings(Settings):
    """Development environment settings."""
    debug: bool = True
    log_level: str = "DEBUG"

class ProductionSettings(Settings):
    """Production environment settings."""
    debug: bool = False
    log_level: str = "WARNING"
    cors_origins: list = ["https://yourdomain.com"]

class TestingSettings(Settings):
    """Testing environment settings."""
    debug: bool = True
    log_level: str = "DEBUG"
    database_url: str = "sqlite:///./test.db"

def get_settings() -> Settings:
    """Get settings based on environment."""
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    if env == "production":
        return ProductionSettings()
    elif env == "testing":
        return TestingSettings()
    else:
        return DevelopmentSettings()
