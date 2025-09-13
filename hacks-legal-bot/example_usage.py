"""
Example Usage Script for Legal AI Pipeline
Demonstrates how to use the system with various types of legal case transcripts.
"""

import json
from legal_ai_pipeline import LegalAIPipeline

def example_1_theft_case():
    """Example 1: Theft case"""
    print("=" * 60)
    print("EXAMPLE 1: THEFT CASE")
    print("=" * 60)
    
    transcript = """
    Case No: Crl. Appeal No. 2023/001
    Court: Sessions Court, Mumbai
    Date: 20th February, 2023
    
    Facts of the Case:
    The accused, Rajesh Kumar, was charged with theft under IPC Section 378.
    On 15th January, 2023, at approximately 2:30 PM, the accused entered 
    the complainant's shop in Andheri West, Mumbai. He stole a laptop 
    computer worth Rs. 45,000 while the shopkeeper was attending to another customer.
    
    Evidence:
    CCTV footage clearly shows the accused taking the laptop and leaving the shop.
    The stolen laptop was recovered from the accused's residence.
    The accused has no previous criminal record.
    
    Arguments:
    The prosecution argued that the accused committed theft with dishonest intention.
    The defense claimed that the accused was under the influence of alcohol.
    
    Judgment:
    The accused is found guilty of theft and sentenced to 1 year imprisonment 
    and a fine of Rs. 10,000.
    """
    
    metadata = {
        "case_number": "Crl. Appeal No. 2023/001",
        "court": "Sessions Court, Mumbai",
        "accused": "Rajesh Kumar",
        "date": "20th February, 2023"
    }
    
    pipeline = LegalAIPipeline(classification_method="ensemble", top_k_sections=3)
    results = pipeline.process_transcript(transcript, metadata)
    
    print(f"Primary Crime: {results['case_analysis']['primary_crime_classification']}")
    print(f"Confidence: {results['case_analysis']['confidence_score']}")
    print("\nTop IPC Sections:")
    for i, section in enumerate(results['case_analysis']['ipc_sections'], 1):
        print(f"{i}. {section['section']} - {section['title']}")
        print(f"   Penalty: {section['penalty']}")
        print(f"   Confidence: {section['confidence_score']}")
    
    return results

def example_2_assault_case():
    """Example 2: Assault case"""
    print("\n" + "=" * 60)
    print("EXAMPLE 2: ASSAULT CASE")
    print("=" * 60)
    
    transcript = """
    Case No: Crl. Case No. 456/2023
    Court: Metropolitan Magistrate Court, Delhi
    Date: 10th March, 2023
    
    Facts:
    The accused, Vikram Singh, was charged with voluntarily causing hurt under IPC Section 323.
    On 5th March, 2023, at around 7:00 PM, a dispute arose between the accused and 
    the complainant, Mr. Amit Sharma, over a parking space in Connaught Place, Delhi.
    The accused punched the complainant in the face, causing a black eye and 
    bleeding from the nose. The complainant was taken to the hospital for treatment.
    
    Medical Evidence:
    Doctor's report confirms injuries to the face and nose.
    The injuries were not serious and the complainant was discharged the same day.
    
    Witness Testimony:
    Two eyewitnesses confirmed seeing the accused assault the complainant.
    
    Judgment:
    The accused is found guilty of voluntarily causing hurt and sentenced to 
    6 months imprisonment and a fine of Rs. 2,000.
    """
    
    metadata = {
        "case_number": "Crl. Case No. 456/2023",
        "court": "Metropolitan Magistrate Court, Delhi",
        "accused": "Vikram Singh",
        "complainant": "Mr. Amit Sharma"
    }
    
    pipeline = LegalAIPipeline(classification_method="ensemble", top_k_sections=3)
    results = pipeline.process_transcript(transcript, metadata)
    
    print(f"Primary Crime: {results['case_analysis']['primary_crime_classification']}")
    print(f"Confidence: {results['case_analysis']['confidence_score']}")
    print("\nTop IPC Sections:")
    for i, section in enumerate(results['case_analysis']['ipc_sections'], 1):
        print(f"{i}. {section['section']} - {section['title']}")
        print(f"   Penalty: {section['penalty']}")
        print(f"   Confidence: {section['confidence_score']}")
    
    return results

def example_3_fraud_case():
    """Example 3: Fraud case"""
    print("\n" + "=" * 60)
    print("EXAMPLE 3: FRAUD CASE")
    print("=" * 60)
    
    transcript = """
    Case No: Crl. Appeal No. 789/2023
    Court: High Court of Karnataka
    Date: 25th March, 2023
    
    Facts:
    The accused, Priya Sharma, was charged with cheating under IPC Section 420.
    The accused approached the complainant, Mr. Ravi Kumar, claiming to be a 
    real estate agent. She showed him fake property documents and collected 
    Rs. 5,00,000 as advance payment for a property in Bangalore. Later, it was 
    discovered that the property documents were forged and the accused had no 
    authority to sell the property.
    
    Investigation:
    Police investigation revealed that the accused had cheated multiple people 
    using similar modus operandi. She had previous convictions for similar frauds.
    
    Evidence:
    Fake property documents were recovered from the accused's possession.
    Bank records show the transfer of money to the accused's account.
    Multiple victims testified against the accused.
    
    Judgment:
    The accused is found guilty of cheating and sentenced to 3 years rigorous 
    imprisonment and a fine of Rs. 1,00,000.
    """
    
    metadata = {
        "case_number": "Crl. Appeal No. 789/2023",
        "court": "High Court of Karnataka",
        "accused": "Priya Sharma",
        "complainant": "Mr. Ravi Kumar"
    }
    
    pipeline = LegalAIPipeline(classification_method="ensemble", top_k_sections=3)
    results = pipeline.process_transcript(transcript, metadata)
    
    print(f"Primary Crime: {results['case_analysis']['primary_crime_classification']}")
    print(f"Confidence: {results['case_analysis']['confidence_score']}")
    print("\nTop IPC Sections:")
    for i, section in enumerate(results['case_analysis']['ipc_sections'], 1):
        print(f"{i}. {section['section']} - {section['title']}")
        print(f"   Penalty: {section['penalty']}")
        print(f"   Confidence: {section['confidence_score']}")
    
    return results

def example_4_batch_processing():
    """Example 4: Batch processing multiple cases"""
    print("\n" + "=" * 60)
    print("EXAMPLE 4: BATCH PROCESSING")
    print("=" * 60)
    
    transcripts = [
        {
            "text": """
            Case: The accused stole a bicycle from the complainant's house.
            The bicycle was worth Rs. 8,000. The accused was caught red-handed.
            """,
            "metadata": {"case_type": "theft", "value": "8000"}
        },
        {
            "text": """
            Case: The accused threatened the complainant with physical harm
            if he did not pay Rs. 50,000. The accused used abusive language.
            """,
            "metadata": {"case_type": "intimidation", "amount": "50000"}
        },
        {
            "text": """
            Case: The accused entered the complainant's house without permission
            and damaged property worth Rs. 15,000. The accused was intoxicated.
            """,
            "metadata": {"case_type": "trespass", "damage": "15000"}
        }
    ]
    
    pipeline = LegalAIPipeline(classification_method="ensemble", top_k_sections=2)
    batch_results = pipeline.batch_process(transcripts)
    
    print(f"Processed {len(batch_results)} cases:")
    for i, result in enumerate(batch_results, 1):
        if "error" in result:
            print(f"Case {i}: ERROR - {result['error']}")
        else:
            primary_crime = result['case_analysis']['primary_crime_classification']
            confidence = result['case_analysis']['confidence_score']
            print(f"Case {i}: {primary_crime} (Confidence: {confidence})")
    
    return batch_results

def example_5_different_classification_methods():
    """Example 5: Compare different classification methods"""
    print("\n" + "=" * 60)
    print("EXAMPLE 5: COMPARING CLASSIFICATION METHODS")
    print("=" * 60)
    
    transcript = """
    The accused committed robbery at gunpoint. He threatened the victim and 
    stole cash worth Rs. 1,00,000 and jewelry. The victim was injured during 
    the incident. The accused has previous convictions for similar crimes.
    """
    
    methods = ["zero_shot", "similarity", "keyword", "ensemble"]
    results_comparison = {}
    
    for method in methods:
        print(f"\n{method.upper()} Method:")
        print("-" * 20)
        
        try:
            pipeline = LegalAIPipeline(classification_method=method, top_k_sections=3)
            results = pipeline.process_transcript(transcript)
            
            primary_crime = results['case_analysis']['primary_crime_classification']
            confidence = results['case_analysis']['confidence_score']
            
            print(f"Primary Crime: {primary_crime}")
            print(f"Confidence: {confidence}")
            
            for i, section in enumerate(results['case_analysis']['ipc_sections'], 1):
                print(f"{i}. {section['section']} - {section['title']} ({section['confidence_score']:.3f})")
            
            results_comparison[method] = {
                'primary_crime': primary_crime,
                'confidence': confidence,
                'top_sections': results['case_analysis']['ipc_sections']
            }
            
        except Exception as e:
            print(f"Error with {method}: {e}")
            results_comparison[method] = {'error': str(e)}
    
    return results_comparison

def export_example_results():
    """Example of exporting results to different formats"""
    print("\n" + "=" * 60)
    print("EXAMPLE: EXPORTING RESULTS")
    print("=" * 60)
    
    transcript = """
    The accused was found guilty of theft. He stole a mobile phone worth Rs. 25,000.
    The stolen phone was recovered from his possession. He has no previous record.
    """
    
    pipeline = LegalAIPipeline()
    results = pipeline.process_transcript(transcript)
    
    # Export as JSON
    json_output = pipeline.export_results(results, output_format="json")
    print("JSON Export (first 300 characters):")
    print(json_output[:300] + "...")
    
    # Export as text
    text_output = pipeline.export_results(results, output_format="text")
    print("\nText Export:")
    print(text_output)
    
    return results

def main():
    """Run all examples"""
    print("LEGAL AI PIPELINE - EXAMPLE USAGE")
    print("=" * 60)
    
    try:
        # Run individual examples
        example_1_theft_case()
        example_2_assault_case()
        example_3_fraud_case()
        example_4_batch_processing()
        example_5_different_classification_methods()
        export_example_results()
        
        print("\n" + "=" * 60)
        print("ALL EXAMPLES COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        
    except Exception as e:
        print(f"Error running examples: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
