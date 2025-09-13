"""
Enhanced Demo - Uses the full Legal AI Pipeline with better preprocessing
"""

import re
from crime_classifier import CrimeClassifier
from penalty_estimator import PenaltyEstimator
from ipc_database import get_ipc_section

def extract_crime_keywords_enhanced(text):
    """Enhanced keyword extraction with better pattern matching"""
    text_lower = text.lower()
    keywords = []
    
    # Murder and violence patterns
    murder_patterns = [
        r'\b(?:murder|murdered|killed|killing|shot|shoot|shooting|stab|stabbed|stabbing)\b',
        r'\b(?:slay|slain|homicide|assassinate|execute|death|dead)\b',
        r'\b(?:point blank|close range|fatal|lethal)\b'
    ]
    
    # Assault patterns
    assault_patterns = [
        r'\b(?:assault|assaulted|attack|attacked|hurt|injured|beaten|beat)\b',
        r'\b(?:punch|punched|slap|slapped|hit|hitting|violence|violent)\b'
    ]
    
    # Theft patterns
    theft_patterns = [
        r'\b(?:theft|steal|stole|stolen|robbery|rob|robbed|burglary)\b',
        r'\b(?:pickpocket|shoplifting|snatch|snatched|loot|looted)\b'
    ]
    
    # Fraud patterns
    fraud_patterns = [
        r'\b(?:fraud|cheat|cheated|cheating|scam|deceive|trick|con)\b',
        r'\b(?:fake|forged|counterfeit|embezzle)\b'
    ]
    
    # Check each pattern category
    for pattern in murder_patterns:
        if re.search(pattern, text_lower):
            keywords.extend(['murder', 'killed', 'shot'])
            break
    
    for pattern in assault_patterns:
        if re.search(pattern, text_lower):
            keywords.extend(['assault', 'attack', 'hurt'])
            break
    
    for pattern in theft_patterns:
        if re.search(pattern, text_lower):
            keywords.extend(['theft', 'stole', 'robbery'])
            break
    
    for pattern in fraud_patterns:
        if re.search(pattern, text_lower):
            keywords.extend(['fraud', 'cheat', 'fake'])
            break
    
    # Remove duplicates
    keywords = list(set(keywords))
    
    # If no specific patterns found, try general crime words
    if not keywords:
        general_crimes = ['crime', 'offence', 'criminal', 'illegal']
        for crime in general_crimes:
            if crime in text_lower:
                keywords.append(crime)
    
    return keywords if keywords else ['crime']

def analyze_case_enhanced():
    """Enhanced case analysis with better preprocessing"""
    print("=" * 60)
    print("ENHANCED LEGAL AI PIPELINE DEMO")
    print("=" * 60)
    print("Enter a legal case description and the system will:")
    print("1. Extract crime keywords with enhanced pattern matching")
    print("2. Classify using ensemble method for better accuracy")
    print("3. Map to relevant IPC sections")
    print("4. Estimate penalties with context analysis")
    print()
    
    # Get user input
    print("Enter your case description (or 'quit' to exit):")
    case_text = input("> ")
    
    if case_text.lower() in ['quit', 'exit', 'q']:
        print("Goodbye!")
        return False
    
    if not case_text.strip():
        print("Please enter a valid case description.")
        return True
    
    # Enhanced keyword extraction
    crime_keywords = extract_crime_keywords_enhanced(case_text)
    print(f"\nDetected keywords: {', '.join(crime_keywords)}")
    print("\nAnalyzing case...")
    
    try:
        # Initialize components
        classifier = CrimeClassifier()
        estimator = PenaltyEstimator()
        
        # Classify the crime using ensemble method
        print("\nStep 1: Classifying the crime...")
        classifications = classifier.ensemble_classify(case_text, crime_keywords, top_k=5)
        
        if classifications:
            print(f"✓ Found {len(classifications)} relevant IPC sections:")
            for i, result in enumerate(classifications, 1):
                print(f"  {i}. {result['section_number']} - {result['title']}")
                print(f"     Confidence: {result['confidence_score']:.3f}")
                print(f"     Method: {', '.join(result.get('methods', ['unknown']))}")
            
            # Estimate penalties
            print("\nStep 2: Estimating penalties...")
            context = {
                'text': case_text,
                'crime_keywords': crime_keywords,
                'actions': crime_keywords,
                'entities': {
                    'persons': [],
                    'locations': [],
                    'amounts': [],
                    'dates': []
                }
            }
            
            penalty_summaries = estimator.get_penalty_summary(classifications, context)
            
            if penalty_summaries:
                print("✓ Penalty estimation completed:")
                for i, summary in enumerate(penalty_summaries, 1):
                    print(f"  {i}. {summary['section_number']} - {summary['title']}")
                    print(f"     Penalty: {summary['penalty_text']}")
                    print(f"     Confidence: {summary['penalty_confidence']:.3f}")
                    
                    # Show context factors if any
                    factors = summary.get('context_factors', {})
                    if factors.get('aggravating'):
                        print(f"     Aggravating factors: {', '.join(factors['aggravating'])}")
                    if factors.get('mitigating'):
                        print(f"     Mitigating factors: {', '.join(factors['mitigating'])}")
            
            # Show detailed information for top result
            print(f"\nStep 3: Detailed Information for Top Result:")
            top_section = classifications[0]['section_number']
            section_details = get_ipc_section(top_section)
            if section_details:
                print(f"Section: {section_details['section']}")
                print(f"Title: {section_details['title']}")
                print(f"Description: {section_details['description']}")
                print(f"Penalty: {section_details['penalty']}")
                print(f"Keywords: {', '.join(section_details['keywords'][:15])}...")
        
        else:
            print("✗ No relevant IPC sections found")
            print("Try using more specific legal terms in your description.")
    
    except Exception as e:
        print(f"Error analyzing case: {e}")
        import traceback
        traceback.print_exc()
    
    return True

def show_sample_cases():
    """Show sample cases for reference"""
    print("\n" + "=" * 60)
    print("SAMPLE CASES FOR REFERENCE")
    print("=" * 60)
    
    samples = [
        {
            "title": "Murder Case",
            "description": "The accused shot the victim at point blank range, causing his death."
        },
        {
            "title": "Theft Case",
            "description": "The accused stole a mobile phone worth Rs. 25,000 from the victim's bag at a shopping mall."
        },
        {
            "title": "Assault Case", 
            "description": "The accused punched the complainant in the face during a dispute, causing a black eye and bleeding."
        },
        {
            "title": "Fraud Case",
            "description": "The accused cheated the complainant by showing fake property documents and collecting Rs. 5,00,000 as advance payment."
        },
        {
            "title": "Robbery Case",
            "description": "The accused threatened the victim with a knife and robbed him of his wallet containing Rs. 10,000."
        }
    ]
    
    for i, sample in enumerate(samples, 1):
        print(f"{i}. {sample['title']}:")
        print(f"   {sample['description']}")
        print()

def main():
    """Main interactive loop"""
    print("Welcome to the Enhanced Legal AI Pipeline Demo!")
    print("This version has improved keyword detection and classification accuracy.")
    print()
    
    while True:
        print("\nOptions:")
        print("1. Analyze a case (Enhanced)")
        print("2. Show sample cases")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            if not analyze_case_enhanced():
                break
        elif choice == '2':
            show_sample_cases()
        elif choice == '3':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()
