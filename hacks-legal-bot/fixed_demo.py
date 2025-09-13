"""
Fixed Demo - Properly detects murder and other serious crimes
"""

import re
from crime_classifier import CrimeClassifier
from penalty_estimator import PenaltyEstimator
from ipc_database import get_ipc_section

def extract_crime_keywords_fixed(text):
    """Fixed keyword extraction that properly detects murder and serious crimes"""
    text_lower = text.lower()
    keywords = []
    
    # Check for murder first (highest priority)
    murder_indicators = [
        'shot', 'shoot', 'shooting', 'murder', 'murdered', 'killed', 'killing',
        'stab', 'stabbed', 'stabbing', 'slay', 'slain', 'homicide', 'death',
        'dead', 'assassinate', 'execute', 'point blank', 'close range', 'fatal'
    ]
    
    for indicator in murder_indicators:
        if indicator in text_lower:
            keywords.extend(['murder', 'killed', 'shot', 'homicide'])
            break
    
    # Check for assault
    assault_indicators = [
        'assault', 'assaulted', 'attack', 'attacked', 'hurt', 'injured',
        'beaten', 'beat', 'punch', 'punched', 'slap', 'slapped', 'hit', 'hitting'
    ]
    
    for indicator in assault_indicators:
        if indicator in text_lower:
            keywords.extend(['assault', 'attack', 'hurt'])
            break
    
    # Check for theft
    theft_indicators = [
        'theft', 'steal', 'stole', 'stolen', 'robbery', 'rob', 'robbed',
        'burglary', 'pickpocket', 'shoplifting', 'snatch', 'snatched'
    ]
    
    for indicator in theft_indicators:
        if indicator in text_lower:
            keywords.extend(['theft', 'stole', 'robbery'])
            break
    
    # Check for fraud
    fraud_indicators = [
        'fraud', 'cheat', 'cheated', 'cheating', 'scam', 'deceive', 'trick',
        'fake', 'forged', 'counterfeit', 'embezzle'
    ]
    
    for indicator in fraud_indicators:
        if indicator in text_lower:
            keywords.extend(['fraud', 'cheat', 'fake'])
            break
    
    # Remove duplicates and prioritize
    keywords = list(set(keywords))
    
    # If no specific patterns found, try general crime words
    if not keywords:
        if any(word in text_lower for word in ['crime', 'criminal', 'offence', 'illegal']):
            keywords = ['crime']
        else:
            keywords = ['crime']  # Default fallback
    
    return keywords

def analyze_case_fixed():
    """Fixed case analysis that properly handles murder cases"""
    print("=" * 60)
    print("FIXED LEGAL AI PIPELINE DEMO")
    print("=" * 60)
    print("Enter a legal case description and the system will:")
    print("1. Properly detect murder and serious crime keywords")
    print("2. Classify using multiple methods for accuracy")
    print("3. Map to relevant IPC sections")
    print("4. Estimate appropriate penalties")
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
    
    # Fixed keyword extraction
    crime_keywords = extract_crime_keywords_fixed(case_text)
    print(f"\nDetected keywords: {', '.join(crime_keywords)}")
    print("\nAnalyzing case...")
    
    try:
        # Initialize components
        classifier = CrimeClassifier()
        estimator = PenaltyEstimator()
        
        # Try multiple classification methods
        print("\nStep 1: Classifying the crime...")
        
        # Method 1: Keyword matching (fast and reliable for clear cases)
        keyword_results = classifier.classify_with_keyword_matching(case_text, crime_keywords, top_k=5)
        
        # Method 2: Similarity matching (good for semantic understanding)
        similarity_results = classifier.classify_with_similarity(case_text, top_k=5)
        
        # Method 3: Ensemble (combines all methods)
        ensemble_results = classifier.ensemble_classify(case_text, crime_keywords, top_k=5)
        
        # Choose the best results
        if keyword_results and keyword_results[0]['confidence_score'] > 0.3:
            classifications = keyword_results
            method_used = "keyword matching"
        elif similarity_results and similarity_results[0]['confidence_score'] > 0.3:
            classifications = similarity_results
            method_used = "similarity matching"
        else:
            classifications = ensemble_results
            method_used = "ensemble"
        
        print(f"Using {method_used} method")
        
        if classifications:
            print(f"✓ Found {len(classifications)} relevant IPC sections:")
            for i, result in enumerate(classifications, 1):
                print(f"  {i}. {result['section_number']} - {result['title']}")
                print(f"     Confidence: {result['confidence_score']:.3f}")
            
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

def test_your_case():
    """Test the specific case you mentioned"""
    print("=" * 60)
    print("TESTING YOUR SPECIFIC CASE")
    print("=" * 60)
    
    case_text = "the accused shot a man at point blank range for defeating him in clash royale with hog 2.6"
    
    print(f"Case: {case_text}")
    
    # Extract keywords
    crime_keywords = extract_crime_keywords_fixed(case_text)
    print(f"Detected keywords: {', '.join(crime_keywords)}")
    
    # Initialize components
    classifier = CrimeClassifier()
    estimator = PenaltyEstimator()
    
    # Classify
    print("\nClassifying...")
    classifications = classifier.classify_with_keyword_matching(case_text, crime_keywords, top_k=5)
    
    if classifications:
        print(f"✓ Found {len(classifications)} relevant IPC sections:")
        for i, result in enumerate(classifications, 1):
            print(f"  {i}. {result['section_number']} - {result['title']}")
            print(f"     Confidence: {result['confidence_score']:.3f}")
        
        # Show top result details
        top_section = classifications[0]['section_number']
        section_details = get_ipc_section(top_section)
        if section_details:
            print(f"\nTop Result Details:")
            print(f"Section: {section_details['section']}")
            print(f"Title: {section_details['title']}")
            print(f"Description: {section_details['description']}")
            print(f"Penalty: {section_details['penalty']}")
    else:
        print("✗ No relevant IPC sections found")

def main():
    """Main interactive loop"""
    print("Welcome to the Fixed Legal AI Pipeline Demo!")
    print("This version properly detects murder and serious crimes.")
    print()
    
    while True:
        print("\nOptions:")
        print("1. Analyze a case (Fixed)")
        print("2. Test your specific case")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            if not analyze_case_fixed():
                break
        elif choice == '2':
            test_your_case()
        elif choice == '3':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()
