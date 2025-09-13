"""
Simple Legal Case Retrieval System
Works with the existing cases_database.py without modifying it.
"""

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Tuple
import pickle
import os

class SimpleCaseRetrieval:
    """Simple case retrieval system for the existing database."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """Initialize the retrieval system."""
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        self.case_embeddings = None
        self.case_data = None
        self.embeddings_file = "simple_case_embeddings.pkl"
        
    def load_database(self):
        """Load the existing cases database."""
        print("Loading existing cases database...")
        
        # Import the existing database
        from cases_database import CASE_DATABASE
        
        self.case_data = []
        for case_id, case_info in CASE_DATABASE.items():
            # Create text representation for embedding
            text = f"{case_info['crime']} {', '.join(case_info['sections'])} {case_info['penalty']}"
            
            self.case_data.append({
                'id': case_id,
                'crime': case_info['crime'],
                'sections': case_info['sections'],
                'penalty': case_info['penalty'],
                'text': text
            })
        
        print(f"Loaded {len(self.case_data)} cases from database")
    
    def generate_embeddings(self, force_regenerate: bool = False):
        """Generate embeddings for all cases."""
        # Check if embeddings already exist
        if not force_regenerate and os.path.exists(self.embeddings_file):
            print("Loading existing embeddings...")
            with open(self.embeddings_file, 'rb') as f:
                self.case_embeddings = pickle.load(f)
            return
        
        if not self.case_data:
            raise ValueError("Database not loaded. Call load_database() first.")
        
        print("Generating embeddings...")
        
        # Extract texts for embedding
        texts = [case['text'] for case in self.case_data]
        
        # Generate embeddings
        self.case_embeddings = self.model.encode(texts)
        
        # Save embeddings
        with open(self.embeddings_file, 'wb') as f:
            pickle.dump(self.case_embeddings, f)
        
        print("Embeddings generated and saved!")
    
    def search_similar_cases(self, query: str, top_k: int = 10) -> List[Dict]:
        """Search for similar cases."""
        if self.case_embeddings is None:
            raise ValueError("Embeddings not generated. Call generate_embeddings() first.")
        
        # Generate query embedding
        query_embedding = self.model.encode([query])
        
        # Calculate similarities
        similarities = cosine_similarity(query_embedding, self.case_embeddings)[0]
        
        # Get top-k results
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            case = self.case_data[idx].copy()
            case['similarity_score'] = float(similarities[idx])
            results.append(case)
        
        return results
    
    def find_precedent_cases(self, query: str, threshold: float = 0.8) -> List[Dict]:
        """Find precedent cases (highly similar)."""
        similar_cases = self.search_similar_cases(query, top_k=20)
        
        # Filter for precedent cases
        precedent_cases = [
            case for case in similar_cases 
            if case['similarity_score'] >= threshold
        ]
        
        return precedent_cases
    
    def search_by_sections(self, sections: List[str]) -> List[Dict]:
        """Search cases by IPC sections."""
        matching_cases = []
        
        for case in self.case_data:
            case_sections = case['sections']
            if any(section in case_sections for section in sections):
                matching_cases.append(case)
        
        return matching_cases
    
    def search_by_keyword(self, keyword: str) -> List[Dict]:
        """Search cases by keyword in crime description."""
        matching_cases = []
        keyword_lower = keyword.lower()
        
        for case in self.case_data:
            if keyword_lower in case['crime'].lower():
                matching_cases.append(case)
        
        return matching_cases
    
    def comprehensive_search(self, query: str, target_sections: List[str] = None) -> Dict:
        """Perform comprehensive search."""
        results = {
            'query': query,
            'similar_cases': self.search_similar_cases(query, top_k=10),
            'precedent_cases': self.find_precedent_cases(query),
            'section_based_cases': [],
            'keyword_matches': []
        }
        
        # Section-based search if sections provided
        if target_sections:
            results['section_based_cases'] = self.search_by_sections(target_sections)
        
        # Extract keywords from query for keyword search
        keywords = ['murder', 'theft', 'fraud', 'assault', 'robbery', 'kidnapping']
        for keyword in keywords:
            if keyword in query.lower():
                results['keyword_matches'] = self.search_by_keyword(keyword)
                break
        
        return results
    
    def format_results(self, results: Dict) -> str:
        """Format search results for display."""
        output = []
        output.append("=" * 80)
        output.append("LEGAL CASE SEARCH RESULTS")
        output.append("=" * 80)
        output.append(f"Query: {results['query']}")
        output.append("")
        
        # Precedent cases
        if results['precedent_cases']:
            output.append("🎯 PRECEDENT CASES (Highly Similar):")
            output.append("-" * 50)
            for i, case in enumerate(results['precedent_cases'], 1):
                output.append(f"{i}. {case['id']} (Similarity: {case['similarity_score']:.3f})")
                output.append(f"   Crime: {case['crime']}")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append(f"   Penalty: {case['penalty']}")
                output.append("")
        
        # Similar cases
        if results['similar_cases']:
            output.append("📋 SIMILAR CASES:")
            output.append("-" * 50)
            for i, case in enumerate(results['similar_cases'][:5], 1):
                output.append(f"{i}. {case['id']} (Similarity: {case['similarity_score']:.3f})")
                output.append(f"   Crime: {case['crime']}")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append("")
        
        # Section-based cases
        if results['section_based_cases']:
            output.append("⚖️ SECTION-BASED CASES:")
            output.append("-" * 50)
            for i, case in enumerate(results['section_based_cases'][:3], 1):
                output.append(f"{i}. {case['id']}")
                output.append(f"   Crime: {case['crime']}")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append("")
        
        return "\n".join(output)

def demo_simple_retrieval():
    """Demo the simple retrieval system."""
    print("SIMPLE LEGAL CASE RETRIEVAL DEMO")
    print("=" * 80)
    
    # Initialize system
    retrieval = SimpleCaseRetrieval()
    retrieval.load_database()
    retrieval.generate_embeddings()
    
    # Test queries
    test_queries = [
        "The accused stabbed the victim multiple times causing death",
        "The accused stole a mobile phone from the victim",
        "The accused cheated people using fake documents",
        "The accused kidnapped a child from his home"
    ]
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n{'='*60}")
        print(f"TEST QUERY {i}")
        print(f"{'='*60}")
        
        # Perform search
        results = retrieval.comprehensive_search(query)
        
        # Display results
        formatted_results = retrieval.format_results(results)
        print(formatted_results)

def interactive_search():
    """Interactive search demo."""
    print("INTERACTIVE CASE SEARCH")
    print("=" * 80)
    
    # Initialize system
    retrieval = SimpleCaseRetrieval()
    retrieval.load_database()
    retrieval.generate_embeddings()
    
    print("Enter your case description to search for similar cases:")
    print("(Type 'quit' to exit)")
    
    while True:
        query = input("\n> ").strip()
        
        if query.lower() in ['quit', 'exit', 'q']:
            print("Goodbye!")
            break
        
        if not query:
            print("Please enter a case description.")
            continue
        
        print(f"\nSearching for: {query}")
        print("=" * 60)
        
        # Perform search
        results = retrieval.comprehensive_search(query)
        
        # Display results
        formatted_results = retrieval.format_results(results)
        print(formatted_results)

if __name__ == "__main__":
    print("Choose an option:")
    print("1. Demo with sample queries")
    print("2. Interactive search")
    
    choice = input("Enter choice (1-2): ").strip()
    
    if choice == '1':
        demo_simple_retrieval()
    elif choice == '2':
        interactive_search()
    else:
        print("Invalid choice")
