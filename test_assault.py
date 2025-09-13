#!/usr/bin/env python3
"""
Test script to demonstrate proper assault case classification
"""

from crime_classifier import CrimeClassifier
from penalty_estimator import PenaltyEstimator
from ipc_database import IPCDatabase

def test_assault_case():
    print("=" * 60)
    print("TESTING ASSAULT CASE CLASSIFICATION")
    print("=" * 60)
    
    # Test case: Pregnant woman beaten by drunk man
    case_text = "A pregnant woman was beaten by a drunk man, causing injuries"
    crime_keywords = ["beaten", "injuries", "assault", "hurt"]
    
    print(f"Case: {case_text}")
    print(f"Keywords: {crime_keywords}")
    print()
    
    # Initialize components
    classifier = CrimeClassifier()
    estimator = PenaltyEstimator()
    ipc_db = IPCDatabase()
    
    print("Step 1: Classifying the crime...")
    
    # Use keyword matching for more accurate results
    results = classifier.classify_with_keyword_matching(
        case_text, 
        crime_keywords, 
        top_k=5
    )
    
    print(f"✓ Found {len(results)} relevant IPC sections:")
    for i, result in enumerate(results, 1):
        print(f"  {i}. {result['section_number']} - {result['title']}")
        print(f"     Confidence: {result['confidence_score']:.3f}")
    
    print()
    print("Step 2: Estimating penalties...")
    
    # Create context for penalty estimation
    context = {
        'text': case_text,
        'crime_keywords': crime_keywords,
        'actions': crime_keywords,
        'entities': {}
    }
    
    penalties = estimator.get_penalty_summary(results, context)
    
    print("✓ Penalty estimation completed:")
    for i, penalty in enumerate(penalties, 1):
        print(f"  {i}. {penalty['section_number']} - {penalty['title']}")
        print(f"     Penalty: {penalty['penalty_text']}")
        print(f"     Confidence: {penalty['confidence_score']:.3f}")
        print()
    
    print("Step 3: Detailed IPC Section Information:")
    if results:
        top_result = results[0]
        section_info = ipc_db.get_section_by_number(top_result['section_number'])
        if section_info:
            print(f"Section: {section_info['section_number']}")
            print(f"Title: {section_info['title']}")
            print(f"Description: {section_info['description']}")
            print(f"Penalty: {section_info['penalty']}")
            print(f"Keywords: {', '.join(section_info['keywords'][:10])}...")
    
    print()
    print("=" * 60)
    print("ANALYSIS COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    test_assault_case()
