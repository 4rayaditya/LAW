"""
Demo Script for Legal Case Retrieval System
Shows how to use the system to find relevant and precedent cases.
"""

from legal_case_retrieval import LegalCaseRetrieval

def demo_basic_search():
    """Demo basic case search functionality."""
    print("=" * 80)
    print("LEGAL CASE RETRIEVAL SYSTEM - BASIC DEMO")
    print("=" * 80)
    
    # Initialize the retrieval system
    print("Initializing Legal Case Retrieval System...")
    retrieval_system = LegalCaseRetrieval()
    
    # Load cases database
    print("Loading cases database...")
    retrieval_system.load_cases_database()
    
    # Generate embeddings
    print("Generating embeddings...")
    retrieval_system.generate_embeddings()
    
    # Test queries
    test_queries = [
        "The accused stole a mobile phone worth Rs. 25,000 from the victim's bag at a shopping mall.",
        "The accused committed murder by stabbing the victim multiple times with a knife during a dispute.",
        "The accused assaulted the complainant by punching him in the face, causing a black eye.",
        "The accused committed fraud by showing fake property documents and collecting money."
    ]
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n{'='*60}")
        print(f"TEST QUERY {i}")
        print(f"{'='*60}")
        print(f"Query: {query}")
        
        # Perform comprehensive search
        results = retrieval_system.comprehensive_search(
            query=query,
            top_k=5
        )
        
        # Display results
        formatted_results = retrieval_system.format_search_results(results)
        print(formatted_results)

def demo_precedent_search():
    """Demo precedent case search."""
    print("\n" + "=" * 80)
    print("PRECEDENT CASE SEARCH DEMO")
    print("=" * 80)
    
    # Initialize system
    retrieval_system = LegalCaseRetrieval()
    retrieval_system.load_cases_database()
    retrieval_system.generate_embeddings()
    
    # Test precedent search
    query = "The accused stole a mobile phone worth Rs. 25,000 from the victim's bag at a shopping mall in Mumbai."
    
    print(f"Query: {query}")
    print("\nSearching for precedent cases...")
    
    # Find precedent cases
    precedent_cases = retrieval_system.find_precedent_cases(query, top_k=3)
    
    if precedent_cases:
        print(f"\n🎯 Found {len(precedent_cases)} precedent cases:")
        for i, case in enumerate(precedent_cases, 1):
            print(f"\n{i}. {case['id']} (Similarity: {case['similarity_score']:.3f})")
            print(f"   Crime: {case['crime']}")
            print(f"   Sections: {', '.join(case['sections'])}")
            print(f"   Outcome: {case['outcome']}")
    else:
        print("No precedent cases found (similarity < 0.85)")

def demo_section_based_search():
    """Demo section-based case search."""
    print("\n" + "=" * 80)
    print("SECTION-BASED CASE SEARCH DEMO")
    print("=" * 80)
    
    # Initialize system
    retrieval_system = LegalCaseRetrieval()
    retrieval_system.load_cases_database()
    
    # Test section-based search
    sections = ["IPC 378", "IPC 300", "IPC 415"]
    
    for section in sections:
        print(f"\nSearching for cases involving {section}...")
        section_cases = retrieval_system.find_cases_by_sections([section], top_k=3)
        
        if section_cases:
            print(f"Found {len(section_cases)} cases:")
            for i, case in enumerate(section_cases, 1):
                print(f"  {i}. {case['id']} - {case['crime'][:80]}...")
        else:
            print(f"No cases found for {section}")

def demo_interactive_search():
    """Interactive search demo."""
    print("\n" + "=" * 80)
    print("INTERACTIVE CASE SEARCH")
    print("=" * 80)
    
    # Initialize system
    retrieval_system = LegalCaseRetrieval()
    retrieval_system.load_cases_database()
    retrieval_system.generate_embeddings()
    
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
        results = retrieval_system.comprehensive_search(query, top_k=5)
        
        # Display results
        formatted_results = retrieval_system.format_search_results(results)
        print(formatted_results)

def show_database_stats():
    """Show database statistics."""
    print("\n" + "=" * 80)
    print("DATABASE STATISTICS")
    print("=" * 80)
    
    retrieval_system = LegalCaseRetrieval()
    retrieval_system.load_cases_database()
    
    stats = retrieval_system.get_database_stats()
    
    print(f"Total cases: {stats['total_cases']}")
    print(f"Date range: {stats['date_range']['earliest']} to {stats['date_range']['latest']}")
    print(f"Embeddings generated: {stats['embeddings_generated']}")
    print(f"Model used: {stats['model_used']}")
    
    print("\nSection distribution:")
    for section, count in sorted(stats['section_distribution'].items()):
        print(f"  {section}: {count} cases")

def main():
    """Main demo function."""
    print("LEGAL CASE RETRIEVAL SYSTEM - COMPREHENSIVE DEMO")
    print("=" * 80)
    
    while True:
        print("\nChoose a demo:")
        print("1. Basic Search Demo")
        print("2. Precedent Search Demo")
        print("3. Section-based Search Demo")
        print("4. Interactive Search")
        print("5. Database Statistics")
        print("6. Exit")
        
        choice = input("\nEnter your choice (1-6): ").strip()
        
        if choice == '1':
            demo_basic_search()
        elif choice == '2':
            demo_precedent_search()
        elif choice == '3':
            demo_section_based_search()
        elif choice == '4':
            demo_interactive_search()
        elif choice == '5':
            show_database_stats()
        elif choice == '6':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1-6.")

if __name__ == "__main__":
    main()
