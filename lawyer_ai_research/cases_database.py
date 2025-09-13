"""
Legal Cases Database
Contains a comprehensive collection of legal cases with their details, IPC sections, and outcomes.
"""

CASE_DATABASE = {
    "case_001": {
        "id": "case_001",
        "crime": "The accused stole a mobile phone worth Rs. 25,000 from the victim's bag at a shopping mall.",
        "sections": ["IPC 378", "IPC 379"],
        "penalty": "Imprisonment up to 3 years, or fine, or both",
        "court": "Sessions Court, Mumbai",
        "date": "2023-01-15",
        "accused": "Rajesh Kumar",
        "complainant": "Priya Sharma",
        "outcome": "Guilty - 2 years imprisonment and fine of Rs. 5,000",
        "case_number": "Crl. Case No. 1234/2023",
        "judge": "Hon'ble Justice A.K. Singh",
        "lawyer_prosecution": "Adv. Meera Patel",
        "lawyer_defense": "Adv. Ravi Verma",
        "evidence": ["CCTV footage", "Recovery of stolen phone", "Witness testimony"],
        "facts": "The accused was caught on CCTV stealing the phone from victim's bag at Phoenix Mall, Mumbai. The phone was recovered from his possession.",
        "judgment": "The court found the accused guilty of theft and sentenced him to 2 years imprisonment with a fine of Rs. 5,000."
    },
    
    "case_002": {
        "id": "case_002",
        "crime": "The accused committed murder by stabbing the victim multiple times with a knife during a dispute.",
        "sections": ["IPC 300", "IPC 302"],
        "penalty": "Death, or imprisonment for life, and fine",
        "court": "High Court, Delhi",
        "date": "2023-02-20",
        "accused": "Vikram Singh",
        "complainant": "State of Delhi",
        "outcome": "Guilty - Life imprisonment and fine of Rs. 50,000",
        "case_number": "Crl. Appeal No. 5678/2023",
        "judge": "Hon'ble Justice S.K. Gupta",
        "lawyer_prosecution": "Adv. Deepak Sharma",
        "lawyer_defense": "Adv. Anjali Mehta",
        "evidence": ["Murder weapon", "Blood samples", "Witness testimony", "Post-mortem report"],
        "facts": "The accused stabbed the victim 15 times during a heated argument over property dispute. The victim died on the spot.",
        "judgment": "The court found the accused guilty of murder and sentenced him to life imprisonment with a fine of Rs. 50,000."
    },
    
    "case_003": {
        "id": "case_003",
        "crime": "The accused committed robbery by threatening the victim with a knife and stealing cash and jewelry.",
        "sections": ["IPC 390", "IPC 392"],
        "penalty": "Rigorous imprisonment up to 10 years, and fine",
        "court": "Sessions Court, Bangalore",
        "date": "2023-03-10",
        "accused": "Suresh Reddy",
        "complainant": "Lakshmi Devi",
        "outcome": "Guilty - 7 years rigorous imprisonment and fine of Rs. 25,000",
        "case_number": "Crl. Case No. 9012/2023",
        "judge": "Hon'ble Justice R. Venkatesh",
        "lawyer_prosecution": "Adv. Kavitha Nair",
        "lawyer_defense": "Adv. Manoj Kumar",
        "evidence": ["Recovery of stolen items", "Victim's testimony", "Medical examination report"],
        "facts": "The accused entered the victim's house at night, threatened her with a knife, and stole cash and gold jewelry worth Rs. 2 lakhs.",
        "judgment": "The court found the accused guilty of robbery and sentenced him to 7 years rigorous imprisonment with a fine of Rs. 25,000."
    },
    
    "case_004": {
        "id": "case_004",
        "crime": "The accused committed fraud by selling fake gold jewelry to multiple victims.",
        "sections": ["IPC 415", "IPC 420"],
        "penalty": "Imprisonment up to 7 years, and fine",
        "court": "Sessions Court, Chennai",
        "date": "2023-04-05",
        "accused": "Kumar Swamy",
        "complainant": "Multiple victims",
        "outcome": "Guilty - 5 years imprisonment and fine of Rs. 1,00,000",
        "case_number": "Crl. Case No. 3456/2023",
        "judge": "Hon'ble Justice P. Rajesh",
        "lawyer_prosecution": "Adv. Sita Raman",
        "lawyer_defense": "Adv. Ganesh Iyer",
        "evidence": ["Fake jewelry samples", "Victim testimonies", "Bank transaction records"],
        "facts": "The accused sold fake gold jewelry to 15 victims, cheating them of Rs. 5 lakhs in total. The jewelry was found to be made of brass.",
        "judgment": "The court found the accused guilty of cheating and sentenced him to 5 years imprisonment with a fine of Rs. 1,00,000."
    },
    
    "case_005": {
        "id": "case_005",
        "crime": "The accused committed sexual assault on a minor girl.",
        "sections": ["IPC 375", "IPC 376"],
        "penalty": "Rigorous imprisonment not less than 10 years, may extend to life imprisonment, and fine",
        "court": "Special Court, Mumbai",
        "date": "2023-05-12",
        "accused": "Ramesh Tiwari",
        "complainant": "State of Maharashtra",
        "outcome": "Guilty - 15 years rigorous imprisonment and fine of Rs. 2,00,000",
        "case_number": "Crl. Case No. 7890/2023",
        "judge": "Hon'ble Justice M. Desai",
        "lawyer_prosecution": "Adv. Neha Joshi",
        "lawyer_defense": "Adv. Ashok Pandey",
        "evidence": ["Medical examination report", "Victim's testimony", "DNA evidence"],
        "facts": "The accused sexually assaulted a 14-year-old girl in his neighborhood. The victim identified the accused and medical evidence confirmed the assault.",
        "judgment": "The court found the accused guilty of rape and sentenced him to 15 years rigorous imprisonment with a fine of Rs. 2,00,000."
    },
    
    "case_006": {
        "id": "case_006",
        "crime": "The accused committed criminal breach of trust by misappropriating company funds.",
        "sections": ["IPC 405", "IPC 406"],
        "penalty": "Imprisonment up to 3 years, or fine, or both",
        "court": "Sessions Court, Delhi",
        "date": "2023-06-18",
        "accused": "Amit Jain",
        "complainant": "ABC Private Limited",
        "outcome": "Guilty - 2 years imprisonment and fine of Rs. 50,000",
        "case_number": "Crl. Case No. 2468/2023",
        "judge": "Hon'ble Justice K. Malhotra",
        "lawyer_prosecution": "Adv. Rohit Agarwal",
        "lawyer_defense": "Adv. Priya Singh",
        "evidence": ["Bank statements", "Company records", "Audit report"],
        "facts": "The accused, working as an accountant, misappropriated Rs. 10 lakhs from company funds over a period of 6 months.",
        "judgment": "The court found the accused guilty of criminal breach of trust and sentenced him to 2 years imprisonment with a fine of Rs. 50,000."
    },
    
    "case_007": {
        "id": "case_007",
        "crime": "The accused committed defamation by spreading false rumors about the victim.",
        "sections": ["IPC 499", "IPC 500"],
        "penalty": "Simple imprisonment up to 2 years, or fine, or both",
        "court": "Sessions Court, Kolkata",
        "date": "2023-07-25",
        "accused": "Sunita Das",
        "complainant": "Ravi Kumar",
        "outcome": "Guilty - 6 months simple imprisonment and fine of Rs. 10,000",
        "case_number": "Crl. Case No. 1357/2023",
        "judge": "Hon'ble Justice S. Banerjee",
        "lawyer_prosecution": "Adv. Arjun Sen",
        "lawyer_defense": "Adv. Meera Ghosh",
        "evidence": ["Social media posts", "Witness testimonies", "Print media articles"],
        "facts": "The accused spread false rumors about the victim's character on social media and through word of mouth, damaging his reputation.",
        "judgment": "The court found the accused guilty of defamation and sentenced her to 6 months simple imprisonment with a fine of Rs. 10,000."
    },
    
    "case_008": {
        "id": "case_008",
        "crime": "The accused committed criminal intimidation by threatening the victim with dire consequences.",
        "sections": ["IPC 503", "IPC 506"],
        "penalty": "Imprisonment up to 2 years, or fine, or both",
        "court": "Sessions Court, Hyderabad",
        "date": "2023-08-30",
        "accused": "Ravi Naidu",
        "complainant": "Sita Reddy",
        "outcome": "Guilty - 1 year imprisonment and fine of Rs. 15,000",
        "case_number": "Crl. Case No. 9753/2023",
        "judge": "Hon'ble Justice V. Rao",
        "lawyer_prosecution": "Adv. Lakshmi Prasad",
        "lawyer_defense": "Adv. Rajesh Kumar",
        "evidence": ["Audio recording", "Witness testimony", "Threat messages"],
        "facts": "The accused threatened the victim with physical harm if she did not withdraw a complaint against him. The threats were recorded.",
        "judgment": "The court found the accused guilty of criminal intimidation and sentenced him to 1 year imprisonment with a fine of Rs. 15,000."
    },
    
    "case_009": {
        "id": "case_009",
        "crime": "The accused committed kidnapping by abducting a child for ransom.",
        "sections": ["IPC 359", "IPC 363", "IPC 365"],
        "penalty": "Imprisonment up to 7 years, and fine",
        "court": "Sessions Court, Pune",
        "date": "2023-09-14",
        "accused": "Manoj Patil",
        "complainant": "State of Maharashtra",
        "outcome": "Guilty - 5 years imprisonment and fine of Rs. 75,000",
        "case_number": "Crl. Case No. 8642/2023",
        "judge": "Hon'ble Justice A. Deshmukh",
        "lawyer_prosecution": "Adv. Sneha Kulkarni",
        "lawyer_defense": "Adv. Vijay Pawar",
        "evidence": ["Ransom calls recording", "Child's testimony", "Recovery of child"],
        "facts": "The accused kidnapped a 8-year-old child and demanded Rs. 5 lakhs as ransom. The child was recovered safely after 3 days.",
        "judgment": "The court found the accused guilty of kidnapping and sentenced him to 5 years imprisonment with a fine of Rs. 75,000."
    },
    
    "case_010": {
        "id": "case_010",
        "crime": "The accused committed forgery by creating fake documents to obtain a loan.",
        "sections": ["IPC 463", "IPC 465"],
        "penalty": "Imprisonment up to 2 years, or fine, or both",
        "court": "Sessions Court, Ahmedabad",
        "date": "2023-10-08",
        "accused": "Harsh Shah",
        "complainant": "State Bank of India",
        "outcome": "Guilty - 1 year imprisonment and fine of Rs. 30,000",
        "case_number": "Crl. Case No. 1597/2023",
        "judge": "Hon'ble Justice P. Patel",
        "lawyer_prosecution": "Adv. Kirti Mehta",
        "lawyer_defense": "Adv. Rajesh Gupta",
        "evidence": ["Fake documents", "Bank records", "Expert opinion"],
        "facts": "The accused submitted fake salary certificates and property documents to obtain a loan of Rs. 15 lakhs from SBI.",
        "judgment": "The court found the accused guilty of forgery and sentenced him to 1 year imprisonment with a fine of Rs. 30,000."
    }
}

def get_all_cases():
    """Get all cases from the database."""
    return CASE_DATABASE

def get_case_by_id(case_id):
    """Get a specific case by its ID."""
    return CASE_DATABASE.get(case_id, None)

def get_cases_by_section(section):
    """Get all cases that involve a specific IPC section."""
    matching_cases = []
    for case_id, case_data in CASE_DATABASE.items():
        if section in case_data.get("sections", []):
            matching_cases.append(case_data)
    return matching_cases

def get_cases_by_court(court):
    """Get all cases from a specific court."""
    matching_cases = []
    for case_id, case_data in CASE_DATABASE.items():
        if court.lower() in case_data.get("court", "").lower():
            matching_cases.append(case_data)
    return matching_cases

def get_cases_by_date_range(start_date, end_date):
    """Get all cases within a specific date range."""
    matching_cases = []
    for case_id, case_data in CASE_DATABASE.items():
        case_date = case_data.get("date", "")
        if start_date <= case_date <= end_date:
            matching_cases.append(case_data)
    return matching_cases

def search_cases_by_keyword(keyword):
    """Search cases by keyword in crime description, facts, or judgment."""
    matching_cases = []
    keyword_lower = keyword.lower()
    
    for case_id, case_data in CASE_DATABASE.items():
        searchable_text = " ".join([
            case_data.get("crime", ""),
            case_data.get("facts", ""),
            case_data.get("judgment", ""),
            case_data.get("outcome", "")
        ]).lower()
        
        if keyword_lower in searchable_text:
            matching_cases.append(case_data)
    
    return matching_cases

def get_cases_by_outcome(outcome_keyword):
    """Get cases by outcome keyword (e.g., 'guilty', 'acquitted', 'life imprisonment')."""
    matching_cases = []
    outcome_lower = outcome_keyword.lower()
    
    for case_id, case_data in CASE_DATABASE.items():
        case_outcome = case_data.get("outcome", "").lower()
        if outcome_lower in case_outcome:
            matching_cases.append(case_data)
    
    return matching_cases

def get_database_statistics():
    """Get statistics about the cases database."""
    total_cases = len(CASE_DATABASE)
    
    # Count by sections
    section_counts = {}
    for case_data in CASE_DATABASE.values():
        for section in case_data.get("sections", []):
            section_counts[section] = section_counts.get(section, 0) + 1
    
    # Count by courts
    court_counts = {}
    for case_data in CASE_DATABASE.values():
        court = case_data.get("court", "")
        court_counts[court] = court_counts.get(court, 0) + 1
    
    # Count by outcomes
    outcome_counts = {}
    for case_data in CASE_DATABASE.values():
        outcome = case_data.get("outcome", "")
        if "guilty" in outcome.lower():
            outcome_counts["Guilty"] = outcome_counts.get("Guilty", 0) + 1
        elif "acquitted" in outcome.lower():
            outcome_counts["Acquitted"] = outcome_counts.get("Acquitted", 0) + 1
        else:
            outcome_counts["Other"] = outcome_counts.get("Other", 0) + 1
    
    return {
        "total_cases": total_cases,
        "section_distribution": section_counts,
        "court_distribution": court_counts,
        "outcome_distribution": outcome_counts
    }
