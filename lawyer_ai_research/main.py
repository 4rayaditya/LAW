"""
FastAPI Main Application for Lawyer AI Research Tool
Provides REST API endpoints for legal case analysis and research.
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uvicorn
import logging
from datetime import datetime
import os
import tempfile

# Import our custom modules
from legal_ai_pipeline import LegalAIPipeline
from legal_case_retrieval import LegalCaseRetrieval
from ipc_database import get_all_sections, get_ipc_section, search_sections_by_keyword
from cases_database import get_all_cases, get_case_by_id, search_cases_by_keyword

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Lawyer AI Research Tool",
    description="AI-powered legal research and case analysis platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
legal_pipeline = None
case_retrieval = None

# Pydantic models for request/response
class TranscriptAnalysisRequest(BaseModel):
    transcript_text: str = Field(..., description="Legal case transcript text")
    case_metadata: Optional[Dict[str, Any]] = Field(None, description="Optional case metadata")
    classification_method: Optional[str] = Field("ensemble", description="Classification method")
    top_k_sections: Optional[int] = Field(5, description="Number of top IPC sections to return")

class CaseSearchRequest(BaseModel):
    query: str = Field(..., description="Search query for similar cases")
    target_sections: Optional[List[str]] = Field(None, description="IPC sections to filter by")
    top_k: Optional[int] = Field(10, description="Number of results to return")

class IPCSectionRequest(BaseModel):
    section_number: str = Field(..., description="IPC section number")

class KeywordSearchRequest(BaseModel):
    keyword: str = Field(..., description="Keyword to search for")

class BatchAnalysisRequest(BaseModel):
    transcripts: List[Dict[str, Any]] = Field(..., description="List of transcripts to analyze")

# Response models
class AnalysisResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str
    timestamp: str

class SearchResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    components: Dict[str, bool]

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the AI components on startup."""
    global legal_pipeline, case_retrieval
    
    try:
        logger.info("Initializing Legal AI Pipeline...")
        legal_pipeline = LegalAIPipeline()
        
        logger.info("Initializing Case Retrieval System...")
        case_retrieval = LegalCaseRetrieval()
        case_retrieval.load_cases_database()
        case_retrieval.generate_embeddings()
        
        logger.info("All components initialized successfully!")
        
    except Exception as e:
        logger.error(f"Error initializing components: {e}")
        raise

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.now().isoformat(),
        components={
            "legal_pipeline": legal_pipeline is not None,
            "case_retrieval": case_retrieval is not None
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Lawyer AI Research Tool API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# Transcript analysis endpoints
@app.post("/api/analyze/transcript", response_model=AnalysisResponse)
async def analyze_transcript(request: TranscriptAnalysisRequest):
    """Analyze a legal case transcript and return IPC classification."""
    try:
        if not legal_pipeline:
            raise HTTPException(status_code=503, detail="Legal pipeline not initialized")
        
        # Update pipeline configuration if needed
        if request.classification_method != legal_pipeline.classification_method:
            legal_pipeline.classification_method = request.classification_method
        if request.top_k_sections != legal_pipeline.top_k_sections:
            legal_pipeline.top_k_sections = request.top_k_sections
        
        # Process the transcript
        result = legal_pipeline.process_transcript(
            transcript_text=request.transcript_text,
            case_metadata=request.case_metadata
        )
        
        return AnalysisResponse(
            success=True,
            data=result,
            message="Transcript analyzed successfully",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error analyzing transcript: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/batch", response_model=AnalysisResponse)
async def analyze_batch_transcripts(request: BatchAnalysisRequest):
    """Analyze multiple transcripts in batch."""
    try:
        if not legal_pipeline:
            raise HTTPException(status_code=503, detail="Legal pipeline not initialized")
        
        # Process batch
        results = legal_pipeline.batch_process(request.transcripts)
        
        return AnalysisResponse(
            success=True,
            data={"results": results, "total_processed": len(results)},
            message=f"Batch analysis completed for {len(results)} transcripts",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in batch analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Case search endpoints
@app.post("/api/search/cases", response_model=SearchResponse)
async def search_similar_cases(request: CaseSearchRequest):
    """Search for similar legal cases."""
    try:
        if not case_retrieval:
            raise HTTPException(status_code=503, detail="Case retrieval system not initialized")
        
        # Perform comprehensive search
        results = case_retrieval.comprehensive_search(
            query=request.query,
            target_sections=request.target_sections,
            top_k=request.top_k
        )
        
        return SearchResponse(
            success=True,
            data=results,
            message="Case search completed successfully",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error searching cases: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/search/cases/precedent/{query}")
async def find_precedent_cases(query: str, top_k: int = 5):
    """Find precedent cases for a given query."""
    try:
        if not case_retrieval:
            raise HTTPException(status_code=503, detail="Case retrieval system not initialized")
        
        precedent_cases = case_retrieval.find_precedent_cases(query, top_k=top_k)
        
        return SearchResponse(
            success=True,
            data={"precedent_cases": precedent_cases},
            message=f"Found {len(precedent_cases)} precedent cases",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error finding precedent cases: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# IPC database endpoints
@app.get("/api/ipc/sections")
async def get_all_ipc_sections():
    """Get all IPC sections."""
    try:
        sections = get_all_sections()
        return {
            "success": True,
            "data": {"sections": sections, "total_count": len(sections)},
            "message": "IPC sections retrieved successfully",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error retrieving IPC sections: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ipc/section/{section_number}")
async def get_ipc_section_details(section_number: str):
    """Get details of a specific IPC section."""
    try:
        section = get_ipc_section(section_number)
        if not section:
            raise HTTPException(status_code=404, detail=f"IPC section {section_number} not found")
        
        return {
            "success": True,
            "data": section,
            "message": f"IPC section {section_number} retrieved successfully",
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving IPC section: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ipc/search")
async def search_ipc_sections(request: KeywordSearchRequest):
    """Search IPC sections by keyword."""
    try:
        matching_sections = search_sections_by_keyword(request.keyword)
        
        return {
            "success": True,
            "data": {"sections": matching_sections, "total_count": len(matching_sections)},
            "message": f"Found {len(matching_sections)} matching IPC sections",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error searching IPC sections: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Cases database endpoints
@app.get("/api/cases")
async def get_all_legal_cases():
    """Get all legal cases from the database."""
    try:
        cases = get_all_cases()
        return {
            "success": True,
            "data": {"cases": cases, "total_count": len(cases)},
            "message": "Legal cases retrieved successfully",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error retrieving legal cases: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cases/{case_id}")
async def get_legal_case(case_id: str):
    """Get a specific legal case by ID."""
    try:
        case = get_case_by_id(case_id)
        if not case:
            raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
        
        return {
            "success": True,
            "data": case,
            "message": f"Case {case_id} retrieved successfully",
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving case: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/cases/search")
async def search_legal_cases(request: KeywordSearchRequest):
    """Search legal cases by keyword."""
    try:
        matching_cases = search_cases_by_keyword(request.keyword)
        
        return {
            "success": True,
            "data": {"cases": matching_cases, "total_count": len(matching_cases)},
            "message": f"Found {len(matching_cases)} matching cases",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error searching legal cases: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# System information endpoints
@app.get("/api/system/info")
async def get_system_info():
    """Get system information and configuration."""
    try:
        if not legal_pipeline:
            raise HTTPException(status_code=503, detail="Legal pipeline not initialized")
        
        system_info = legal_pipeline.get_system_info()
        
        # Add case retrieval stats if available
        if case_retrieval:
            case_stats = case_retrieval.get_database_stats()
            system_info["case_retrieval_stats"] = case_stats
        
        return {
            "success": True,
            "data": system_info,
            "message": "System information retrieved successfully",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error retrieving system info: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Document upload endpoint (for future file processing)
@app.post("/api/upload/document")
async def upload_document(file: UploadFile = File(...)):
    """Upload a document for analysis (placeholder for future implementation)."""
    try:
        # For now, just return file info
        # In the future, this could process PDFs, Word docs, etc.
        return {
            "success": True,
            "data": {
                "filename": file.filename,
                "content_type": file.content_type,
                "size": file.size if hasattr(file, 'size') else "unknown"
            },
            "message": "Document uploaded successfully (processing not yet implemented)",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": "Resource not found",
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
