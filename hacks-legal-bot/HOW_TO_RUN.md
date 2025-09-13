# How to Run and Test the Legal AI Pipeline

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 2. **Run Tests**
```bash
# Quick functionality test
python simple_test.py

# Full demo with sample cases
python demo.py

# Interactive demo (test with your own cases)
python interactive_demo.py
```

## 📋 Available Scripts

### **simple_test.py** - Basic Functionality Test
- Tests IPC database
- Tests penalty estimation
- Tests basic classification
- Tests simple pipeline
- **Run**: `python simple_test.py`

### **demo.py** - Comprehensive Demo
- Shows theft case analysis
- Shows assault case analysis  
- Shows fraud case analysis
- Shows IPC section search
- **Run**: `python demo.py`

### **interactive_demo.py** - Interactive Testing
- Enter your own case descriptions
- Get real-time analysis
- See sample cases for reference
- **Run**: `python interactive_demo.py`

### **example_usage.py** - Advanced Examples
- Multiple classification methods
- Batch processing examples
- Export functionality
- **Run**: `python example_usage.py`

## 🧪 Testing Your Own Cases

### **Method 1: Interactive Demo (Recommended)**
```bash
python interactive_demo.py
```
Then enter your case description like:
```
The accused stole a laptop worth Rs. 50,000 from the office.
```

### **Method 2: Direct Python Code**
```python
from crime_classifier import CrimeClassifier
from penalty_estimator import PenaltyEstimator

# Your case
case_text = "The accused committed theft by stealing a mobile phone."
crime_keywords = ["theft", "stole", "stolen"]

# Initialize
classifier = CrimeClassifier()
estimator = PenaltyEstimator()

# Classify
results = classifier.classify_with_keyword_matching(case_text, crime_keywords, top_k=3)

# Estimate penalties
context = {'text': case_text, 'crime_keywords': crime_keywords, 'actions': crime_keywords, 'entities': {}}
penalties = estimator.get_penalty_summary(results, context)

# Display results
for result in results:
    print(f"{result['section_number']} - {result['title']} (Confidence: {result['confidence_score']:.3f})")
```

## 📊 Expected Output

When you run the system, you should see:

```
✓ Found 3 relevant IPC sections:
  1. IPC 378 - Theft
     Confidence: 0.571
  2. IPC 379 - Punishment for theft  
     Confidence: 0.571
  3. IPC 380 - Theft in dwelling house, etc.
     Confidence: 0.429

✓ Penalty estimation completed:
  1. IPC 378 - Theft
     Penalty: Either: up to 3 years
     Confidence: 1.000
```

## 🔧 Troubleshooting

### **Common Issues:**

1. **Import Errors**
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

2. **Model Download Issues**
   - The system will automatically download models on first run
   - This may take a few minutes and requires internet connection

3. **Memory Issues**
   - The system uses CPU by default
   - For large cases, processing may take 10-30 seconds

4. **No Results Found**
   - Try using more specific legal terms
   - Check the sample cases for reference
   - Ensure your case description contains crime-related keywords

### **Performance Tips:**

- **Faster Processing**: Use `classification_method="keyword"` instead of `"ensemble"`
- **Better Accuracy**: Use `classification_method="ensemble"` (slower but more accurate)
- **Memory Usage**: The system uses ~2-4GB RAM when models are loaded

## 📝 Sample Cases to Test

### **Theft Cases:**
```
"The accused stole a mobile phone worth Rs. 25,000 from the victim's bag."
"The accused committed burglary by breaking into the house and stealing jewelry."
```

### **Assault Cases:**
```
"The accused punched the complainant in the face, causing a black eye."
"The accused attacked the victim with a knife, causing serious injuries."
```

### **Fraud Cases:**
```
"The accused cheated the complainant by showing fake property documents."
"The accused committed fraud by collecting money for a non-existent business."
```

### **Murder Cases:**
```
"The accused stabbed the victim multiple times, causing his death."
"The accused killed the victim by hitting him with a heavy object."
```

## 🎯 What the System Does

1. **Input**: Raw legal case description
2. **Processing**: 
   - Extracts crime keywords
   - Classifies using multiple ML approaches
   - Maps to relevant IPC sections
   - Estimates penalties with context
3. **Output**: 
   - Relevant IPC sections with confidence scores
   - Penalty estimates
   - Detailed legal information

## 📈 System Capabilities

- **50+ IPC Sections**: Covers major crime categories
- **Multiple Classification Methods**: Zero-shot, similarity, keyword, ensemble
- **Context-Aware Penalties**: Considers aggravating/mitigating factors
- **Confidence Scoring**: Provides reliability metrics
- **Batch Processing**: Handle multiple cases
- **Export Options**: JSON and text formats

## 🚀 Next Steps

1. **Run the demos** to see the system in action
2. **Test with your own cases** using the interactive demo
3. **Explore different classification methods** in example_usage.py
4. **Extend the IPC database** by adding more sections
5. **Fine-tune the models** for better accuracy on your specific use case

---

**The system is ready to use! Start with `python demo.py` to see it in action.**
