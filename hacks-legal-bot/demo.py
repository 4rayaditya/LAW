"""
Demo Script for Legal AI Pipeline
Simple demonstration of the system functionality.
"""

from crime_classifier import CrimeClassifier
from penalty_estimator import PenaltyEstimator
from ipc_database import get_ipc_section

def demo_theft_case():
    """Demo: Theft case analysis"""
    print("=" * 60)
    print("DEMO: THEFT CASE ANALYSIS")
    print("=" * 60)
    
    # Sample theft case
    case_text = """
    The accused, Mr. Rajesh Kumar, was charged with theft.
    On 15th January, 2023, he stole a mobile phone worth Rs. 25,000 
    from the complainant's shop in Mumbai. The stolen phone was 
    recovered from his possession. He has no previous criminal record.
    """
    
    crime_keywords = ["theft", "stole", "stolen", "mobile phone"]
    
    # Initialize components
    classifier = CrimeClassifier()
    estimator = PenaltyEstimator()
    
    # Classify the crime
    print("Step 1: Classifying the crime...")
    classifications = classifier.classify_with_keyword_matching(case_text, crime_keywords, top_k=3)
    
    if classifications:
        print(f"✓ Found {len(classifications)} relevant IPC sections:")
        for i, result in enumerate(classifications, 1):
            print(f"  {i}. {result['section_number']} - {result['title']}")
            print(f"     Confidence: {result['confidence_score']:.3f}")
        print()
        
        # Estimate penalties
        print("Step 2: Estimating penalties...")
        context = {
            'text': case_text,
            'crime_keywords': crime_keywords,
            'actions': ['stole'],
            'entities': {'amounts': ['25000']}
        }
        
        penalty_summaries = estimator.get_penalty_summary(classifications, context)
        
        if penalty_summaries:
            print("✓ Penalty estimation completed:")
            for i, summary in enumerate(penalty_summaries, 1):
                print(f"  {i}. {summary['section_number']} - {summary['title']}")
                print(f"     Penalty: {summary['penalty_text']}")
                print(f"     Confidence: {summary['penalty_confidence']:.3f}")
                print()
        
        # Show detailed IPC section
        print("Step 3: Detailed IPC Section Information:")
        top_section = classifications[0]['section_number']
        section_details = get_ipc_section(top_section)
        if section_details:
            print(f"Section: {section_details['section']}")
            print(f"Title: {section_details['title']}")
            print(f"Description: {section_details['description']}")
            print(f"Penalty: {section_details['penalty']}")
            print(f"Keywords: {', '.join(section_details['keywords'][:10])}...")
    
    else:
        print("✗ No relevant IPC sections found")

def demo_assault_case():
    """Demo: Assault case analysis"""
    print("\n" + "=" * 60)
    print("DEMO: ASSAULT CASE ANALYSIS")
    print("=" * 60)
    
    # Sample assault case
    case_text = """
    The accused, Mr. Vikram Singh, was charged with assault.
    He punched the complainant in the face during a dispute over parking.
    The complainant suffered a black eye and bleeding from the nose.
    Medical examination confirmed the injuries were not serious.
    """
    
    crime_keywords = ["assault", "punched", "injured", "hurt", "black eye"]
    
    # Initialize components
    classifier = CrimeClassifier()
    estimator = PenaltyEstimator()
    
    # Classify the crime
    print("Step 1: Classifying the crime...")
    classifications = classifier.classify_with_keyword_matching(case_text, crime_keywords, top_k=3)
    
    if classifications:
        print(f"✓ Found {len(classifications)} relevant IPC sections:")
        for i, result in enumerate(classifications, 1):
            print(f"  {i}. {result['section_number']} - {result['title']}")
            print(f"     Confidence: {result['confidence_score']:.3f}")
        print()
        
        # Estimate penalties
        print("Step 2: Estimating penalties...")
        context = {
            'text': case_text,
            'crime_keywords': crime_keywords,
            'actions': ['punched'],
            'entities': {}
        }
        
        penalty_summaries = estimator.get_penalty_summary(classifications, context)
        
        if penalty_summaries:
            print("✓ Penalty estimation completed:")
            for i, summary in enumerate(penalty_summaries, 1):
                print(f"  {i}. {summary['section_number']} - {summary['title']}")
                print(f"     Penalty: {summary['penalty_text']}")
                print(f"     Confidence: {summary['penalty_confidence']:.3f}")
    
    else:
        print("✗ No relevant IPC sections found")

def demo_fraud_case():
    """Demo: Fraud case analysis"""
    print("\n" + "=" * 60)
    print("DEMO: FRAUD CASE ANALYSIS")
    print("=" * 60)
    
    # Sample fraud case
    case_text = """
    The accused, Ms. Priya Sharma, was charged with cheating.
    She approached the complainant claiming to be a real estate agent
    and showed fake property documents. She collected Rs. 5,00,000 as 
    advance payment. Later, it was discovered that the documents were forged.
    """
    
    crime_keywords = ["cheating", "fraud", "fake documents", "forged", "scam"]
    
    # Initialize components
    classifier = CrimeClassifier()
    estimator = PenaltyEstimator()
    
    # Classify the crime
    print("Step 1: Classifying the crime...")
    classifications = classifier.classify_with_keyword_matching(case_text, crime_keywords, top_k=3)
    
    if classifications:
        print(f"✓ Found {len(classifications)} relevant IPC sections:")
        for i, result in enumerate(classifications, 1):
            print(f"  {i}. {result['section_number']} - {result['title']}")
            print(f"     Confidence: {result['confidence_score']:.3f}")
        print()
        
        # Estimate penalties
        print("Step 2: Estimating penalties...")
        context = {
            'text': case_text,
            'crime_keywords': crime_keywords,
            'actions': ['cheated', 'forged'],
            'entities': {'amounts': ['500000']}
        }
        
        penalty_summaries = estimator.get_penalty_summary(classifications, context)
        
        if penalty_summaries:
            print("✓ Penalty estimation completed:")
            for i, summary in enumerate(penalty_summaries, 1):
                print(f"  {i}. {summary['section_number']} - {summary['title']}")
                print(f"     Penalty: {summary['penalty_text']}")
                print(f"     Confidence: {summary['penalty_confidence']:.3f}")
    
    else:
        print("✗ No relevant IPC sections found")

def demo_ipc_search():
    """Demo: IPC section search functionality"""
    print("\n" + "=" * 60)
    print("DEMO: IPC SECTION SEARCH")
    print("=" * 60)
    
    from ipc_database import search_sections_by_keyword, get_sections_by_category
    
    # Search by keyword
    print("Searching for 'theft' related sections:")
    theft_sections = search_sections_by_keyword("theft")
    for section in theft_sections[:3]:  # Show first 3
        print(f"  - {section['section']}: {section['title']}")
    
    print("\nSearching for 'murder' related sections:")
    murder_sections = search_sections_by_keyword("murder")
    for section in murder_sections[:3]:  # Show first 3
        print(f"  - {section['section']}: {section['title']}")
    
    # Show categories
    print("\nAvailable crime categories:")
    categories = get_sections_by_category()
    for category, sections in list(categories.items())[:5]:  # Show first 5 categories
        print(f"  - {category}: {len(sections)} sections")

def main():
    """Run all demos"""
    print("LEGAL AI PIPELINE - DEMONSTRATION")
    print("=" * 60)
    print("This demo shows how the system processes different types of legal cases")
    print("and maps them to relevant IPC sections with penalty estimation.")
    print()
    
    try:
        # Run demos
        demo_theft_case()
        demo_assault_case()
        demo_fraud_case()
        demo_ipc_search()
        
        print("\n" + "=" * 60)
        print("DEMO COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("\nThe system successfully:")
        print("✓ Classified different types of crimes")
        print("✓ Mapped them to relevant IPC sections")
        print("✓ Estimated appropriate penalties")
        print("✓ Provided detailed legal information")
        
        print("\nTo run more examples:")
        print("python example_usage.py")
        
    except Exception as e:
        print(f"\nError during demo: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
