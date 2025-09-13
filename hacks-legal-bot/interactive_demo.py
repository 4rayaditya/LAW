"""
Interactive Demo - Test the Legal AI Pipeline with your own cases
"""

from crime_classifier import CrimeClassifier
from penalty_estimator import PenaltyEstimator
from ipc_database import get_ipc_section

def analyze_case():
    """Interactive case analysis"""
    print("=" * 60)
    print("LEGAL AI PIPELINE - INTERACTIVE DEMO")
    print("=" * 60)
    print("Enter a legal case description and the system will:")
    print("1. Classify the crime")
    print("2. Map to relevant IPC sections")
    print("3. Estimate penalties")
    print("4. Provide detailed legal information")
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
    
    # Extract basic keywords (enhanced approach)
    crime_keywords = []
    common_crimes = [
        # Murder and violence
        'murder', 'murdered', 'kill', 'killed', 'killing', 'shot', 'shoot', 'shooting',
        'stab', 'stabbed', 'stabbing', 'slay', 'slain', 'homicide', 'death', 'dead',
        'assassinate', 'assassination', 'execute', 'execution',
        
        # Assault and hurt
        'assault', 'assaulted', 'attack', 'attacked', 'attacking', 'hurt', 'injured',
        'beaten', 'beat', 'punch', 'punched', 'slap', 'slapped', 'hit', 'hitting',
        'violence', 'violent', 'battery', 'battered',
        
        # Theft and robbery
        'theft', 'steal', 'stole', 'stolen', 'stealing', 'robbery', 'rob', 'robbed',
        'burglary', 'burgle', 'larceny', 'pickpocket', 'shoplifting', 'snatch', 'snatched',
        'loot', 'looted', 'mug', 'mugged', 'mugging',
        
        # Sexual offenses
        'rape', 'raped', 'sexual assault', 'molest', 'molestation', 'abuse', 'abused',
        'harassment', 'harassed', 'stalking', 'stalked',
        
        # Fraud and cheating
        'fraud', 'fraudulent', 'cheat', 'cheated', 'cheating', 'scam', 'scammed',
        'deceive', 'deceived', 'deception', 'trick', 'tricked', 'con', 'conned',
        'swindle', 'swindled', 'embezzle', 'embezzlement',
        
        # Other crimes
        'extortion', 'blackmail', 'threat', 'threatened', 'threatening', 'intimidate',
        'kidnap', 'kidnapped', 'kidnapping', 'abduct', 'abducted', 'abduction',
        'trespass', 'trespassing', 'defamation', 'slander', 'libel', 'defame',
        'forgery', 'forged', 'fake', 'counterfeit', 'conspiracy', 'conspire',
        'terrorism', 'terrorist', 'bomb', 'explosive', 'weapon', 'gun', 'knife'
    ]
    
    case_lower = case_text.lower()
    for crime in common_crimes:
        if crime in case_lower:
            crime_keywords.append(crime)
    
    # Remove duplicates and sort by relevance
    crime_keywords = list(set(crime_keywords))
    
    if not crime_keywords:
        crime_keywords = ['crime', 'offence']  # Default fallback
    
    print(f"\nInterpreted Keywords: {', '.join(crime_keywords)}")
    print("\nAnalyzing case...")
    
    try:
        # Initialize components
        classifier = CrimeClassifier()
        estimator = PenaltyEstimator()
        
        # Classify the crime
        print("\nStep 1: Classifying the crime...")
        # Use ensemble method for better accuracy
        classifications = classifier.ensemble_classify(case_text, crime_keywords, top_k=5)
        
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
                'actions': crime_keywords,  # Simple mapping
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
    
    return True

def show_sample_cases():
    """Show sample cases for reference"""
    print("\n" + "=" * 60)
    print("SAMPLE CASES FOR REFERENCE")
    print("=" * 60)
    
    samples = [
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
        },
        {
            "title": "Murder Case",
            "description": "The accused stabbed the victim multiple times with a knife, causing his death."
        }
    ]
    
    for i, sample in enumerate(samples, 1):
        print(f"{i}. {sample['title']}:")
        print(f"   {sample['description']}")
        print()

def main():
    """Main interactive loop"""
    print("Welcome to the Legal AI Pipeline Interactive Demo!")
    print()
    
    while True:
        print("\nOptions:")
        print("1. Analyze a case")
        print("2. Show sample cases")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            if not analyze_case():
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
