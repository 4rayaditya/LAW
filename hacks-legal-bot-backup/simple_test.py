"""
Simple Test Script - Tests basic functionality without heavy dependencies
"""

def test_ipc_database():
    """Test IPC database functionality."""
    print("Testing IPC Database...")
    
    try:
        from ipc_database import get_ipc_section, get_all_sections
        
        # Test getting a specific section
        section = get_ipc_section("IPC 378")
        if section:
            print(f"✓ Retrieved IPC 378: {section['title']}")
            print(f"  Keywords: {section['keywords'][:5]}...")  # Show first 5 keywords
        else:
            print("✗ Failed to retrieve IPC 378")
            return False
        
        # Test getting all sections
        all_sections = get_all_sections()
        if len(all_sections) > 0:
            print(f"✓ Retrieved {len(all_sections)} IPC sections")
        else:
            print("✗ No IPC sections found")
            return False
        
        return True
        
    except Exception as e:
        print(f"✗ IPC Database test failed: {e}")
        return False

def test_penalty_estimation():
    """Test penalty estimation functionality."""
    print("\nTesting Penalty Estimation...")
    
    try:
        from penalty_estimator import PenaltyEstimator
        
        estimator = PenaltyEstimator()
        
        # Test penalty parsing
        penalty_text = "Imprisonment up to 3 years, or fine, or both"
        parsed = estimator.parse_penalty_text(penalty_text)
        
        if parsed and 'imprisonment' in parsed:
            print(f"✓ Penalty parsing successful")
            print(f"  Imprisonment: {parsed['imprisonment']}")
        else:
            print("✗ Penalty parsing failed")
            return False
        
        return True
        
    except Exception as e:
        print(f"✗ Penalty estimation test failed: {e}")
        return False

def test_basic_classification():
    """Test basic classification without heavy ML models."""
    print("\nTesting Basic Classification...")
    
    try:
        from crime_classifier import CrimeClassifier
        
        # Test with keyword method (lighter than ensemble)
        classifier = CrimeClassifier()
        
        sample_text = "The accused stole a mobile phone worth Rs. 25,000."
        crime_keywords = ["stole", "stolen", "theft"]
        
        results = classifier.classify_with_keyword_matching(sample_text, crime_keywords, top_k=3)
        
        if results:
            print(f"✓ Classification successful - found {len(results)} matches")
            for i, result in enumerate(results, 1):
                print(f"  {i}. {result['section_number']} - {result['title']} ({result['confidence_score']:.3f})")
        else:
            print("✗ Classification failed")
            return False
        
        return True
        
    except Exception as e:
        print(f"✗ Classification test failed: {e}")
        return False

def test_simple_pipeline():
    """Test a simple pipeline without text preprocessing."""
    print("\nTesting Simple Pipeline...")
    
    try:
        from crime_classifier import CrimeClassifier
        from penalty_estimator import PenaltyEstimator
        
        # Sample case
        sample_text = "The accused committed theft. He stole a mobile phone worth Rs. 25,000."
        crime_keywords = ["theft", "stole", "stolen"]
        
        # Classify
        classifier = CrimeClassifier()
        classifications = classifier.classify_with_keyword_matching(sample_text, crime_keywords, top_k=3)
        
        # Estimate penalties
        estimator = PenaltyEstimator()
        context = {
            'text': sample_text,
            'crime_keywords': crime_keywords,
            'actions': ['stole'],
            'entities': {'amounts': ['25000']}
        }
        
        penalty_summaries = estimator.get_penalty_summary(classifications, context)
        
        if classifications and penalty_summaries:
            print(f"✓ Simple pipeline successful")
            print(f"  Primary crime: {classifications[0]['title']}")
            print(f"  Penalty: {penalty_summaries[0]['penalty_text']}")
        else:
            print("✗ Simple pipeline failed")
            return False
        
        return True
        
    except Exception as e:
        print(f"✗ Simple pipeline test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("LEGAL AI PIPELINE - SIMPLE TEST")
    print("=" * 50)
    
    tests = [
        test_ipc_database,
        test_penalty_estimation,
        test_basic_classification,
        test_simple_pipeline
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"TEST RESULTS: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The system is ready to use.")
        print("\nNext steps:")
        print("1. Run: python demo.py")
        print("2. Or try: python example_usage.py")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")

if __name__ == "__main__":
    main()
