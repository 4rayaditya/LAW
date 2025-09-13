"""
Database models and configurations for the Lawyer AI Research Tool
"""

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from typing import Optional, List
from config import settings

# Database setup
if settings.database_url:
    engine = create_engine(settings.database_url)
else:
    # Default to SQLite for development
    engine = create_engine("sqlite:///./lawyer_ai_research.db")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    """User model for authentication and user management."""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    role = Column(String, default="user")  # user, lawyer, judge, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CaseAnalysis(Base):
    """Model for storing case analysis results."""
    __tablename__ = "case_analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    case_title = Column(String, nullable=False)
    transcript_text = Column(Text, nullable=False)
    case_metadata = Column(JSON, nullable=True)
    
    # Analysis results
    primary_crime = Column(String, nullable=True)
    ipc_sections = Column(JSON, nullable=True)
    confidence_score = Column(Float, nullable=True)
    classification_method = Column(String, nullable=True)
    
    # Processing info
    processing_time = Column(Float, nullable=True)  # in seconds
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CaseSearch(Base):
    """Model for storing case search queries and results."""
    __tablename__ = "case_searches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    query = Column(Text, nullable=False)
    target_sections = Column(JSON, nullable=True)
    search_results = Column(JSON, nullable=True)
    
    # Search metrics
    total_results = Column(Integer, default=0)
    precedent_cases_found = Column(Integer, default=0)
    highest_similarity = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class LegalDocument(Base):
    """Model for storing uploaded legal documents."""
    __tablename__ = "legal_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    content_type = Column(String, nullable=False)
    
    # Document analysis
    extracted_text = Column(Text, nullable=True)
    analysis_results = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class IPCSectionUsage(Base):
    """Model for tracking IPC section usage statistics."""
    __tablename__ = "ipc_section_usage"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    section_number = Column(String, nullable=False, index=True)
    section_title = Column(String, nullable=False)
    usage_count = Column(Integer, default=1)
    last_used = Column(DateTime, default=datetime.utcnow)
    
    # Usage context
    classification_method = Column(String, nullable=True)
    confidence_scores = Column(JSON, nullable=True)  # Store array of confidence scores

class SystemMetrics(Base):
    """Model for storing system performance metrics."""
    __tablename__ = "system_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_name = Column(String, nullable=False, index=True)
    metric_value = Column(Float, nullable=False)
    metric_unit = Column(String, nullable=True)
    metadata = Column(JSON, nullable=True)
    
    recorded_at = Column(DateTime, default=datetime.utcnow)

# Database utility functions
def get_db() -> Session:
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """Drop all database tables."""
    Base.metadata.drop_all(bind=engine)

# Database operations
class DatabaseOperations:
    """Database operations helper class."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, email: str, username: str, full_name: str, hashed_password: str, role: str = "user") -> User:
        """Create a new user."""
        user = User(
            email=email,
            username=username,
            full_name=full_name,
            hashed_password=hashed_password,
            role=role
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def save_case_analysis(self, user_id: str, case_title: str, transcript_text: str, 
                          analysis_results: dict, case_metadata: dict = None) -> CaseAnalysis:
        """Save case analysis results."""
        case_analysis = CaseAnalysis(
            user_id=user_id,
            case_title=case_title,
            transcript_text=transcript_text,
            case_metadata=case_metadata,
            primary_crime=analysis_results.get('case_analysis', {}).get('primary_crime_classification'),
            ipc_sections=analysis_results.get('case_analysis', {}).get('ipc_sections'),
            confidence_score=analysis_results.get('case_analysis', {}).get('confidence_score'),
            classification_method=analysis_results.get('case_analysis', {}).get('classification_method')
        )
        self.db.add(case_analysis)
        self.db.commit()
        self.db.refresh(case_analysis)
        return case_analysis
    
    def save_case_search(self, user_id: str, query: str, search_results: dict, 
                        target_sections: List[str] = None) -> CaseSearch:
        """Save case search results."""
        case_search = CaseSearch(
            user_id=user_id,
            query=query,
            target_sections=target_sections,
            search_results=search_results,
            total_results=search_results.get('summary', {}).get('total_similar_cases', 0),
            precedent_cases_found=search_results.get('summary', {}).get('total_precedent_cases', 0),
            highest_similarity=search_results.get('summary', {}).get('highest_similarity', 0)
        )
        self.db.add(case_search)
        self.db.commit()
        self.db.refresh(case_search)
        return case_search
    
    def update_ipc_usage(self, section_number: str, section_title: str, 
                        classification_method: str, confidence_score: float):
        """Update IPC section usage statistics."""
        usage = self.db.query(IPCSectionUsage).filter(
            IPCSectionUsage.section_number == section_number
        ).first()
        
        if usage:
            usage.usage_count += 1
            usage.last_used = datetime.utcnow()
            if not usage.confidence_scores:
                usage.confidence_scores = []
            usage.confidence_scores.append(confidence_score)
        else:
            usage = IPCSectionUsage(
                section_number=section_number,
                section_title=section_title,
                usage_count=1,
                classification_method=classification_method,
                confidence_scores=[confidence_score]
            )
            self.db.add(usage)
        
        self.db.commit()
    
    def get_user_analyses(self, user_id: str, limit: int = 10) -> List[CaseAnalysis]:
        """Get user's case analyses."""
        return self.db.query(CaseAnalysis).filter(
            CaseAnalysis.user_id == user_id
        ).order_by(CaseAnalysis.created_at.desc()).limit(limit).all()
    
    def get_user_searches(self, user_id: str, limit: int = 10) -> List[CaseSearch]:
        """Get user's case searches."""
        return self.db.query(CaseSearch).filter(
            CaseSearch.user_id == user_id
        ).order_by(CaseSearch.created_at.desc()).limit(limit).all()
    
    def get_popular_ipc_sections(self, limit: int = 10) -> List[IPCSectionUsage]:
        """Get most popular IPC sections."""
        return self.db.query(IPCSectionUsage).order_by(
            IPCSectionUsage.usage_count.desc()
        ).limit(limit).all()
    
    def record_system_metric(self, metric_name: str, metric_value: float, 
                           metric_unit: str = None, metadata: dict = None):
        """Record a system metric."""
        metric = SystemMetrics(
            metric_name=metric_name,
            metric_value=metric_value,
            metric_unit=metric_unit,
            metadata=metadata
        )
        self.db.add(metric)
        self.db.commit()

# Initialize database tables
if __name__ == "__main__":
    create_tables()
    print("Database tables created successfully!")
