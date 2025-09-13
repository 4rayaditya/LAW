"""
Legal Case Retrieval System
Uses sentence transformers and vector search to find relevant and precedent cases.
"""

import numpy as np
import json
import pickle
from typing import Dict, List, Tuple, Optional
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os
from datetime import datetime

class LegalCaseRetrieval:
    """Legal case retrieval system using embeddings and similarity search."""
    
    def __init__(self, 
                 model_name: str = "all-MiniLM-L6-v2",
                 similarity_threshold: float = 0.7,
                 precedent_threshold: float = 0.85):
        """
        Initialize the legal case retrieval system.
        
        Args:
            model_name: Sentence transformer model name
            similarity_threshold: Minimum similarity for relevant cases
            precedent_threshold: Minimum similarity for precedent cases
        """
        self.model_name = model_name
        self.similarity_threshold = similarity_threshold
        self.precedent_threshold = precedent_threshold
        
        # Initialize sentence transformer
        print(f"Loading sentence transformer model: {model_name}")
        self.model = SentenceTransformer(model_name)
        
        # Storage for embeddings and metadata
        self.case_embeddings = None
        self.case_metadata = None
        self.cases_database = None
        
        # File paths for persistence
        self.embeddings_file = "case_embeddings.pkl"
        self.metadata_file = "case_metadata.pkl"
        
    def load_cases_database(self, cases_database_path: str = "cases_database.py"):
        """Load cases from the database file."""
        print("Loading cases database...")
        
        try:
            # Import the cases database
            import importlib.util
            spec = importlib.util.spec_from_file_location("cases_database", cases_database_path)
            cases_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(cases_module)
            
            # Get all cases
            self.cases_database = cases_module.get_all_cases()
            print(f"Loaded {len(self.cases_database)} cases from database")
            
        except Exception as e:
            print(f"Error loading cases database: {e}")
            # Fallback: create a simple database
            self.cases_database = self._create_fallback_database()
    
    def _create_fallback_database(self):
        """Create a fallback database if the main one fails."""
        return {
            "case_001": {
                "id": "case_001",
                "crime": "The accused stole a mobile phone worth Rs. 25,000 from the victim's bag at a shopping mall.",
                "sections": ["IPC 378", "IPC 379"],
                "penalty": "Imprisonment up to 3 years, or fine, or both",
                "court": "Sessions Court, Mumbai",
                "date": "2023-01-15",
                "accused": "Rajesh Kumar",
                "complainant": "Priya Sharma",
                "outcome": "Guilty - 2 years imprisonment and fine of Rs. 5,000"
            },
            "case_002": {
                "id": "case_002",
                "crime": "The accused committed murder by stabbing the victim multiple times with a knife during a dispute.",
                "sections": ["IPC 300", "IPC 302"],
                "penalty": "Death, or imprisonment for life, and fine",
                "court": "High Court, Delhi",
                "date": "2023-02-20",
                "accused": "Vikram Singh",
                "complainant": "State of Delhi",
                "outcome": "Guilty - Life imprisonment and fine of Rs. 50,000"
            }
        }
    
    def generate_embeddings(self, force_regenerate: bool = False):
        """Generate embeddings for all cases."""
        # Check if embeddings already exist
        if not force_regenerate and os.path.exists(self.embeddings_file) and os.path.exists(self.metadata_file):
            print("Loading existing embeddings...")
            self._load_embeddings()
            return
        
        if not self.cases_database:
            raise ValueError("Cases database not loaded. Call load_cases_database() first.")
        
        print("Generating embeddings for all cases...")
        
        # Prepare texts for embedding
        case_texts = []
        case_metadata = []
        
        for case_id, case_data in self.cases_database.items():
            # Create comprehensive text for embedding
            text = self._create_case_text(case_data)
            case_texts.append(text)
            case_metadata.append(case_data)
        
        # Generate embeddings
        print(f"Generating embeddings for {len(case_texts)} cases...")
        self.case_embeddings = self.model.encode(case_texts)
        self.case_metadata = case_metadata
        
        # Save embeddings and metadata
        self._save_embeddings()
        print("Embeddings generated and saved successfully!")
    
    def _create_case_text(self, case_data: Dict) -> str:
        """Create comprehensive text representation of a case for embedding."""
        # Combine all relevant information
        text_parts = [
            case_data.get("crime", ""),
            " ".join(case_data.get("sections", [])),
            case_data.get("penalty", ""),
            case_data.get("outcome", ""),
            case_data.get("court", ""),
            case_data.get("accused", ""),
            case_data.get("complainant", "")
        ]
        
        return " ".join(filter(None, text_parts))
    
    def _save_embeddings(self):
        """Save embeddings and metadata to disk."""
        with open(self.embeddings_file, 'wb') as f:
            pickle.dump(self.case_embeddings, f)
        
        with open(self.metadata_file, 'wb') as f:
            pickle.dump(self.case_metadata, f)
    
    def _load_embeddings(self):
        """Load embeddings and metadata from disk."""
        with open(self.embeddings_file, 'rb') as f:
            self.case_embeddings = pickle.load(f)
        
        with open(self.metadata_file, 'rb') as f:
            self.case_metadata = pickle.load(f)
    
    def search_similar_cases(self, 
                           query: str, 
                           top_k: int = 10,
                           filter_sections: Optional[List[str]] = None) -> List[Dict]:
        """
        Search for similar cases based on query.
        
        Args:
            query: Case description to search for
            top_k: Number of top results to return
            filter_sections: Optional list of IPC sections to filter by
            
        Returns:
            List of similar cases with similarity scores
        """
        if self.case_embeddings is None:
            raise ValueError("Embeddings not generated. Call generate_embeddings() first.")
        
        # Generate embedding for query
        query_embedding = self.model.encode([query])
        
        # Calculate similarities
        similarities = cosine_similarity(query_embedding, self.case_embeddings)[0]
        
        # Get top-k results
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            similarity_score = similarities[idx]
            case_data = self.case_metadata[idx].copy()
            case_data['similarity_score'] = float(similarity_score)
            
            # Apply section filter if provided
            if filter_sections:
                case_sections = case_data.get("sections", [])
                if not any(section in case_sections for section in filter_sections):
                    continue
            
            results.append(case_data)
        
        return results
    
    def find_precedent_cases(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Find precedent cases (highly similar cases).
        
        Args:
            query: Case description to find precedents for
            top_k: Number of precedent cases to return
            
        Returns:
            List of precedent cases
        """
        similar_cases = self.search_similar_cases(query, top_k=top_k)
        
        # Filter for precedent cases (high similarity)
        precedent_cases = [
            case for case in similar_cases 
            if case['similarity_score'] >= self.precedent_threshold
        ]
        
        return precedent_cases
    
    def find_cases_by_sections(self, sections: List[str], top_k: int = 10) -> List[Dict]:
        """
        Find cases that involve specific IPC sections.
        
        Args:
            sections: List of IPC sections to search for
            top_k: Number of results to return
            
        Returns:
            List of cases involving the specified sections
        """
        if not self.cases_database:
            raise ValueError("Cases database not loaded.")
        
        matching_cases = []
        for case_data in self.cases_database.values():
            case_sections = case_data.get("sections", [])
            if any(section in case_sections for section in sections):
                matching_cases.append(case_data)
        
        # Sort by date (most recent first)
        matching_cases.sort(key=lambda x: x.get("date", ""), reverse=True)
        
        return matching_cases[:top_k]
    
    def comprehensive_search(self, 
                           query: str,
                           target_sections: Optional[List[str]] = None,
                           top_k: int = 10) -> Dict:
        """
        Perform comprehensive search including similar cases, section-based cases, and precedents.
        
        Args:
            query: Case description to search for
            target_sections: Optional IPC sections to focus on
            top_k: Number of results for each category
            
        Returns:
            Dictionary with different types of search results
        """
        results = {
            "query": query,
            "timestamp": datetime.now().isoformat(),
            "similar_cases": [],
            "section_based_cases": [],
            "precedent_cases": [],
            "summary": {}
        }
        
        # 1. Find similar cases
        similar_cases = self.search_similar_cases(query, top_k=top_k)
        results["similar_cases"] = similar_cases
        
        # 2. Find cases by sections (if provided)
        if target_sections:
            section_cases = self.find_cases_by_sections(target_sections, top_k=top_k)
            results["section_based_cases"] = section_cases
        
        # 3. Find precedent cases
        precedent_cases = self.find_precedent_cases(query, top_k=5)
        results["precedent_cases"] = precedent_cases
        
        # 4. Generate summary
        results["summary"] = {
            "total_similar_cases": len(similar_cases),
            "total_section_cases": len(results["section_based_cases"]),
            "total_precedent_cases": len(precedent_cases),
            "highest_similarity": max([case["similarity_score"] for case in similar_cases]) if similar_cases else 0,
            "has_precedent": len(precedent_cases) > 0
        }
        
        return results
    
    def format_search_results(self, results: Dict) -> str:
        """Format search results for display."""
        output = []
        output.append("=" * 80)
        output.append("LEGAL CASE RETRIEVAL RESULTS")
        output.append("=" * 80)
        output.append(f"Query: {results['query']}")
        output.append(f"Search Time: {results['timestamp']}")
        output.append("")
        
        # Summary
        summary = results["summary"]
        output.append("SEARCH SUMMARY:")
        output.append(f"  • Total similar cases found: {summary['total_similar_cases']}")
        output.append(f"  • Total section-based cases: {summary['total_section_cases']}")
        output.append(f"  • Total precedent cases: {summary['total_precedent_cases']}")
        output.append(f"  • Highest similarity score: {summary['highest_similarity']:.3f}")
        output.append(f"  • Has precedent case: {'Yes' if summary['has_precedent'] else 'No'}")
        output.append("")
        
        # Precedent cases (most important)
        if results["precedent_cases"]:
            output.append("🎯 PRECEDENT CASES (Highly Similar):")
            output.append("-" * 50)
            for i, case in enumerate(results["precedent_cases"], 1):
                output.append(f"{i}. {case['id']} (Similarity: {case['similarity_score']:.3f})")
                output.append(f"   Crime: {case['crime'][:100]}...")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append(f"   Outcome: {case['outcome']}")
                output.append("")
        
        # Similar cases
        if results["similar_cases"]:
            output.append("📋 SIMILAR CASES:")
            output.append("-" * 50)
            for i, case in enumerate(results["similar_cases"][:5], 1):
                output.append(f"{i}. {case['id']} (Similarity: {case['similarity_score']:.3f})")
                output.append(f"   Crime: {case['crime'][:100]}...")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append("")
        
        # Section-based cases
        if results["section_based_cases"]:
            output.append("⚖️ SECTION-BASED CASES:")
            output.append("-" * 50)
            for i, case in enumerate(results["section_based_cases"][:3], 1):
                output.append(f"{i}. {case['id']}")
                output.append(f"   Crime: {case['crime'][:100]}...")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append(f"   Court: {case['court']}")
                output.append("")
        
        return "\n".join(output)
    
    def get_database_stats(self) -> Dict:
        """Get statistics about the loaded database."""
        if not self.cases_database:
            return {"error": "Database not loaded"}
        
        total_cases = len(self.cases_database)
        
        # Count by sections
        section_counts = {}
        for case_data in self.cases_database.values():
            for section in case_data.get("sections", []):
                section_counts[section] = section_counts.get(section, 0) + 1
        
        # Date range
        dates = [case_data.get("date", "") for case_data in self.cases_database.values()]
        dates = [d for d in dates if d]
        
        return {
            "total_cases": total_cases,
            "section_distribution": section_counts,
            "date_range": {
                "earliest": min(dates) if dates else "N/A",
                "latest": max(dates) if dates else "N/A"
            },
            "embeddings_generated": self.case_embeddings is not None,
            "model_used": self.model_name
        }

# Example usage and testing
if __name__ == "__main__":
    # Initialize the retrieval system
    retrieval_system = LegalCaseRetrieval()
    
    # Load cases database
    retrieval_system.load_cases_database()
    
    # Generate embeddings
    retrieval_system.generate_embeddings()
    
    # Test search
    test_query = "The accused stole a mobile phone worth Rs. 25,000 from the victim's bag at a shopping mall."
    
    print("Testing Legal Case Retrieval System...")
    print("=" * 50)
    
    # Perform comprehensive search
    results = retrieval_system.comprehensive_search(
        query=test_query,
        target_sections=["IPC 378", "IPC 379"],
        top_k=5
    )
    
    # Display results
    formatted_results = retrieval_system.format_search_results(results)
    print(formatted_results)
    
    # Show database stats
    stats = retrieval_system.get_database_stats()
    print("\nDATABASE STATISTICS:")
    print(f"Total cases: {stats['total_cases']}")
    print(f"Embeddings generated: {stats['embeddings_generated']}")
    print(f"Model used: {stats['model_used']}")
