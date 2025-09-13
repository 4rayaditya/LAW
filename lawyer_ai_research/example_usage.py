"""
Example Usage Script for Lawyer AI Research Tool
Demonstrates how to use the various components of the system.
"""

import asyncio
import json
from datetime import datetime
from legal_ai_pipeline import LegalAIPipeline
from legal_case_retrieval import LegalCaseRetrieval
from ipc_database import get_all_sections, get_ipc_section, search_sections_by_keyword
from cases_database import get_all_cases, get_case_by_id

def test_text_preprocessing():
    """Test the text preprocessing component."""
    print("=" * 60)
    print("TESTING TEXT PREPROCESSING")
    print("=" * 60)
    
    from text_preprocessor import LegalTextPreprocessor
    
    sample_transcript = """
    Case No: Crl. Appeal No. 1234/2023
    Court: High Court of Delhi
    Date of Judgment: 15th March, 2023
    
    Facts:
    The accused, Mr. John Smith, was charged with theft under IPC Section 378.
    On 10th January, 2023, he stole a mobile phone worth Rs. 25,000 from
    the complainant, Ms. Sarah Johnson, at Connaught Place, New Delhi.
    
    Evidence:
    CCTV footage showed the accused taking the phone from the victim's bag.
    The stolen phone was recovered from the accused's possession.
    
    Judgment:
    The accused is found guilty of theft and sentenced to 2 years imprisonment
    and a fine of Rs. 5,000.
    """
    
    preprocessor = LegalTextPreprocessor()
    result = preprocessor.preprocess(sample_transcript)
    
    print(f"Word Count: {result['word_count']}")
    print(f"Sentence Count: {result['sentence_count']}")
    print(f"Crime Keywords: {result['crime_keywords']}")
    print(f"Actions: {result['actions']}")
    print(f"Entities: {result['entities']}")
    print(f"Classification Text: {result['classification_text'][:200]}...")
    print()

def test_crime_classification():
    """Test the crime classification component."""
    print("=" * 60)
    print("TESTING CRIME CLASSIFICATION")
    print("=" * 60)
    
    from crime_classifier import CrimeClassifier
    
    sample_text = """
    The accused was charged with theft under IPC Section 378.
    He stole a mobile phone worth Rs. 25,000 from the victim's bag.
    The stolen phone was recovered from his possession.
    """
    
    crime_keywords = ['theft', 'stole', 'stolen', 'mobile phone']
    
    classifier = CrimeClassifier()
    
    methods = ['zero_shot', 'similarity', 'keyword', 'ensemble']
    
    for method in methods:
        print(f"\n{method.upper()} Classification:")
        print("-" * 30)
        
        try:
            results = classifier.classify(sample_text, crime_keywords, method=method, top_k=3)
            
            for i, result in enumerate(results, 1):
                print(f"{i}. {result['section_number']} - {result['title']}")
                print(f"   Confidence: {result['confidence_score']:.3f}")
                print(f"   Penalty: {result['penalty']}")
                print()
                
        except Exception as e:
            print(f"Error with {method}: {e}")
    print()

def test_penalty_estimation():
    """Test the penalty estimation component."""
    print("=" * 60)
    print("TESTING PENALTY ESTIMATION")
    print("=" * 60)
    
    from penalty_estimator import PenaltyEstimator
    
    sample_classifications = [
        {
            'section_number': 'IPC 378',
            'title': 'Theft',
            'description': 'Whoever, intending to take dishonestly...',
            'confidence_score': 0.85
        },
        {
            'section_number': 'IPC 379',
            'title': 'Punishment for theft',
            'description': 'Whoever commits theft shall be punished...',
            'confidence_score': 0.75
        }
    ]
    
    sample_context = {
        'text': 'The accused stole a mobile phone worth Rs. 25,000 from the victim.',
        'crime_keywords': ['theft', 'stole', 'mobile phone'],
        'actions': ['stole', 'stolen'],
        'entities': {
            'amounts': ['25000']
        }
    }
    
    estimator = PenaltyEstimator()
    penalty_summaries = estimator.get_penalty_summary(sample_classifications, sample_context)
    
    for summary in penalty_summaries:
        print(f"\nSection: {summary['section_number']} - {summary['title']}")
        print(f"Penalty: {summary['penalty_text']}")
        print(f"Confidence: {summary['confidence_score']:.3f}")
        print(f"Penalty Confidence: {summary['penalty_confidence']:.3f}")
        
        factors = summary['context_factors']
        if factors['aggravating']:
            print(f"Aggravating factors: {', '.join(factors['aggravating'])}")
        if factors['mitigating']:
            print(f"Mitigating factors: {', '.join(factors['mitigating'])}")
        print("-" * 30)
    print()

def test_legal_pipeline():
    """Test the complete legal AI pipeline."""
    print("=" * 60)
    print("TESTING LEGAL AI PIPELINE")
    print("=" * 60)
    
    sample_transcript = """
    Case No: Crl. Appeal No. 1234/2023
    Court: High Court of Delhi
    Date of Judgment: 15th March, 2023
    
    Facts:
    The accused, Mr. John Smith, was charged with theft under IPC Section 378.
    On 10th January, 2023, he stole a mobile phone worth Rs. 25,000 from
    the complainant, Ms. Sarah Johnson, at Connaught Place, New Delhi.
    
    Evidence:
    CCTV footage showed the accused taking the phone from the victim's bag.
    The stolen phone was recovered from the accused's possession.
    The accused has no previous criminal record.
    
    Judgment:
    The accused is found guilty of theft and sentenced to 2 years imprisonment
    and a fine of Rs. 5,000.
    """
    
    case_metadata = {
        "case_number": "Crl. Appeal No. 1234/2023",
        "court": "High Court of Delhi",
        "date": "15th March, 2023",
        "accused": "Mr. John Smith",
        "complainant": "Ms. Sarah Johnson"
    }
    
    pipeline = LegalAIPipeline(
        classification_method="ensemble",
        top_k_sections=3
    )
    
    print("Processing Legal Case Transcript...")
    print("-" * 40)
    
    results = pipeline.process_transcript(
        transcript_text=sample_transcript,
        case_metadata=case_metadata
    )
    
    case_analysis = results['case_analysis']
    print(f"Primary Crime: {case_analysis['primary_crime_classification']}")
    print(f"Confidence Score: {case_analysis['confidence_score']}")
    print(f"Classification Method: {case_analysis['classification_method']}")
    
    print(f"\nTop IPC Sections:")
    for i, section in enumerate(case_analysis['ipc_sections'], 1):
        print(f"{i}. {section['section']} - {section['title']}")
        print(f"   Penalty: {section['penalty']}")
        print(f"   Confidence: {section['confidence_score']}")
        print()
    
    # Export results
    json_output = pipeline.export_results(results, output_format="json")
    print("JSON output (first 500 characters):")
    print(json_output[:500] + "...")
    print()

def test_case_retrieval():
    """Test the case retrieval system."""
    print("=" * 60)
    print("TESTING CASE RETRIEVAL SYSTEM")
    print("=" * 60)
    
    retrieval_system = LegalCaseRetrieval()
    retrieval_system.load_cases_database()
    retrieval_system.generate_embeddings()
    
    test_query = "The accused stole a mobile phone worth Rs. 25,000 from the victim's bag at a shopping mall."
    
    print("Testing Legal Case Retrieval System...")
    print("-" * 40)
    
    # Perform comprehensive search
    results = retrieval_system.comprehensive_search(
        query=test_query,
        target_sections=["IPC 378", "IPC 379"],
        top_k=5
    )
    
    # Display results
    formatted_results = retrieval_system.format_search_results(results)
    print(formatted_results)
    
    # Show database stats
    stats = retrieval_system.get_database_stats()
    print("\nDATABASE STATISTICS:")
    print(f"Total cases: {stats['total_cases']}")
    print(f"Embeddings generated: {stats['embeddings_generated']}")
    print(f"Model used: {stats['model_used']}")
    print()

def test_ipc_database():
    """Test the IPC database functionality."""
    print("=" * 60)
    print("TESTING IPC DATABASE")
    print("=" * 60)
    
    # Get all sections
    all_sections = get_all_sections()
    print(f"Total IPC sections available: {len(all_sections)}")
    
    # Get specific section
    section_378 = get_ipc_section("IPC 378")
    if section_378:
        print(f"\nSection IPC 378:")
        print(f"Title: {section_378['title']}")
        print(f"Description: {section_378['description'][:100]}...")
        print(f"Penalty: {section_378['penalty']}")
        print(f"Keywords: {', '.join(section_378['keywords'][:5])}...")
    
    # Search by keyword
    theft_sections = search_sections_by_keyword("theft")
    print(f"\nSections related to 'theft': {len(theft_sections)}")
    for section in theft_sections[:3]:
        print(f"- {section['section']}: {section['title']}")
    print()

def test_cases_database():
    """Test the cases database functionality."""
    print("=" * 60)
    print("TESTING CASES DATABASE")
    print("=" * 60)
    
    # Get all cases
    all_cases = get_all_cases()
    print(f"Total cases in database: {len(all_cases)}")
    
    # Get specific case
    case_001 = get_case_by_id("case_001")
    if case_001:
        print(f"\nCase case_001:")
        print(f"Crime: {case_001['crime'][:100]}...")
        print(f"Sections: {', '.join(case_001['sections'])}")
        print(f"Court: {case_001['court']}")
        print(f"Outcome: {case_001['outcome']}")
    
    # Search by keyword
    theft_cases = search_cases_by_keyword("theft")
    print(f"\nCases related to 'theft': {len(theft_cases)}")
    for case in theft_cases[:3]:
        print(f"- {case['id']}: {case['crime'][:80]}...")
    print()

def test_batch_processing():
    """Test batch processing functionality."""
    print("=" * 60)
    print("TESTING BATCH PROCESSING")
    print("=" * 60)
    
    pipeline = LegalAIPipeline()
    
    # Sample transcripts for batch processing
    transcripts = [
        {
            "text": "The accused stole a mobile phone worth Rs. 25,000 from the victim's bag.",
            "metadata": {"case_id": "batch_001", "type": "theft"}
        },
        {
            "text": "The accused committed murder by stabbing the victim multiple times with a knife.",
            "metadata": {"case_id": "batch_002", "type": "murder"}
        },
        {
            "text": "The accused committed fraud by selling fake gold jewelry to multiple victims.",
            "metadata": {"case_id": "batch_003", "type": "fraud"}
        }
    ]
    
    print(f"Processing {len(transcripts)} transcripts in batch...")
    
    batch_results = pipeline.batch_process(transcripts)
    
    print(f"Batch processing completed. Results:")
    for i, result in enumerate(batch_results):
        if "error" in result:
            print(f"  {i+1}. Error: {result['error']}")
        else:
            primary_crime = result['case_analysis']['primary_crime_classification']
            confidence = result['case_analysis']['confidence_score']
            print(f"  {i+1}. {primary_crime} (Confidence: {confidence:.3f})")
    print()

def main():
    """Run all tests."""
    print("LAWYER AI RESEARCH TOOL - EXAMPLE USAGE")
    print("=" * 80)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # Test individual components
        test_text_preprocessing()
        test_crime_classification()
        test_penalty_estimation()
        test_legal_pipeline()
        test_case_retrieval()
        test_ipc_database()
        test_cases_database()
        test_batch_processing()
        
        print("=" * 80)
        print("ALL TESTS COMPLETED SUCCESSFULLY!")
        print(f"Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        print(f"Error during testing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
