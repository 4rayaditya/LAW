"""
Text Preprocessing Pipeline for Legal Case Transcripts
Handles cleaning, structuring, and entity extraction from court case transcripts.
"""

import re
import spacy
from typing import Dict, List, Tuple, Optional
from datetime import datetime
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

class LegalTextPreprocessor:
    """Preprocesses legal case transcripts for IPC classification."""
    
    def __init__(self):
        """Initialize the preprocessor with required models."""
        try:
            # Load spaCy model (you may need to install: python -m spacy download en_core_web_sm)
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Warning: spaCy model not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
        
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Legal-specific patterns
        self.court_patterns = [
            r'Court\s+of\s+([A-Z][a-z]+)',
            r'([A-Z][a-z]+)\s+Court',
            r'High\s+Court\s+of\s+([A-Z][a-z]+)',
            r'Supreme\s+Court'
        ]
        
        self.date_patterns = [
            r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',
            r'\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{2,4}\b',
            r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{2,4}\b'
        ]
        
        self.case_number_patterns = [
            r'Case\s+No[.:]\s*([A-Z0-9/-]+)',
            r'Crl\.?\s+No[.:]\s*([A-Z0-9/-]+)',
            r'Criminal\s+Appeal\s+No[.:]\s*([A-Z0-9/-]+)'
        ]
        
        self.amount_patterns = [
            r'Rs\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'₹\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*rupees?'
        ]

    def clean_text(self, text: str) -> str:
        """Clean and normalize the input text."""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Remove special characters but keep legal punctuation
        text = re.sub(r'[^\w\s.,;:!?()\[\]{}"-]', ' ', text)
        
        # Normalize quotes
        text = re.sub(r'["""]', '"', text)
        text = re.sub(r'[''']', "'", text)
        
        # Remove excessive punctuation
        text = re.sub(r'[.]{2,}', '.', text)
        text = re.sub(r'[!]{2,}', '!', text)
        text = re.sub(r'[?]{2,}', '?', text)
        
        return text.strip()

    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract named entities from the text."""
        entities = {
            'persons': [],
            'locations': [],
            'organizations': [],
            'dates': [],
            'amounts': [],
            'case_numbers': [],
            'courts': []
        }
        
        # Extract dates
        for pattern in self.date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities['dates'].extend(matches)
        
        # Extract case numbers
        for pattern in self.case_number_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities['case_numbers'].extend(matches)
        
        # Extract court names
        for pattern in self.court_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities['courts'].extend(matches)
        
        # Extract amounts
        for pattern in self.amount_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities['amounts'].extend(matches)
        
        # Use spaCy for NER if available
        if self.nlp:
            doc = self.nlp(text)
            for ent in doc.ents:
                if ent.label_ == 'PERSON':
                    entities['persons'].append(ent.text)
                elif ent.label_ == 'GPE' or ent.label_ == 'LOC':
                    entities['locations'].append(ent.text)
                elif ent.label_ == 'ORG':
                    entities['organizations'].append(ent.text)
        
        # Remove duplicates and clean
        for key in entities:
            entities[key] = list(set([item.strip() for item in entities[key] if item.strip()]))
        
        return entities

    def extract_crime_keywords(self, text: str) -> List[str]:
        """Extract crime-related keywords from the text."""
        crime_keywords = [
            'theft', 'steal', 'stolen', 'robbery', 'rob', 'burglary', 'burgle',
            'murder', 'kill', 'killed', 'homicide', 'assault', 'attack', 'hurt',
            'rape', 'sexual', 'molest', 'molestation', 'abuse', 'abused',
            'fraud', 'cheat', 'cheating', 'deceive', 'deception', 'forgery',
            'extortion', 'blackmail', 'threat', 'threaten', 'intimidate',
            'kidnap', 'kidnapping', 'abduct', 'abduction', 'trespass',
            'defamation', 'slander', 'libel', 'breach of trust', 'embezzle',
            'conspiracy', 'conspire', 'conspirator', 'dacoity', 'dacoit'
        ]
        
        found_keywords = []
        text_lower = text.lower()
        
        for keyword in crime_keywords:
            if keyword in text_lower:
                found_keywords.append(keyword)
        
        return found_keywords

    def extract_actions(self, text: str) -> List[str]:
        """Extract action verbs that might indicate criminal activity."""
        action_patterns = [
            r'\b(?:stole|stolen|stealing)\b',
            r'\b(?:robbed|robbing|robbery)\b',
            r'\b(?:killed|killing|murdered|murdering)\b',
            r'\b(?:attacked|attacking|assaulted|assaulting)\b',
            r'\b(?:raped|raping|molested|molesting)\b',
            r'\b(?:cheated|cheating|defrauded|defrauding)\b',
            r'\b(?:threatened|threatening|intimidated|intimidating)\b',
            r'\b(?:kidnapped|kidnapping|abducted|abducting)\b',
            r'\b(?:trespassed|trespassing|entered illegally)\b',
            r'\b(?:forged|forging|falsified|falsifying)\b'
        ]
        
        actions = []
        for pattern in action_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            actions.extend(matches)
        
        return list(set(actions))

    def structure_transcript(self, text: str) -> Dict[str, str]:
        """Structure the transcript into logical sections."""
        sections = {
            'case_header': '',
            'facts': '',
            'allegations': '',
            'evidence': '',
            'arguments': '',
            'judgment': '',
            'other': ''
        }
        
        # Common section headers
        section_headers = {
            'case_header': [r'Case\s+No', r'Court\s+Name', r'Petitioner', r'Respondent', r'Date\s+of\s+Judgment'],
            'facts': [r'Facts', r'Background', r'Case\s+History', r'Incident'],
            'allegations': [r'Allegations', r'Charges', r'Complaint', r'FIR'],
            'evidence': [r'Evidence', r'Testimony', r'Witness', r'Documents'],
            'arguments': [r'Arguments', r'Submissions', r'Contentions', r'Pleadings'],
            'judgment': [r'Judgment', r'Order', r'Decision', r'Verdict', r'Conclusion']
        }
        
        lines = text.split('\n')
        current_section = 'other'
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if line matches any section header
            for section, patterns in section_headers.items():
                for pattern in patterns:
                    if re.search(pattern, line, re.IGNORECASE):
                        current_section = section
                        break
                if current_section != 'other':
                    break
            
            sections[current_section] += line + ' '
        
        # Clean up sections
        for key in sections:
            sections[key] = sections[key].strip()
        
        return sections

    def preprocess(self, text: str) -> Dict:
        """Main preprocessing function that combines all steps."""
        if not text:
            return {}
        
        # Clean the text
        cleaned_text = self.clean_text(text)
        
        # Extract entities
        entities = self.extract_entities(cleaned_text)
        
        # Extract crime keywords
        crime_keywords = self.extract_crime_keywords(cleaned_text)
        
        # Extract actions
        actions = self.extract_actions(cleaned_text)
        
        # Structure the transcript
        structured_sections = self.structure_transcript(cleaned_text)
        
        # Create summary for classification
        classification_text = self._create_classification_text(
            cleaned_text, crime_keywords, actions, structured_sections
        )
        
        return {
            'original_text': text,
            'cleaned_text': cleaned_text,
            'entities': entities,
            'crime_keywords': crime_keywords,
            'actions': actions,
            'structured_sections': structured_sections,
            'classification_text': classification_text,
            'word_count': len(cleaned_text.split()),
            'sentence_count': len(sent_tokenize(cleaned_text))
        }

    def _create_classification_text(self, cleaned_text: str, crime_keywords: List[str], 
                                  actions: List[str], structured_sections: Dict[str, str]) -> str:
        """Create a focused text for classification by combining relevant parts."""
        classification_parts = []
        
        # Add crime keywords
        if crime_keywords:
            classification_parts.append("Crime keywords: " + ", ".join(crime_keywords))
        
        # Add actions
        if actions:
            classification_parts.append("Actions: " + ", ".join(actions))
        
        # Add key sections
        key_sections = ['facts', 'allegations', 'evidence']
        for section in key_sections:
            if structured_sections.get(section):
                classification_parts.append(f"{section.title()}: {structured_sections[section]}")
        
        # If no structured sections, use the full cleaned text
        if not classification_parts:
            classification_parts.append(cleaned_text)
        
        return " ".join(classification_parts)

# Example usage and testing
if __name__ == "__main__":
    # Sample legal transcript
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
    
    print("Preprocessing Results:")
    print("=" * 50)
    print(f"Word Count: {result['word_count']}")
    print(f"Sentence Count: {result['sentence_count']}")
    print(f"\nCrime Keywords: {result['crime_keywords']}")
    print(f"\nActions: {result['actions']}")
    print(f"\nEntities: {result['entities']}")
    print(f"\nClassification Text: {result['classification_text'][:200]}...")
