"""
Crime Classification System using Transformers
Uses pre-trained models to classify legal case transcripts into IPC sections.
"""

import torch
import numpy as np
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification, 
    pipeline, AutoModel
)
from sentence_transformers import SentenceTransformer, util
from typing import Dict, List, Tuple, Optional
import json
from sklearn.metrics.pairwise import cosine_similarity
from ipc_database import IPC_DATABASE, get_all_sections

class CrimeClassifier:
    """Classifies legal case transcripts into IPC sections using multiple approaches."""
    
    def __init__(self, model_name: str = "facebook/bart-large-mnli"):
        """Initialize the classifier with a pre-trained model."""
        self.model_name = model_name
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Initialize zero-shot classifier
        try:
            self.zero_shot_classifier = pipeline(
                "zero-shot-classification",
                model=model_name,
                device=0 if torch.cuda.is_available() else -1
            )
        except Exception as e:
            print(f"Warning: Could not load {model_name}. Using sentence transformers instead.")
            self.zero_shot_classifier = None
        
        # Initialize sentence transformer for semantic similarity
        try:
            self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Warning: Could not load sentence transformer: {e}")
            self.sentence_model = None
        
        # Prepare IPC section labels and descriptions
        self.ipc_sections = self._prepare_ipc_labels()
        
    def _prepare_ipc_labels(self) -> List[Dict]:
        """Prepare IPC sections for classification."""
        sections = []
        for section_num, section_data in IPC_DATABASE.items():
            # Create a comprehensive label combining section number, title, and key description
            label = f"{section_data['section']}: {section_data['title']}"
            description = section_data['description'][:200] + "..." if len(section_data['description']) > 200 else section_data['description']
            
            sections.append({
                'section_number': section_num,
                'label': label,
                'title': section_data['title'],
                'description': description,
                'full_description': section_data['description'],
                'keywords': section_data['keywords'],
                'penalty': section_data['penalty']
            })
        
        return sections
    
    def classify_with_zero_shot(self, text: str, top_k: int = 5) -> List[Dict]:
        """Classify using zero-shot classification."""
        if not self.zero_shot_classifier:
            return []
        
        # Prepare labels for zero-shot classification
        labels = [section['label'] for section in self.ipc_sections]
        
        try:
            # Run zero-shot classification
            result = self.zero_shot_classifier(text, labels, multi_label=True)
            
            # Map results back to IPC sections
            classifications = []
            for i, (label, score) in enumerate(zip(result['labels'][:top_k], result['scores'][:top_k])):
                # Find the corresponding IPC section
                section_data = next((s for s in self.ipc_sections if s['label'] == label), None)
                if section_data:
                    classifications.append({
                        'section_number': section_data['section_number'],
                        'title': section_data['title'],
                        'description': section_data['description'],
                        'penalty': section_data['penalty'],
                        'confidence_score': float(score),
                        'method': 'zero_shot'
                    })
            
            return classifications
            
        except Exception as e:
            print(f"Error in zero-shot classification: {e}")
            return []
    
    def classify_with_similarity(self, text: str, top_k: int = 5) -> List[Dict]:
        """Classify using semantic similarity with sentence transformers."""
        if not self.sentence_model:
            return []
        
        try:
            # Encode the input text
            text_embedding = self.sentence_model.encode([text])
            
            # Encode all IPC section descriptions
            section_texts = []
            for section in self.ipc_sections:
                # Combine title, description, and keywords for better matching
                combined_text = f"{section['title']} {section['description']} {' '.join(section['keywords'])}"
                section_texts.append(combined_text)
            
            section_embeddings = self.sentence_model.encode(section_texts)
            
            # Calculate similarities
            similarities = cosine_similarity(text_embedding, section_embeddings)[0]
            
            # Get top-k most similar sections
            top_indices = np.argsort(similarities)[::-1][:top_k]
            
            classifications = []
            for idx in top_indices:
                section = self.ipc_sections[idx]
                classifications.append({
                    'section_number': section['section_number'],
                    'title': section['title'],
                    'description': section['description'],
                    'penalty': section['penalty'],
                    'confidence_score': float(similarities[idx]),
                    'method': 'similarity'
                })
            
            return classifications
            
        except Exception as e:
            print(f"Error in similarity classification: {e}")
            return []
    
    def classify_with_keyword_matching(self, text: str, crime_keywords: List[str], top_k: int = 5) -> List[Dict]:
        """Classify using keyword matching with IPC sections."""
        text_lower = text.lower()
        keyword_scores = {}
        
        for section in self.ipc_sections:
            score = 0
            section_keywords = [kw.lower() for kw in section['keywords']]
            
            # Count keyword matches
            for keyword in crime_keywords:
                if keyword.lower() in section_keywords:
                    score += 1
                # Also check if keyword appears in text
                if keyword.lower() in text_lower:
                    score += 0.5
            
            # Check for keyword matches in section title and description
            title_lower = section['title'].lower()
            desc_lower = section['description'].lower()
            
            for keyword in crime_keywords:
                if keyword.lower() in title_lower:
                    score += 2  # Higher weight for title matches
                if keyword.lower() in desc_lower:
                    score += 1
            
            if score > 0:
                keyword_scores[section['section_number']] = {
                    'section': section,
                    'score': score
                }
        
        # Sort by score and return top-k
        sorted_sections = sorted(keyword_scores.items(), key=lambda x: x[1]['score'], reverse=True)[:top_k]
        
        classifications = []
        for section_num, data in sorted_sections:
            section = data['section']
            max_possible_score = len(crime_keywords) * 3.5  # Approximate max score
            confidence = min(data['score'] / max_possible_score, 1.0) if max_possible_score > 0 else 0
            
            classifications.append({
                'section_number': section_num,
                'title': section['title'],
                'description': section['description'],
                'penalty': section['penalty'],
                'confidence_score': confidence,
                'method': 'keyword_matching'
            })
        
        return classifications
    
    def ensemble_classify(self, text: str, crime_keywords: List[str], top_k: int = 5) -> List[Dict]:
        """Combine multiple classification methods for better accuracy."""
        all_classifications = {}
        
        # Get classifications from different methods
        zero_shot_results = self.classify_with_zero_shot(text, top_k)
        similarity_results = self.classify_with_similarity(text, top_k)
        keyword_results = self.classify_with_keyword_matching(text, crime_keywords, top_k)
        
        # Combine results with weighted scores
        methods = {
            'zero_shot': {'results': zero_shot_results, 'weight': 0.4},
            'similarity': {'results': similarity_results, 'weight': 0.4},
            'keyword': {'results': keyword_results, 'weight': 0.2}
        }
        
        for method_name, method_data in methods.items():
            for result in method_data['results']:
                section_num = result['section_number']
                weighted_score = result['confidence_score'] * method_data['weight']
                
                if section_num in all_classifications:
                    all_classifications[section_num]['confidence_score'] += weighted_score
                    all_classifications[section_num]['methods'].append(method_name)
                else:
                    all_classifications[section_num] = {
                        'section_number': result['section_number'],
                        'title': result['title'],
                        'description': result['description'],
                        'penalty': result['penalty'],
                        'confidence_score': weighted_score,
                        'methods': [method_name]
                    }
        
        # Sort by combined confidence score
        sorted_classifications = sorted(
            all_classifications.values(), 
            key=lambda x: x['confidence_score'], 
            reverse=True
        )[:top_k]
        
        # Normalize confidence scores
        if sorted_classifications:
            max_score = sorted_classifications[0]['confidence_score']
            for classification in sorted_classifications:
                classification['confidence_score'] = classification['confidence_score'] / max_score
        
        return sorted_classifications
    
    def classify(self, text: str, crime_keywords: List[str] = None, method: str = 'ensemble', top_k: int = 5) -> List[Dict]:
        """Main classification method."""
        if not text.strip():
            return []
        
        if crime_keywords is None:
            crime_keywords = []
        
        if method == 'zero_shot':
            return self.classify_with_zero_shot(text, top_k)
        elif method == 'similarity':
            return self.classify_with_similarity(text, top_k)
        elif method == 'keyword':
            return self.classify_with_keyword_matching(text, crime_keywords, top_k)
        elif method == 'ensemble':
            return self.ensemble_classify(text, crime_keywords, top_k)
        else:
            raise ValueError(f"Unknown classification method: {method}")

# Example usage and testing
if __name__ == "__main__":
    # Sample legal case text
    sample_text = """
    The accused was charged with theft under IPC Section 378. 
    He stole a mobile phone worth Rs. 25,000 from the victim's bag.
    The stolen phone was recovered from his possession.
    """
    
    crime_keywords = ['theft', 'stole', 'stolen', 'mobile phone']
    
    # Initialize classifier
    classifier = CrimeClassifier()
    
    # Test different classification methods
    print("Testing Crime Classification System")
    print("=" * 50)
    
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
    
    print("Classification completed!")
