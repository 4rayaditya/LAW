"""
Legal AI Pipeline - Main Orchestrator
Combines all components to process court case transcripts and map them to IPC sections.
"""

import json
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging

from text_preprocessor import LegalTextPreprocessor
from crime_classifier import CrimeClassifier
from penalty_estimator import PenaltyEstimator
from ipc_database import get_all_sections

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LegalAIPipeline:
    """Main pipeline for processing legal case transcripts and mapping to IPC sections."""
    
    def __init__(self, 
                 classifier_model: str = "facebook/bart-large-mnli",
                 classification_method: str = "ensemble",
                 top_k_sections: int = 5):
        """
        Initialize the Legal AI Pipeline.
        
        Args:
            classifier_model: Pre-trained model for classification
            classification_method: Method for classification ('ensemble', 'zero_shot', 'similarity', 'keyword')
            top_k_sections: Number of top IPC sections to return
        """
        self.classification_method = classification_method
        self.top_k_sections = top_k_sections
        
        logger.info("Initializing Legal AI Pipeline components...")
        
        # Initialize components
        self.preprocessor = LegalTextPreprocessor()
        self.classifier = CrimeClassifier(model_name=classifier_model)
        self.penalty_estimator = PenaltyEstimator()
        
        logger.info("Legal AI Pipeline initialized successfully!")
    
    def process_transcript(self, 
                          transcript_text: str,
                          case_metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Process a court case transcript and return structured IPC analysis.
        
        Args:
            transcript_text: Raw text of the court case transcript
            case_metadata: Optional metadata about the case
            
        Returns:
            Dictionary containing complete analysis results
        """
        logger.info("Starting transcript processing...")
        
        # Step 1: Preprocess the transcript
        logger.info("Step 1: Preprocessing transcript...")
        preprocessing_result = self.preprocessor.preprocess(transcript_text)
        
        # Step 2: Classify crimes using IPC sections
        logger.info("Step 2: Classifying crimes...")
        classification_result = self.classifier.classify(
            text=preprocessing_result['classification_text'],
            crime_keywords=preprocessing_result['crime_keywords'],
            method=self.classification_method,
            top_k=self.top_k_sections
        )
        
        # Step 3: Estimate penalties
        logger.info("Step 3: Estimating penalties...")
        context = {
            'text': preprocessing_result['classification_text'],
            'crime_keywords': preprocessing_result['crime_keywords'],
            'actions': preprocessing_result['actions'],
            'entities': preprocessing_result['entities']
        }
        
        penalty_summaries = self.penalty_estimator.get_penalty_summary(
            classification_result, context
        )
        
        # Step 4: Compile final results
        logger.info("Step 4: Compiling results...")
        final_result = self._compile_results(
            transcript_text=transcript_text,
            preprocessing_result=preprocessing_result,
            classification_result=classification_result,
            penalty_summaries=penalty_summaries,
            case_metadata=case_metadata
        )
        
        logger.info("Transcript processing completed!")
        return final_result
    
    def _compile_results(self, 
                        transcript_text: str,
                        preprocessing_result: Dict,
                        classification_result: List[Dict],
                        penalty_summaries: List[Dict],
                        case_metadata: Optional[Dict]) -> Dict[str, Any]:
        """Compile all results into a structured output."""
        
        # Determine primary crime classification
        primary_crime = None
        if classification_result:
            primary_crime = classification_result[0]['title']
        
        # Structure IPC sections with penalties
        ipc_sections = []
        for i, (classification, penalty) in enumerate(zip(classification_result, penalty_summaries)):
            ipc_sections.append({
                "section": classification['section_number'],
                "title": classification['title'],
                "description": classification['description'],
                "penalty": penalty['penalty_text'],
                "confidence_score": classification['confidence_score'],
                "penalty_confidence": penalty['penalty_confidence'],
                "context_factors": penalty['context_factors']
            })
        
        # Calculate overall confidence
        overall_confidence = self._calculate_overall_confidence(
            classification_result, penalty_summaries
        )
        
        # Compile final result
        result = {
            "case_analysis": {
                "primary_crime_classification": primary_crime,
                "ipc_sections": ipc_sections,
                "confidence_score": overall_confidence,
                "processing_timestamp": datetime.now().isoformat(),
                "classification_method": self.classification_method
            },
            "preprocessing_summary": {
                "word_count": preprocessing_result['word_count'],
                "sentence_count": preprocessing_result['sentence_count'],
                "entities_extracted": {
                    "persons": len(preprocessing_result['entities']['persons']),
                    "locations": len(preprocessing_result['entities']['locations']),
                    "organizations": len(preprocessing_result['entities']['organizations']),
                    "dates": len(preprocessing_result['entities']['dates']),
                    "amounts": len(preprocessing_result['entities']['amounts'])
                },
                "crime_keywords_found": preprocessing_result['crime_keywords'],
                "actions_identified": preprocessing_result['actions']
            },
            "detailed_analysis": {
                "structured_sections": preprocessing_result['structured_sections'],
                "entities": preprocessing_result['entities'],
                "classification_text": preprocessing_result['classification_text']
            }
        }
        
        # Add case metadata if provided
        if case_metadata:
            result["case_metadata"] = case_metadata
        
        return result
    
    def _calculate_overall_confidence(self, 
                                    classification_result: List[Dict],
                                    penalty_summaries: List[Dict]) -> float:
        """Calculate overall confidence score for the analysis."""
        if not classification_result:
            return 0.0
        
        # Weight classification confidence more heavily
        classification_confidence = sum(
            result['confidence_score'] for result in classification_result
        ) / len(classification_result)
        
        penalty_confidence = sum(
            summary['penalty_confidence'] for summary in penalty_summaries
        ) / len(penalty_summaries) if penalty_summaries else 0.0
        
        # Weighted average: 70% classification, 30% penalty
        overall_confidence = (0.7 * classification_confidence) + (0.3 * penalty_confidence)
        
        return round(overall_confidence, 3)
    
    def batch_process(self, 
                     transcripts: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """
        Process multiple transcripts in batch.
        
        Args:
            transcripts: List of dictionaries with 'text' and optional 'metadata' keys
            
        Returns:
            List of analysis results
        """
        logger.info(f"Starting batch processing of {len(transcripts)} transcripts...")
        
        results = []
        for i, transcript_data in enumerate(transcripts):
            logger.info(f"Processing transcript {i+1}/{len(transcripts)}...")
            
            try:
                result = self.process_transcript(
                    transcript_text=transcript_data['text'],
                    case_metadata=transcript_data.get('metadata')
                )
                results.append(result)
                
            except Exception as e:
                logger.error(f"Error processing transcript {i+1}: {e}")
                results.append({
                    "error": str(e),
                    "transcript_index": i,
                    "processing_timestamp": datetime.now().isoformat()
                })
        
        logger.info("Batch processing completed!")
        return results
    
    def export_results(self, 
                      results: Dict[str, Any], 
                      output_format: str = "json",
                      file_path: Optional[str] = None) -> str:
        """
        Export results to specified format.
        
        Args:
            results: Analysis results
            output_format: Export format ('json', 'text')
            file_path: Optional file path to save results
            
        Returns:
            Exported results as string
        """
        if output_format == "json":
            exported = json.dumps(results, indent=2, ensure_ascii=False)
        elif output_format == "text":
            exported = self._format_text_output(results)
        else:
            raise ValueError(f"Unsupported output format: {output_format}")
        
        if file_path:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(exported)
            logger.info(f"Results exported to {file_path}")
        
        return exported
    
    def _format_text_output(self, results: Dict[str, Any]) -> str:
        """Format results as human-readable text."""
        output_lines = []
        
        # Case analysis summary
        case_analysis = results['case_analysis']
        output_lines.append("LEGAL CASE ANALYSIS REPORT")
        output_lines.append("=" * 50)
        output_lines.append(f"Primary Crime: {case_analysis['primary_crime_classification']}")
        output_lines.append(f"Overall Confidence: {case_analysis['confidence_score']}")
        output_lines.append(f"Processing Time: {case_analysis['processing_timestamp']}")
        output_lines.append("")
        
        # IPC sections
        output_lines.append("IDENTIFIED IPC SECTIONS:")
        output_lines.append("-" * 30)
        for i, section in enumerate(case_analysis['ipc_sections'], 1):
            output_lines.append(f"{i}. {section['section']} - {section['title']}")
            output_lines.append(f"   Description: {section['description'][:100]}...")
            output_lines.append(f"   Penalty: {section['penalty']}")
            output_lines.append(f"   Confidence: {section['confidence_score']}")
            output_lines.append("")
        
        # Preprocessing summary
        preprocessing = results['preprocessing_summary']
        output_lines.append("TEXT ANALYSIS SUMMARY:")
        output_lines.append("-" * 30)
        output_lines.append(f"Word Count: {preprocessing['word_count']}")
        output_lines.append(f"Sentence Count: {preprocessing['sentence_count']}")
        output_lines.append(f"Crime Keywords: {', '.join(preprocessing['crime_keywords_found'])}")
        output_lines.append(f"Actions Identified: {', '.join(preprocessing['actions_identified'])}")
        output_lines.append("")
        
        return "\n".join(output_lines)
    
    def get_system_info(self) -> Dict[str, Any]:
        """Get information about the system configuration."""
        return {
            "system_version": "1.0.0",
            "classification_method": self.classification_method,
            "top_k_sections": self.top_k_sections,
            "available_ipc_sections": len(get_all_sections()),
            "components": {
                "preprocessor": "LegalTextPreprocessor",
                "classifier": "CrimeClassifier",
                "penalty_estimator": "PenaltyEstimator"
            }
        }

# Example usage and testing
if __name__ == "__main__":
    # Sample court case transcript
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
    
    # Sample case metadata
    case_metadata = {
        "case_number": "Crl. Appeal No. 1234/2023",
        "court": "High Court of Delhi",
        "date": "15th March, 2023",
        "accused": "Mr. John Smith",
        "complainant": "Ms. Sarah Johnson"
    }
    
    # Initialize pipeline
    pipeline = LegalAIPipeline(
        classification_method="ensemble",
        top_k_sections=3
    )
    
    # Process the transcript
    print("Processing Legal Case Transcript...")
    print("=" * 50)
    
    results = pipeline.process_transcript(
        transcript_text=sample_transcript,
        case_metadata=case_metadata
    )
    
    # Display results
    print("\nANALYSIS RESULTS:")
    print("-" * 30)
    
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
    print("JSON output saved (first 500 characters):")
    print(json_output[:500] + "...")
    
    # Get system info
    system_info = pipeline.get_system_info()
    print(f"\nSystem Info: {system_info}")