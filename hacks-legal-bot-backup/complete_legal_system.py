"""
Complete Legal AI System
Combines IPC classification with case retrieval using your existing database.
"""

from legal_ai_pipeline import LegalAIPipeline
from simple_case_retrieval import SimpleCaseRetrieval
from typing import Dict, List, Optional

class CompleteLegalSystem:
    """Complete legal system combining IPC classification and case retrieval."""
    
    def __init__(self):
        """Initialize the complete legal system."""
        print("Initializing Complete Legal AI System...")
        
        # Initialize IPC classification pipeline
        self.ipc_pipeline = LegalAIPipeline(
            classification_method="ensemble",
            top_k_sections=5
        )
        
        # Initialize case retrieval system
        self.retrieval_system = SimpleCaseRetrieval()
        self.retrieval_system.load_database()
        self.retrieval_system.generate_embeddings()
        
        print("System initialized successfully!")
    
    def analyze_case_complete(self, case_description: str) -> Dict:
        """
        Perform complete legal analysis including IPC classification and case retrieval.
        
        Args:
            case_description: Description of the legal case
            
        Returns:
            Complete analysis results
        """
        print(f"Analyzing case: {case_description[:100]}...")
        
        # Step 1: IPC Classification
        print("Step 1: Classifying IPC sections...")
        ipc_results = self.ipc_pipeline.process_transcript(
            transcript_text=case_description
        )
        
        # Extract IPC sections for case retrieval
        ipc_sections = []
        if ipc_results and 'case_analysis' in ipc_results:
            ipc_sections = [section['section'] for section in ipc_results['case_analysis']['ipc_sections']]
        
        # Step 2: Case Retrieval
        print("Step 2: Retrieving similar cases...")
        retrieval_results = self.retrieval_system.comprehensive_search(
            query=case_description,
            target_sections=ipc_sections
        )
        
        # Step 3: Combine Results
        complete_results = {
            "case_description": case_description,
            "ipc_analysis": ipc_results,
            "case_retrieval": retrieval_results,
            "summary": {
                "primary_crime": ipc_results.get('case_analysis', {}).get('primary_crime_classification'),
                "ipc_sections": ipc_sections,
                "similar_cases_found": len(retrieval_results['similar_cases']),
                "precedent_cases_found": len(retrieval_results['precedent_cases']),
                "has_precedent": len(retrieval_results['precedent_cases']) > 0,
                "confidence_score": ipc_results.get('case_analysis', {}).get('confidence_score', 0)
            }
        }
        
        return complete_results
    
    def format_complete_results(self, results: Dict) -> str:
        """Format complete analysis results for display."""
        output = []
        output.append("=" * 100)
        output.append("COMPLETE LEGAL CASE ANALYSIS")
        output.append("=" * 100)
        output.append(f"Case Description: {results['case_description']}")
        output.append("")
        
        # Summary
        summary = results['summary']
        output.append("ANALYSIS SUMMARY:")
        output.append(f"  • Primary Crime: {summary['primary_crime']}")
        output.append(f"  • IPC Sections: {', '.join(summary['ipc_sections'])}")
        output.append(f"  • Confidence Score: {summary['confidence_score']:.3f}")
        output.append(f"  • Similar Cases Found: {summary['similar_cases_found']}")
        output.append(f"  • Precedent Cases Found: {summary['precedent_cases_found']}")
        output.append(f"  • Has Precedent: {'Yes' if summary['has_precedent'] else 'No'}")
        output.append("")
        
        # IPC Analysis
        ipc_analysis = results['ipc_analysis']
        if ipc_analysis and 'case_analysis' in ipc_analysis:
            output.append("IPC SECTION ANALYSIS:")
            output.append("-" * 50)
            for i, section in enumerate(ipc_analysis['case_analysis']['ipc_sections'], 1):
                output.append(f"{i}. {section['section']} - {section['title']}")
                output.append(f"   Description: {section['description'][:100]}...")
                output.append(f"   Penalty: {section['penalty']}")
                output.append(f"   Confidence: {section['confidence_score']:.3f}")
                output.append("")
        
        # Case Retrieval Results
        retrieval = results['case_retrieval']
        
        # Precedent cases (most important)
        if retrieval['precedent_cases']:
            output.append("🎯 PRECEDENT CASES (Highly Similar):")
            output.append("-" * 50)
            for i, case in enumerate(retrieval['precedent_cases'], 1):
                output.append(f"{i}. {case['id']} (Similarity: {case['similarity_score']:.3f})")
                output.append(f"   Crime: {case['crime']}")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append(f"   Penalty: {case['penalty']}")
                output.append("")
        
        # Similar cases
        if retrieval['similar_cases']:
            output.append("📋 SIMILAR CASES:")
            output.append("-" * 50)
            for i, case in enumerate(retrieval['similar_cases'][:5], 1):
                output.append(f"{i}. {case['id']} (Similarity: {case['similarity_score']:.3f})")
                output.append(f"   Crime: {case['crime']}")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append("")
        
        # Section-based cases
        if retrieval['section_based_cases']:
            output.append("⚖️ SECTION-BASED CASES:")
            output.append("-" * 50)
            for i, case in enumerate(retrieval['section_based_cases'][:3], 1):
                output.append(f"{i}. {case['id']}")
                output.append(f"   Crime: {case['crime']}")
                output.append(f"   Sections: {', '.join(case['sections'])}")
                output.append("")
        
        return "\n".join(output)
    
    def quick_analysis(self, case_description: str) -> str:
        """Perform quick analysis and return formatted results."""
        results = self.analyze_case_complete(case_description)
        return self.format_complete_results(results)

def demo_complete_system():
    """Demo the complete legal system."""
    print("COMPLETE LEGAL AI SYSTEM DEMO")
    print("=" * 100)
    
    # Initialize system
    legal_system = CompleteLegalSystem()
    
    # Test cases
    test_cases = [
        "The accused stabbed the victim multiple times causing death",
        "The accused stole a mobile phone worth Rs. 25,000 from the victim's bag",
        "The accused cheated people using fake property documents",
        "The accused kidnapped a child from his home"
    ]
    
    for i, case in enumerate(test_cases, 1):
        print(f"\n{'='*100}")
        print(f"TEST CASE {i}")
        print(f"{'='*100}")
        
        # Perform complete analysis
        results = legal_system.quick_analysis(case)
        print(results)
        
        if i < len(test_cases):
            input("\nPress Enter to continue to next case...")

def interactive_complete_analysis():
    """Interactive complete case analysis."""
    print("INTERACTIVE COMPLETE LEGAL ANALYSIS")
    print("=" * 100)
    
    # Initialize system
    legal_system = CompleteLegalSystem()
    
    print("Enter your case description for complete legal analysis:")
    print("(Type 'quit' to exit)")
    
    while True:
        case_description = input("\n> ").strip()
        
        if case_description.lower() in ['quit', 'exit', 'q']:
            print("Goodbye!")
            break
        
        if not case_description:
            print("Please enter a case description.")
            continue
        
        print(f"\nAnalyzing: {case_description}")
        print("=" * 100)
        
        # Perform complete analysis
        results = legal_system.quick_analysis(case_description)
        print(results)

def main():
    """Main function."""
    print("COMPLETE LEGAL AI SYSTEM")
    print("=" * 100)
    print("This system provides:")
    print("• IPC Section Classification")
    print("• Legal Case Retrieval from your 500-case database")
    print("• Precedent Case Identification")
    print("• Comprehensive Legal Analysis")
    print()
    
    while True:
        print("Choose an option:")
        print("1. Demo with sample cases")
        print("2. Interactive complete analysis")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            demo_complete_system()
        elif choice == '2':
            interactive_complete_analysis()
        elif choice == '3':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1-3.")

if __name__ == "__main__":
    main()
