"""
Quick Test Script for Legal AI Pipeline
Tests the basic functionality of the system.
"""

def test_imports():
    """Test if all modules can be imported successfully."""
    print("Testing imports...")
    
    try:
        from ipc_database import IPC_DATABASE, get_ipc_section
        print("✓ IPC Database imported successfully")
        
        from text_preprocessor import LegalTextPreprocessor
        print("✓ Text Preprocessor imported successfully")
        
        from crime_classifier import CrimeClassifier
        print("✓ Crime Classifier imported successfully")
        
        from penalty_estimator import PenaltyEstimator
        print("✓ Penalty Estimator imported successfully")
        
        from legal_ai_pipeline import LegalAIPipeline
        print("✓ Legal AI Pipeline imported successfully")
        
        return True
        
    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False

def test_ipc_database():
    """Test IPC database functionality."""
    print("\nTesting IPC Database...")
    
    try:
        from ipc_database import get_ipc_section, get_all_sections
        
        # Test getting a specific section
        section = get_ipc_section("IPC 378")
        if section:
            print(f"✓ Retrieved IPC 378: {section['title']}")
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

def test_text_preprocessing():
    """Test text preprocessing functionality."""
    print("\nTesting Text Preprocessing...")
    
    try:
        from text_preprocessor import LegalTextPreprocessor
        
        preprocessor = LegalTextPreprocessor()
        
        sample_text = """
        Case No: Crl. Appeal No. 123/2023
        The accused stole a mobile phone worth Rs. 25,000 from the victim.
        The theft occurred on 15th January, 2023 in Mumbai.
        """
        
        result = preprocessor.preprocess(sample_text)
        
        if result and 'crime_keywords' in result:
            print(f"✓ Preprocessing successful - found {len(result['crime_keywords'])} crime keywords")
            print(f"  Keywords: {result['crime_keywords']}")
        else:
            print("✗ Preprocessing failed")
            return False
        
        return True
        
    except Exception as e:
        print(f"✗ Text preprocessing test failed: {e}")
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

def test_basic_pipeline():
    """Test basic pipeline functionality (without heavy ML models)."""
    print("\nTesting Basic Pipeline...")
    
    try:
        from legal_ai_pipeline import LegalAIPipeline
        
        # Test with keyword method (lighter than ensemble)
        pipeline = LegalAIPipeline(classification_method="keyword", top_k_sections=3)
        
        sample_transcript = """
        The accused committed theft. He stole a mobile phone worth Rs. 25,000.
        The stolen phone was recovered from his possession.
        """
        
        results = pipeline.process_transcript(sample_transcript)
        
        if results and 'case_analysis' in results:
            print(f"✓ Pipeline processing successful")
            print(f"  Primary crime: {results['case_analysis']['primary_crime_classification']}")
            print(f"  Confidence: {results['case_analysis']['confidence_score']}")
        else:
            print("✗ Pipeline processing failed")
            return False
        
        return True
        
    except Exception as e:
        print(f"✗ Pipeline test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("LEGAL AI PIPELINE - QUICK TEST")
    print("=" * 50)
    
    tests = [
        test_imports,
        test_ipc_database,
        test_text_preprocessing,
        test_penalty_estimation,
        test_basic_pipeline
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
    else:
        print("⚠️  Some tests failed. Check the error messages above.")
    
    print("\nTo run the full example usage:")
    print("python example_usage.py")

if __name__ == "__main__":
    main()
