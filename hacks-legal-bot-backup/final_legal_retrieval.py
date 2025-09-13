"""
Final Legal Case Retrieval System
Clean, user-friendly interface with section-first approach.
"""

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List
import pickle
import os

class FinalLegalRetrieval:
    """Final, clean legal case retrieval system."""
    
    def __init__(self):
        """Initialize the system."""
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.case_embeddings = None
        self.case_data = None
        self.embeddings_file = "final_embeddings.pkl"
        
    def load_database(self):
        """Load the cases database."""
        print("Loading legal cases database...")
        
        from cases_database import CASE_DATABASE
        
        self.case_data = []
        for case_id, case_info in CASE_DATABASE.items():
            text = f"{case_info['crime']} {', '.join(case_info['sections'])} {case_info['penalty']}"
            self.case_data.append({
                'id': case_id,
                'crime': case_info['crime'],
                'sections': case_info['sections'],
                'penalty': case_info['penalty'],
                'text': text
            })
        
        print(f"✅ Loaded {len(self.case_data)} legal cases")
    
    def generate_embeddings(self):
        """Generate embeddings for fast search."""
        if os.path.exists(self.embeddings_file):
            print("Loading existing embeddings...")
            with open(self.embeddings_file, 'rb') as f:
                self.case_embeddings = pickle.load(f)
            return
        
        print("Generating embeddings for fast search...")
        texts = [case['text'] for case in self.case_data]
        self.case_embeddings = self.model.encode(texts)
        
        with open(self.embeddings_file, 'wb') as f:
            pickle.dump(self.case_embeddings, f)
        
        print("✅ Embeddings ready!")
    
    def search_by_section(self, section: str) -> List[Dict]:
        """Find cases with specific IPC section."""
        return [case for case in self.case_data if section in case['sections']]
    
    def search_similar(self, query: str, top_k: int = 10) -> List[Dict]:
        """Find similar cases using AI."""
        query_embedding = self.model.encode([query])
        similarities = cosine_similarity(query_embedding, self.case_embeddings)[0]
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            case = self.case_data[idx].copy()
            case['similarity_score'] = float(similarities[idx])
            results.append(case)
        
        return results
    
    def find_precedents(self, query: str) -> List[Dict]:
        """Find precedent cases (highly similar)."""
        similar_cases = self.search_similar(query, top_k=20)
        return [case for case in similar_cases if case['similarity_score'] >= 0.8]
    
    def get_available_sections(self) -> List[str]:
        """Get all available IPC sections."""
        sections = set()
        for case in self.case_data:
            sections.update(case['sections'])
        return sorted(list(sections))
    
    def search(self, section: str, description: str) -> Dict:
        """Perform complete search."""
        return {
            'section': section,
            'description': description,
            'section_cases': self.search_by_section(section),
            'similar_cases': self.search_similar(description, top_k=8),
            'precedents': self.find_precedents(description)
        }
    
    def display_results(self, results: Dict):
        """Display search results in a clean format."""
        print("\n" + "="*80)
        print("🔍 LEGAL CASE SEARCH RESULTS")
        print("="*80)
        print(f"IPC Section: {results['section']}")
        print(f"Case Description: {results['description']}")
        print()
        
        # Section-based cases
        if results['section_cases']:
            print(f"⚖️  CASES WITH SECTION {results['section']} ({len(results['section_cases'])} found):")
            print("-" * 60)
            for i, case in enumerate(results['section_cases'][:5], 1):
                print(f"{i}. {case['id']}")
                print(f"   📝 {case['crime']}")
                print(f"   📋 Sections: {', '.join(case['sections'])}")
                print(f"   ⚖️  Penalty: {case['penalty']}")
                print()
        else:
            print(f"❌ No cases found with section {results['section']}")
            print()
        
        # Precedent cases
        if results['precedents']:
            print(f"🎯 PRECEDENT CASES ({len(results['precedents'])} found):")
            print("-" * 60)
            for i, case in enumerate(results['precedents'], 1):
                print(f"{i}. {case['id']} (Similarity: {case['similarity_score']:.3f})")
                print(f"   📝 {case['crime']}")
                print(f"   📋 Sections: {', '.join(case['sections'])}")
                print()
        
        # Similar cases
        if results['similar_cases']:
            print(f"📋 SIMILAR CASES ({len(results['similar_cases'])} found):")
            print("-" * 60)
            for i, case in enumerate(results['similar_cases'][:5], 1):
                print(f"{i}. {case['id']} (Similarity: {case['similarity_score']:.3f})")
                print(f"   📝 {case['crime']}")
                print(f"   📋 Sections: {', '.join(case['sections'])}")
                print()

def main():
    """Main interactive function."""
    print("🏛️  LEGAL CASE RETRIEVAL SYSTEM")
    print("="*80)
    print("Find relevant legal cases from our database of 500+ cases")
    print("Step 1: Enter IPC section (e.g., IPC 302, IPC 378)")
    print("Step 2: Describe your case")
    print("Step 3: Get section-based cases + similar cases + precedents")
    print()
    
    # Initialize system
    system = FinalLegalRetrieval()
    system.load_database()
    system.generate_embeddings()
    
    # Show available sections
    sections = system.get_available_sections()
    print(f"📊 Database contains {len(sections)} different IPC sections")
    print("💡 Common sections: IPC 302, IPC 378, IPC 420, IPC 363, IPC 319")
    print()
    
    while True:
        try:
            # Get IPC section
            print("Step 1: Enter IPC section")
            section = input("IPC Section: ").strip()
            
            if section.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            if not section:
                print("❌ Please enter a valid IPC section")
                continue
            
            if section not in sections:
                print(f"❌ Section {section} not found in database")
                print(f"💡 Try: {', '.join(sections[:5])}...")
                continue
            
            # Get case description
            print(f"\nStep 2: Describe your case for section {section}")
            description = input("Case Description: ").strip()
            
            if not description:
                print("❌ Please enter a case description")
                continue
            
            # Perform search
            print(f"\n🔍 Searching for cases with section {section}...")
            results = system.search(section, description)
            system.display_results(results)
            
            # Ask to continue
            print("="*80)
            continue_choice = input("Search another case? (y/n): ").strip().lower()
            
            if continue_choice in ['n', 'no']:
                print("👋 Goodbye!")
                break
            else:
                print("\n" + "="*80)
                continue
                
        except KeyboardInterrupt:
            print("\n\n👋 Search interrupted. Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            print("Please try again.")
            continue

if __name__ == "__main__":
    main()
