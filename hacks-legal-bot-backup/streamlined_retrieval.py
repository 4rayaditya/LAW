"""
Streamlined Legal Case Retrieval System
Asks for IPC section first, then case description for targeted search.
"""

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Tuple
import pickle
import os

class StreamlinedRetrieval:
    """Streamlined case retrieval system."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """Initialize the retrieval system."""
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        self.case_embeddings = None
        self.case_data = None
        self.embeddings_file = "streamlined_embeddings.pkl"
        
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
    
    def search_by_section(self, section: str) -> List[Dict]:
        """Search cases by specific IPC section."""
        matching_cases = []
        
        for case in self.case_data:
            if section in case['sections']:
                matching_cases.append(case)
        
        return matching_cases
    
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
    
    def targeted_search(self, section: str, case_description: str) -> Dict:
        """Perform targeted search with section first, then similar cases."""
        results = {
            'section': section,
            'case_description': case_description,
            'section_based_cases': [],
            'similar_cases': [],
            'precedent_cases': []
        }
        
        # Step 1: Find cases with the specified section
        print(f"Step 1: Finding cases with section {section}...")
        section_cases = self.search_by_section(section)
        results['section_based_cases'] = section_cases
        
        # Step 2: Find similar cases based on description
        print(f"Step 2: Finding similar cases based on description...")
        similar_cases = self.search_similar_cases(case_description, top_k=10)
        results['similar_cases'] = similar_cases
        
        # Step 3: Find precedent cases
        print(f"Step 3: Finding precedent cases...")
        precedent_cases = self.find_precedent_cases(case_description)
        results['precedent_cases'] = precedent_cases
        
        return results
    
    def format_targeted_results(self, results: Dict) -> str:
        """Format targeted search results for display."""
        output = []
        output.append("=" * 80)
        output.append("TARGETED LEGAL CASE SEARCH RESULTS")
        output.append("=" * 80)
        output.append(f"IPC Section: {results['section']}")
        output.append(f"Case Description: {results['case_description']}")
        output.append("")
        
        # Section-based cases (most relevant)
        if results['section_based_cases']:
            output.append(f"⚖️ CASES WITH SECTION {results['section']}:")
            output.append("-" * 50)
            for i, case in enumerate(results['section_based_cases'][:5], 1):
                output.append(f"{i}. {case['id']}")
                output.append(f"   Crime: {case['crime']}")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append(f"   Penalty: {case['penalty']}")
                output.append("")
        else:
            output.append(f"❌ No cases found with section {results['section']}")
            output.append("")
        
        # Precedent cases (highly similar)
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
        
        return "\n".join(output)
    
    def get_available_sections(self) -> List[str]:
        """Get list of available IPC sections in the database."""
        sections = set()
        for case in self.case_data:
            sections.update(case['sections'])
        return sorted(list(sections))

def interactive_targeted_search():
    """Interactive targeted search with section first."""
    print("STREAMLINED LEGAL CASE RETRIEVAL")
    print("=" * 80)
    
    # Initialize system
    retrieval = StreamlinedRetrieval()
    retrieval.load_database()
    retrieval.generate_embeddings()
    
    print("This system will help you find relevant legal cases.")
    print("First, you'll specify an IPC section, then describe your case.")
    print()
    
    # Get available sections
    available_sections = retrieval.get_available_sections()
    print(f"Available IPC sections in database: {len(available_sections)}")
    print("Common sections: IPC 302, IPC 378, IPC 420, IPC 363, IPC 319, etc.")
    print()
    
    while True:
        try:
            # Step 1: Get IPC section
            print("Step 1: Enter the IPC section you want to search for:")
            print("(Examples: IPC 302, IPC 378, IPC 420, or type 'quit' to exit)")
            section = input("IPC Section: ").strip()
            
            if section.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not section:
                print("Please enter a valid IPC section.")
                continue
            
            # Validate section exists
            if section not in available_sections:
                print(f"Section {section} not found in database.")
                print(f"Available sections include: {', '.join(available_sections[:10])}...")
                continue
            
            # Step 2: Get case description
            print(f"\nStep 2: Enter your case description for section {section}:")
            print("(Describe the crime, incident, or legal situation)")
            case_description = input("Case Description: ").strip()
            
            if not case_description:
                print("Please enter a case description.")
                continue
            
            # Perform targeted search
            print(f"\nSearching for cases with section {section} and similar to your description...")
            print("=" * 80)
            
            results = retrieval.targeted_search(section, case_description)
            formatted_results = retrieval.format_targeted_results(results)
            print(formatted_results)
            
            # Ask if user wants to continue
            print("\n" + "=" * 80)
            continue_search = input("Do you want to search for another case? (y/n): ").strip().lower()
            
            if continue_search in ['n', 'no', 'quit', 'exit']:
                print("Goodbye!")
                break
            elif continue_search in ['y', 'yes', '']:
                print("\n" + "=" * 80)
                continue
            else:
                print("Invalid input. Continuing with new search...")
                print("\n" + "=" * 80)
                continue
                
        except KeyboardInterrupt:
            print("\n\nSearch interrupted. Goodbye!")
            break
        except Exception as e:
            print(f"An error occurred: {e}")
            print("Please try again.")
            continue

def main():
    """Main function."""
    print("STREAMLINED LEGAL CASE RETRIEVAL SYSTEM")
    print("=" * 80)
    print("This system provides targeted legal case search:")
    print("1. First, specify an IPC section")
    print("2. Then, describe your case")
    print("3. Get section-based cases + similar cases + precedents")
    print()
    
    try:
        interactive_targeted_search()
    except KeyboardInterrupt:
        print("\n\nProgram interrupted. Goodbye!")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
