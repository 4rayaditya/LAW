"""
Indian Penal Code (IPC) Database
Contains structured information about IPC sections including titles, descriptions, and penalties.
"""

IPC_DATABASE = {
    # THEFT AND RELATED OFFENSES
    "IPC 378": {
        "section": "IPC 378",
        "title": "Theft",
        "description": "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
        "penalty": "Imprisonment up to 3 years, or fine, or both",
        "keywords": [
            "theft", "steal", "steals", "stole", "stolen",
            "dishonestly", "without consent", "moveable property",
            "pickpocket", "pickpocketing", "robbed", "robbery",
            "burglary", "shoplifting", "snatching", "snatched",
            "took away", "grabbed"
        ]
    },

    "IPC 379": {
        "section": "IPC 379", 
        "title": "Punishment for theft",
        "description": "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
        "penalty": "Imprisonment up to 3 years, or fine, or both",
        "keywords": [
            "theft", "steal", "stole", "stolen", "stealing",
            "punishment", "robbery", "caught stealing"
        ]
    },

    "IPC 380": {
        "section": "IPC 380",
        "title": "Theft in dwelling house, etc.",
        "description": "Whoever commits theft in any building, tent or vessel, which building, tent or vessel is used as a human dwelling, or used for the custody of property, shall be punished.",
        "penalty": "Imprisonment up to 7 years, and fine",
        "keywords": [
            "theft", "house theft", "home burglary", "dwelling house",
            "building theft", "tent theft", "stole from home", 
            "custody theft", "house break-in", "broke into"
        ]
    },

    # ROBBERY AND DACOITY
    "IPC 390": {
        "section": "IPC 390",
        "title": "Robbery",
        "description": "In all robbery there is either theft or extortion...",
        "penalty": "Imprisonment up to 10 years, and fine",
        "keywords": [
            "robbery", "robbed", "robbing", "snatching",
            "extortion", "threatened and stole", "hold up",
            "mugging", "armed robbery", "loot", "looted",
            "took by force"
        ]
    },

    "IPC 392": {
        "section": "IPC 392",
        "title": "Punishment for robbery",
        "description": "Whoever commits robbery shall be punished...",
        "penalty": "Rigorous imprisonment up to 10 years, and fine",
        "keywords": [
            "robbery", "punishment", "rigorous imprisonment",
            "armed robbery", "mugged"
        ]
    },

    "IPC 395": {
        "section": "IPC 395",
        "title": "Dacoity",
        "description": "When five or more persons conjointly commit robbery...",
        "penalty": "Imprisonment for life, or rigorous imprisonment up to 10 years, and fine",
        "keywords": [
            "dacoity", "gang robbery", "five persons robbery",
            "group robbery", "conjoint robbery", "bandits", "looting gang"
        ]
    },

    # ASSAULT AND HURT
    "IPC 319": {
        "section": "IPC 319",
        "title": "Hurt",
        "description": "Whoever causes bodily pain, disease or infirmity to any person is said to cause hurt.",
        "penalty": "Imprisonment up to 1 year, or fine up to Rs. 1000, or both",
        "keywords": [
            "hurt", "injury", "injured", "bodily pain",
            "disease", "infirmity", "beaten", "assaulted",
            "slapped", "hit", "attacked"
        ]
    },

    "IPC 320": {
        "section": "IPC 320",
        "title": "Grievous hurt",
        "description": "The following kinds of hurt only are designated as 'grievous'...",
        "penalty": "Imprisonment up to 7 years, and fine",
        "keywords": [
            "grievous hurt", "serious injury", "fracture", 
            "dislocation", "disfiguration", "broken bone",
            "permanent damage", "serious harm", "maimed"
        ]
    },

    "IPC 324": {
        "section": "IPC 324",
        "title": "Voluntarily causing hurt by dangerous weapons or means",
        "description": "Whoever... causes hurt by weapons, fire, poison, explosives...",
        "penalty": "Imprisonment up to 3 years, or fine, or both",
        "keywords": [
            "weapon attack", "knife stab", "gunshot", "acid attack",
            "fire injury", "poisoned", "explosion injury", "dangerous weapon"
        ]
    },

    # MURDER AND CULPABLE HOMICIDE
    "IPC 299": {
        "section": "IPC 299",
        "title": "Culpable homicide",
        "description": "Whoever causes death by doing an act with the intention...",
        "penalty": "Imprisonment for life, or imprisonment up to 10 years, and fine",
        "keywords": [
            "culpable homicide", "caused death", "manslaughter",
            "unintentional killing", "negligent killing"
        ]
    },

    "IPC 300": {
        "section": "IPC 300",
        "title": "Murder",
        "description": "Culpable homicide is murder, if the act is done with intention...",
        "penalty": "Death, or imprisonment for life, and fine",
        "keywords": [
            "murder", "murdered", "killed", "killing",
            "slay", "slain", "homicide", "took his life",
            "stabbed to death", "shot dead", "beaten to death"
        ]
    },

    "IPC 302": {
        "section": "IPC 302",
        "title": "Punishment for murder",
        "description": "Whoever commits murder shall be punished...",
        "penalty": "Death, or imprisonment for life, and fine",
        "keywords": [
            "murder punishment", "death penalty", "life imprisonment",
            "capital punishment"
        ]
    },

    # SEXUAL OFFENSES
    "IPC 375": {
        "section": "IPC 375",
        "title": "Rape",
        "description": "A man is said to commit 'rape' if he penetrates...",
        "penalty": "Rigorous imprisonment not less than 10 years, may extend to life imprisonment, and fine",
        "keywords": [
            "rape", "raped", "sexual assault", "molestation",
            "forced intercourse", "sexual violence", "without consent",
            "against her will", "forced himself", "abused sexually"
        ]
    },

    "IPC 376": {
        "section": "IPC 376",
        "title": "Punishment for rape",
        "description": "Whoever commits rape shall be punished...",
        "penalty": "Rigorous imprisonment not less than 10 years, may extend to life imprisonment, and fine",
        "keywords": [
            "rape punishment", "rigorous imprisonment",
            "life imprisonment", "sexual assault punishment"
        ]
    },

    # FRAUD AND CHEATING
    "IPC 415": {
        "section": "IPC 415",
        "title": "Cheating",
        "description": "Whoever, by deceiving any person, fraudulently induces...",
        "penalty": "Imprisonment up to 1 year, or fine, or both",
        "keywords": [
            "cheating", "deceived", "fraud", "dishonest",
            "scam", "trick", "misled", "conned", "swindled"
        ]
    },

    "IPC 420": {
        "section": "IPC 420",
        "title": "Cheating and dishonestly inducing delivery of property",
        "description": "Whoever cheats and dishonestly induces delivery of property...",
        "penalty": "Imprisonment up to 7 years, and fine",
        "keywords": [
            "cheating", "scam", "fraud", "dishonestly induced",
            "delivery of property", "scammed", "fake deal",
            "fraudulent contract", "swindled"
        ]
    },

    # CRIMINAL BREACH OF TRUST
    "IPC 405": {
        "section": "IPC 405",
        "title": "Criminal breach of trust",
        "description": "Whoever, entrusted with property, dishonestly misappropriates...",
        "penalty": "Imprisonment up to 3 years, or fine, or both",
        "keywords": [
            "criminal breach of trust", "embezzlement", "misappropriation",
            "property misuse", "betrayal of trust"
        ]
    },

    "IPC 406": {
        "section": "IPC 406",
        "title": "Punishment for criminal breach of trust",
        "description": "Whoever commits criminal breach of trust shall be punished...",
        "penalty": "Imprisonment up to 3 years, or fine, or both",
        "keywords": [
            "punishment breach of trust", "embezzlement penalty"
        ]
    },

    # DEFAMATION
    "IPC 499": {
        "section": "IPC 499",
        "title": "Defamation",
        "description": "Whoever makes or publishes any imputation harming reputation...",
        "penalty": "Simple imprisonment up to 2 years, or fine, or both",
        "keywords": [
            "defamation", "defame", "slander", "libel",
            "character assassination", "false allegations",
            "harm reputation"
        ]
    },

    "IPC 500": {
        "section": "IPC 500",
        "title": "Punishment for defamation",
        "description": "Whoever defames another shall be punished...",
        "penalty": "Simple imprisonment up to 2 years, or fine, or both",
        "keywords": [
            "defamation punishment", "slander penalty", "libel penalty"
        ]
    },

    # CRIMINAL INTIMIDATION
    "IPC 503": {
        "section": "IPC 503",
        "title": "Criminal intimidation",
        "description": "Whoever threatens another with injury to cause alarm...",
        "penalty": "Imprisonment up to 2 years, or fine, or both",
        "keywords": [
            "criminal intimidation", "threat", "threatened",
            "blackmail", "fear", "intimidated", "scared"
        ]
    },

    "IPC 506": {
        "section": "IPC 506",
        "title": "Punishment for criminal intimidation",
        "description": "Whoever commits the offence of criminal intimidation shall be punished...",
        "penalty": "Imprisonment up to 2 years, or fine, or both",
        "keywords": [
            "intimidation punishment", "blackmail penalty", "threat penalty"
        ]
    },

    # KIDNAPPING AND ABDUCTION
    "IPC 359": {
        "section": "IPC 359",
        "title": "Kidnapping",
        "description": "Kidnapping is of two kinds: from India, and from lawful guardianship.",
        "penalty": "Varies by type of kidnapping",
        "keywords": [
            "kidnapping", "kidnapped", "abduction", "abducted",
            "taken away", "held captive", "child lifted"
        ]
    },

    "IPC 363": {
        "section": "IPC 363",
        "title": "Punishment for kidnapping",
        "description": "Whoever kidnaps any person shall be punished...",
        "penalty": "Imprisonment up to 7 years, and fine",
        "keywords": [
            "kidnapping punishment", "abduction penalty", "held captive penalty"
        ]
    },

    "IPC 365": {
        "section": "IPC 365",
        "title": "Kidnapping or abducting with intent to confine",
        "description": "Whoever kidnaps or abducts to wrongfully confine a person...",
        "penalty": "Imprisonment up to 7 years, and fine",
        "keywords": [
            "wrongful confinement", "abduction confinement",
            "held secretly", "kept captive", "locked up"
        ]
    },

    # EXTORTION
    "IPC 383": {
        "section": "IPC 383",
        "title": "Extortion",
        "description": "Whoever puts in fear of injury to dishonestly induce delivery...",
        "penalty": "Imprisonment up to 3 years, or fine, or both",
        "keywords": [
            "extortion", "blackmail", "threat for money",
            "forced payment", "demanded money", "ransom"
        ]
    },

    "IPC 384": {
        "section": "IPC 384",
        "title": "Punishment for extortion",
        "description": "Whoever commits extortion shall be punished...",
        "penalty": "Imprisonment up to 3 years, or fine, or both",
        "keywords": [
            "extortion punishment", "blackmail penalty", "ransom punishment"
        ]
    },

    # HOUSE TRESPASS
    "IPC 441": {
        "section": "IPC 441",
        "title": "Criminal trespass",
        "description": "Whoever enters into property with intent to commit offence...",
        "penalty": "Imprisonment up to 3 months, or fine up to Rs. 500, or both",
        "keywords": [
            "trespass", "trespassing", "criminal trespass",
            "illegal entry", "unauthorized entry", "broke in"
        ]
    },

    "IPC 448": {
        "section": "IPC 448",
        "title": "Punishment for house-trespass",
        "description": "Whoever commits house-trespass shall be punished...",
        "penalty": "Imprisonment up to 1 year, or fine up to Rs. 1000, or both",
        "keywords": [
            "house trespass punishment", "illegal entry penalty"
        ]
    },

    # FORGERY
    "IPC 463": {
        "section": "IPC 463",
        "title": "Forgery",
        "description": "Whoever makes false documents or records to cause damage...",
        "penalty": "Imprisonment up to 2 years, or fine, or both",
        "keywords": [
            "forgery", "forged document", "fake document",
            "false record", "counterfeit", "fraudulent document"
        ]
    },

    "IPC 465": {
        "section": "IPC 465",
        "title": "Punishment for forgery",
        "description": "Whoever commits forgery shall be punished...",
        "penalty": "Imprisonment up to 2 years, or fine, or both",
        "keywords": [
            "forgery punishment", "fake document penalty"
        ]
    },

    # CRIMINAL CONSPIRACY
    "IPC 120A": {
        "section": "IPC 120A",
        "title": "Definition of criminal conspiracy",
        "description": "When two or more persons agree to do an illegal act...",
        "penalty": "Same as for the offence conspired to be committed",
        "keywords": [
            "criminal conspiracy", "planned crime", "collusion",
            "plot", "agreement to commit crime"
        ]
    },

    "IPC 120B": {
        "section": "IPC 120B",
        "title": "Punishment of criminal conspiracy",
        "description": "Whoever is party to a conspiracy shall be punished...",
        "penalty": "Same as for the offence conspired to be committed",
        "keywords": [
            "conspiracy punishment", "criminal plot penalty", "collusion punishment"
        ]
    }
}


def get_ipc_section(section_number):
    """Get IPC section details by section number."""
    return IPC_DATABASE.get(section_number, None)

def get_all_sections():
    """Get all IPC sections."""
    return IPC_DATABASE

def search_sections_by_keyword(keyword):
    """Search IPC sections by keyword."""
    matching_sections = []
    keyword_lower = keyword.lower()
    
    for section_num, section_data in IPC_DATABASE.items():
        if (keyword_lower in section_data['title'].lower() or 
            keyword_lower in section_data['description'].lower() or
            any(keyword_lower in kw.lower() for kw in section_data['keywords'])):
            matching_sections.append(section_data)
    
    return matching_sections

def get_sections_by_category():
    """Get IPC sections organized by category."""
    categories = {
        "Theft and Related": ["IPC 378", "IPC 379", "IPC 380"],
        "Robbery and Dacoity": ["IPC 390", "IPC 392", "IPC 395"],
        "Assault and Hurt": ["IPC 319", "IPC 320", "IPC 324"],
        "Murder and Homicide": ["IPC 299", "IPC 300", "IPC 302"],
        "Sexual Offenses": ["IPC 375", "IPC 376"],
        "Fraud and Cheating": ["IPC 415", "IPC 420"],
        "Criminal Breach of Trust": ["IPC 405", "IPC 406"],
        "Defamation": ["IPC 499", "IPC 500"],
        "Criminal Intimidation": ["IPC 503", "IPC 506"],
        "Kidnapping and Abduction": ["IPC 359", "IPC 363", "IPC 365"],
        "Extortion": ["IPC 383", "IPC 384"],
        "House Trespass": ["IPC 441", "IPC 448"],
        "Forgery": ["IPC 463", "IPC 465"],
        "Criminal Conspiracy": ["IPC 120A", "IPC 120B"]
    }
    
    result = {}
    for category, section_nums in categories.items():
        result[category] = [IPC_DATABASE[section] for section in section_nums if section in IPC_DATABASE]
    
    return result
