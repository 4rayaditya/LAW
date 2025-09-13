"""
Penalty Estimation Module
Estimates and structures penalties for identified IPC sections.
"""

import re
from typing import Dict, List, Optional, Tuple
from ipc_database import IPC_DATABASE, get_ipc_section

class PenaltyEstimator:
    """Estimates penalties for IPC sections with additional context analysis."""
    
    def __init__(self):
        """Initialize the penalty estimator."""
        self.penalty_patterns = {
            'imprisonment': [
                r'imprisonment\s+(?:of\s+either\s+description\s+)?for\s+a\s+term\s+which\s+may\s+extend\s+to\s+(\d+)\s+years?',
                r'imprisonment\s+up\s+to\s+(\d+)\s+years?',
                r'imprisonment\s+for\s+(\d+)\s+years?',
                r'rigorous\s+imprisonment\s+(?:for\s+a\s+term\s+which\s+may\s+extend\s+to\s+)?(\d+)\s+years?',
                r'simple\s+imprisonment\s+(?:for\s+a\s+term\s+which\s+may\s+extend\s+to\s+)?(\d+)\s+years?',
                r'imprisonment\s+not\s+less\s+than\s+(\d+)\s+years?',
                r'imprisonment\s+for\s+life',
                r'death'
            ],
            'fine': [
                r'fine\s+(?:which\s+may\s+extend\s+to\s+)?(?:Rs\.?\s*)?(\d+(?:,\d{3})*(?:\.\d{2})?)',
                r'fine\s+of\s+(?:Rs\.?\s*)?(\d+(?:,\d{3})*(?:\.\d{2})?)',
                r'fine\s+up\s+to\s+(?:Rs\.?\s*)?(\d+(?:,\d{3})*(?:\.\d{2})?)',
                r'fine\s+not\s+exceeding\s+(?:Rs\.?\s*)?(\d+(?:,\d{3})*(?:\.\d{2})?)'
            ]
        }
        
        # Aggravating and mitigating factors
        self.aggravating_factors = [
            'repeat offender', 'previous conviction', 'habitual offender',
            'organized crime', 'gang', 'weapon used', 'dangerous weapon',
            'public place', 'daylight', 'witness present', 'victim vulnerable',
            'serious injury', 'grievous hurt', 'death caused', 'property damage',
            'large amount', 'valuable property', 'government property'
        ]
        
        self.mitigating_factors = [
            'first time offender', 'no previous conviction', 'cooperated with police',
            'confessed', 'pleaded guilty', 'showed remorse', 'compensated victim',
            'minor age', 'mental illness', 'provocation', 'self defense',
            'small amount', 'petty crime', 'unintentional'
        ]

    def parse_penalty_text(self, penalty_text: str) -> Dict:
        """Parse penalty text to extract structured information."""
        penalty_info = {
            'imprisonment': {
                'type': None,
                'duration': None,
                'min_duration': None,
                'max_duration': None,
                'is_life': False,
                'is_death': False
            },
            'fine': {
                'amount': None,
                'min_amount': None,
                'max_amount': None,
                'currency': 'INR'
            },
            'additional_penalties': [],
            'raw_text': penalty_text
        }
        
        penalty_lower = penalty_text.lower()
        
        # Parse imprisonment
        for pattern in self.penalty_patterns['imprisonment']:
            match = re.search(pattern, penalty_lower)
            if match:
                if 'life' in penalty_lower:
                    penalty_info['imprisonment']['is_life'] = True
                    penalty_info['imprisonment']['type'] = 'life'
                elif 'death' in penalty_lower:
                    penalty_info['imprisonment']['is_death'] = True
                    penalty_info['imprisonment']['type'] = 'death'
                else:
                    duration = int(match.group(1))
                    penalty_info['imprisonment']['duration'] = duration
                    penalty_info['imprisonment']['max_duration'] = duration
                    
                    if 'rigorous' in penalty_lower:
                        penalty_info['imprisonment']['type'] = 'rigorous'
                    elif 'simple' in penalty_lower:
                        penalty_info['imprisonment']['type'] = 'simple'
                    else:
                        penalty_info['imprisonment']['type'] = 'either'
        
        # Parse fine
        for pattern in self.penalty_patterns['fine']:
            match = re.search(pattern, penalty_lower)
            if match:
                amount_str = match.group(1).replace(',', '')
                try:
                    amount = float(amount_str)
                    penalty_info['fine']['amount'] = amount
                    penalty_info['fine']['max_amount'] = amount
                except ValueError:
                    pass
        
        return penalty_info

    def estimate_penalty_range(self, section_number: str, context: Dict = None) -> Dict:
        """Estimate penalty range based on IPC section and context."""
        section_data = get_ipc_section(section_number)
        if not section_data:
            return {}
        
        # Parse the base penalty
        base_penalty = self.parse_penalty_text(section_data['penalty'])
        
        # Apply context-based adjustments
        adjusted_penalty = self._apply_context_adjustments(base_penalty, context or {})
        
        return {
            'section_number': section_number,
            'title': section_data['title'],
            'base_penalty': base_penalty,
            'estimated_penalty': adjusted_penalty,
            'context_factors': self._analyze_context_factors(context or {}),
            'confidence': self._calculate_confidence(context or {})
        }

    def _apply_context_adjustments(self, base_penalty: Dict, context: Dict) -> Dict:
        """Apply context-based adjustments to penalty estimation."""
        adjusted = base_penalty.copy()
        
        # Analyze aggravating and mitigating factors
        aggravating_count = 0
        mitigating_count = 0
        
        context_text = ' '.join([
            context.get('text', ''),
            ' '.join(context.get('crime_keywords', [])),
            ' '.join(context.get('actions', [])),
            ' '.join(context.get('entities', {}).get('amounts', [])),
        ]).lower()
        
        for factor in self.aggravating_factors:
            if factor in context_text:
                aggravating_count += 1
        
        for factor in self.mitigating_factors:
            if factor in context_text:
                mitigating_count += 1
        
        # Adjust imprisonment duration
        if adjusted['imprisonment']['duration'] and not adjusted['imprisonment']['is_life']:
            adjustment_factor = 1.0
            
            # Aggravating factors increase penalty
            if aggravating_count > 0:
                adjustment_factor += (aggravating_count * 0.2)
            
            # Mitigating factors decrease penalty
            if mitigating_count > 0:
                adjustment_factor -= (mitigating_count * 0.15)
            
            # Ensure minimum adjustment
            adjustment_factor = max(0.5, min(2.0, adjustment_factor))
            
            adjusted['imprisonment']['estimated_duration'] = int(
                adjusted['imprisonment']['duration'] * adjustment_factor
            )
        
        # Adjust fine amount
        if adjusted['fine']['amount']:
            adjustment_factor = 1.0
            
            if aggravating_count > 0:
                adjustment_factor += (aggravating_count * 0.3)
            
            if mitigating_count > 0:
                adjustment_factor -= (mitigating_count * 0.2)
            
            adjustment_factor = max(0.3, min(3.0, adjustment_factor))
            
            adjusted['fine']['estimated_amount'] = int(
                adjusted['fine']['amount'] * adjustment_factor
            )
        
        return adjusted

    def _analyze_context_factors(self, context: Dict) -> Dict:
        """Analyze context to identify relevant factors."""
        factors = {
            'aggravating': [],
            'mitigating': [],
            'neutral': []
        }
        
        context_text = ' '.join([
            context.get('text', ''),
            ' '.join(context.get('crime_keywords', [])),
            ' '.join(context.get('actions', [])),
        ]).lower()
        
        for factor in self.aggravating_factors:
            if factor in context_text:
                factors['aggravating'].append(factor)
        
        for factor in self.mitigating_factors:
            if factor in context_text:
                factors['mitigating'].append(factor)
        
        return factors

    def _calculate_confidence(self, context: Dict) -> float:
        """Calculate confidence score for penalty estimation."""
        confidence = 0.5  # Base confidence
        
        # Increase confidence based on available context
        if context.get('text'):
            confidence += 0.2
        
        if context.get('crime_keywords'):
            confidence += 0.1
        
        if context.get('entities', {}).get('amounts'):
            confidence += 0.1
        
        if context.get('actions'):
            confidence += 0.1
        
        return min(1.0, confidence)

    def format_penalty_output(self, penalty_estimation: Dict) -> str:
        """Format penalty estimation into human-readable text."""
        if not penalty_estimation:
            return "No penalty information available."
        
        output_parts = []
        
        # Imprisonment
        imprisonment = penalty_estimation['estimated_penalty']['imprisonment']
        if imprisonment['is_death']:
            output_parts.append("Death penalty")
        elif imprisonment['is_life']:
            output_parts.append("Imprisonment for life")
        elif imprisonment.get('estimated_duration'):
            duration = imprisonment['estimated_duration']
            penalty_type = imprisonment['type'] or 'imprisonment'
            output_parts.append(f"{penalty_type.title()}: up to {duration} years")
        elif imprisonment.get('duration'):
            duration = imprisonment['duration']
            penalty_type = imprisonment['type'] or 'imprisonment'
            output_parts.append(f"{penalty_type.title()}: up to {duration} years")
        
        # Fine
        fine = penalty_estimation['estimated_penalty']['fine']
        if fine.get('estimated_amount'):
            amount = fine['estimated_amount']
            output_parts.append(f"Fine: up to ₹{amount:,}")
        elif fine.get('amount'):
            amount = fine['amount']
            output_parts.append(f"Fine: up to ₹{amount:,}")
        
        # Additional penalties
        if penalty_estimation['estimated_penalty']['additional_penalties']:
            output_parts.extend(penalty_estimation['estimated_penalty']['additional_penalties'])
        
        return ", ".join(output_parts) if output_parts else "Penalty not specified"

    def get_penalty_summary(self, classifications: List[Dict], context: Dict = None) -> List[Dict]:
        """Get penalty summary for multiple IPC classifications."""
        penalty_summaries = []
        
        for classification in classifications:
            section_number = classification['section_number']
            penalty_estimation = self.estimate_penalty_range(section_number, context)
            
            if penalty_estimation:
                penalty_summaries.append({
                    'section_number': section_number,
                    'title': classification['title'],
                    'description': classification['description'],
                    'penalty_text': self.format_penalty_output(penalty_estimation),
                    'confidence_score': classification.get('confidence_score', 0.0),
                    'penalty_confidence': penalty_estimation.get('confidence', 0.0),
                    'context_factors': penalty_estimation.get('context_factors', {}),
                    'detailed_penalty': penalty_estimation
                })
        
        return penalty_summaries

# Example usage and testing
if __name__ == "__main__":
    # Sample classifications
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
    
    # Sample context
    sample_context = {
        'text': 'The accused stole a mobile phone worth Rs. 25,000 from the victim.',
        'crime_keywords': ['theft', 'stole', 'mobile phone'],
        'actions': ['stole', 'stolen'],
        'entities': {
            'amounts': ['25000']
        }
    }
    
    # Initialize penalty estimator
    estimator = PenaltyEstimator()
    
    # Get penalty summaries
    penalty_summaries = estimator.get_penalty_summary(sample_classifications, sample_context)
    
    print("Penalty Estimation Results")
    print("=" * 50)
    
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
