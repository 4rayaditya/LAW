import { useAuth } from '../hooks/useAuth'
import { Scale, Users, Gavel, Search, BookOpen, AlertCircle, Shield, Clock, ArrowRight, RefreshCw, FileText, ArrowLeftRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

// IPC Database - Comprehensive Indian Penal Code sections
const IPC_DATABASE = {
  "IPC 378": {
    "section": "IPC 378",
    "title": "Theft",
    "description": "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
    "penalty": "Imprisonment up to 3 years, or fine, or both",
    "keywords": ["theft", "steal", "stole", "stolen", "dishonestly", "without consent", "moveable property", "pickpocket", "robbed", "burglary", "shoplifting", "snatching"]
  },
  "IPC 379": {
    "section": "IPC 379",
    "title": "Punishment for theft",
    "description": "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
    "penalty": "Imprisonment up to 3 years, or fine, or both",
    "keywords": ["theft", "steal", "stole", "stolen", "stealing", "punishment", "robbery", "caught stealing"]
  },
  "IPC 380": {
    "section": "IPC 380",
    "title": "Theft in dwelling house, etc.",
    "description": "Whoever commits theft in any building, tent or vessel, which building, tent or vessel is used as a human dwelling, or used for the custody of property, shall be punished.",
    "penalty": "Imprisonment up to 7 years, and fine",
    "keywords": ["theft", "house theft", "home burglary", "dwelling house", "building theft", "stole from home", "house break-in", "broke into"]
  },
  "IPC 390": {
    "section": "IPC 390",
    "title": "Robbery",
    "description": "In all robbery there is either theft or extortion...",
    "penalty": "Imprisonment up to 10 years, and fine",
    "keywords": ["robbery", "robbed", "robbing", "snatching", "extortion", "threatened and stole", "hold up", "mugging", "armed robbery", "loot", "took by force"]
  },
  "IPC 392": {
    "section": "IPC 392",
    "title": "Punishment for robbery",
    "description": "Whoever commits robbery shall be punished...",
    "penalty": "Rigorous imprisonment up to 10 years, and fine",
    "keywords": ["robbery", "punishment", "rigorous imprisonment", "armed robbery", "mugged"]
  },
  "IPC 395": {
    "section": "IPC 395",
    "title": "Dacoity",
    "description": "When five or more persons conjointly commit robbery...",
    "penalty": "Imprisonment for life, or rigorous imprisonment up to 10 years, and fine",
    "keywords": ["dacoity", "gang robbery", "five persons robbery", "group robbery", "conjoint robbery", "bandits", "looting gang"]
  },
  "IPC 319": {
    "section": "IPC 319",
    "title": "Hurt",
    "description": "Whoever causes bodily pain, disease or infirmity to any person is said to cause hurt.",
    "penalty": "Imprisonment up to 1 year, or fine up to Rs. 1000, or both",
    "keywords": ["hurt", "injury", "injured", "bodily pain", "disease", "infirmity", "beaten", "assaulted", "slapped", "hit", "attacked"]
  },
  "IPC 320": {
    "section": "IPC 320",
    "title": "Grievous hurt",
    "description": "The following kinds of hurt only are designated as 'grievous'...",
    "penalty": "Imprisonment up to 7 years, and fine",
    "keywords": ["grievous hurt", "serious injury", "fracture", "dislocation", "disfiguration", "broken bone", "permanent damage", "serious harm", "maimed"]
  },
  "IPC 324": {
    "section": "IPC 324",
    "title": "Voluntarily causing hurt by dangerous weapons or means",
    "description": "Whoever... causes hurt by weapons, fire, poison, explosives...",
    "penalty": "Imprisonment up to 3 years, or fine, or both",
    "keywords": ["weapon attack", "knife stab", "gunshot", "acid attack", "fire injury", "poisoned", "explosion injury", "dangerous weapon"]
  },
  "IPC 299": {
    "section": "IPC 299",
    "title": "Culpable homicide",
    "description": "Whoever causes death by doing an act with the intention...",
    "penalty": "Imprisonment for life, or imprisonment up to 10 years, and fine",
    "keywords": ["culpable homicide", "caused death", "manslaughter", "unintentional killing", "negligent killing"]
  },
  "IPC 300": {
    "section": "IPC 300",
    "title": "Murder",
    "description": "Culpable homicide is murder, if the act is done with intention...",
    "penalty": "Death, or imprisonment for life, and fine",
    "keywords": ["murder", "murdered", "killed", "killing", "slay", "slain", "homicide", "took his life", "stabbed to death", "shot dead", "beaten to death"]
  },
  "IPC 302": {
    "section": "IPC 302",
    "title": "Punishment for murder",
    "description": "Whoever commits murder shall be punished...",
    "penalty": "Death, or imprisonment for life, and fine",
    "keywords": ["murder punishment", "death penalty", "life imprisonment", "capital punishment"]
  },
  "IPC 375": {
    "section": "IPC 375",
    "title": "Rape",
    "description": "A man is said to commit 'rape' if he penetrates...",
    "penalty": "Rigorous imprisonment not less than 10 years, may extend to life imprisonment, and fine",
    "keywords": ["rape", "raped", "sexual assault", "molestation", "forced intercourse", "sexual violence", "without consent", "against her will", "forced himself", "abused sexually"]
  },
  "IPC 376": {
    "section": "IPC 376",
    "title": "Punishment for rape",
    "description": "Whoever commits rape shall be punished...",
    "penalty": "Rigorous imprisonment not less than 10 years, may extend to life imprisonment, and fine",
    "keywords": ["rape punishment", "rigorous imprisonment", "life imprisonment", "sexual assault punishment"]
  },
  "IPC 415": {
    "section": "IPC 415",
    "title": "Cheating",
    "description": "Whoever, by deceiving any person, fraudulently induces...",
    "penalty": "Imprisonment up to 1 year, or fine, or both",
    "keywords": ["cheating", "deceived", "fraud", "dishonest", "scam", "trick", "misled", "conned", "swindled"]
  },
  "IPC 420": {
    "section": "IPC 420",
    "title": "Cheating and dishonestly inducing delivery of property",
    "description": "Whoever cheats and dishonestly induces delivery of property...",
    "penalty": "Imprisonment up to 7 years, and fine",
    "keywords": ["cheating", "scam", "fraud", "dishonestly induced", "delivery of property", "scammed", "fake deal", "fraudulent contract", "swindled"]
  },
  "IPC 405": {
    "section": "IPC 405",
    "title": "Criminal breach of trust",
    "description": "Whoever, entrusted with property, dishonestly misappropriates...",
    "penalty": "Imprisonment up to 3 years, or fine, or both",
    "keywords": ["criminal breach of trust", "embezzlement", "misappropriation", "property misuse", "betrayal of trust"]
  },
  "IPC 406": {
    "section": "IPC 406",
    "title": "Punishment for criminal breach of trust",
    "description": "Whoever commits criminal breach of trust shall be punished...",
    "penalty": "Imprisonment up to 3 years, or fine, or both",
    "keywords": ["punishment breach of trust", "embezzlement penalty"]
  },
  "IPC 499": {
    "section": "IPC 499",
    "title": "Defamation",
    "description": "Whoever makes or publishes any imputation harming reputation...",
    "penalty": "Simple imprisonment up to 2 years, or fine, or both",
    "keywords": ["defamation", "defame", "slander", "libel", "character assassination", "false allegations", "harm reputation"]
  },
  "IPC 500": {
    "section": "IPC 500",
    "title": "Punishment for defamation",
    "description": "Whoever defames another shall be punished...",
    "penalty": "Simple imprisonment up to 2 years, or fine, or both",
    "keywords": ["defamation punishment", "slander penalty", "libel penalty"]
  },
  "IPC 503": {
    "section": "IPC 503",
    "title": "Criminal intimidation",
    "description": "Whoever threatens another with injury to cause alarm...",
    "penalty": "Imprisonment up to 2 years, or fine, or both",
    "keywords": ["criminal intimidation", "threat", "threatened", "blackmail", "fear", "intimidated", "scared"]
  },
  "IPC 506": {
    "section": "IPC 506",
    "title": "Punishment for criminal intimidation",
    "description": "Whoever commits the offence of criminal intimidation shall be punished...",
    "penalty": "Imprisonment up to 2 years, or fine, or both",
    "keywords": ["intimidation punishment", "blackmail penalty", "threat penalty"]
  },
  "IPC 359": {
    "section": "IPC 359",
    "title": "Kidnapping",
    "description": "Kidnapping is of two kinds: from India, and from lawful guardianship.",
    "penalty": "Varies by type of kidnapping",
    "keywords": ["kidnapping", "kidnapped", "abduction", "abducted", "taken away", "held captive", "child lifted"]
  },
  "IPC 363": {
    "section": "IPC 363",
    "title": "Punishment for kidnapping",
    "description": "Whoever kidnaps any person shall be punished...",
    "penalty": "Imprisonment up to 7 years, and fine",
    "keywords": ["kidnapping punishment", "abduction penalty", "held captive penalty"]
  },
  "IPC 365": {
    "section": "IPC 365",
    "title": "Kidnapping or abducting with intent to confine",
    "description": "Whoever kidnaps or abducts to wrongfully confine a person...",
    "penalty": "Imprisonment up to 7 years, and fine",
    "keywords": ["wrongful confinement", "abduction confinement", "held secretly", "kept captive", "locked up"]
  },
  "IPC 383": {
    "section": "IPC 383",
    "title": "Extortion",
    "description": "Whoever puts in fear of injury to dishonestly induce delivery...",
    "penalty": "Imprisonment up to 3 years, or fine, or both",
    "keywords": ["extortion", "blackmail", "threat for money", "forced payment", "demanded money", "ransom"]
  },
  "IPC 384": {
    "section": "IPC 384",
    "title": "Punishment for extortion",
    "description": "Whoever commits extortion shall be punished...",
    "penalty": "Imprisonment up to 3 years, or fine, or both",
    "keywords": ["extortion punishment", "blackmail penalty", "ransom punishment"]
  },
  "IPC 441": {
    "section": "IPC 441",
    "title": "Criminal trespass",
    "description": "Whoever enters into property with intent to commit offence...",
    "penalty": "Imprisonment up to 3 months, or fine up to Rs. 500, or both",
    "keywords": ["trespass", "trespassing", "criminal trespass", "illegal entry", "unauthorized entry", "broke in"]
  },
  "IPC 448": {
    "section": "IPC 448",
    "title": "Punishment for house-trespass",
    "description": "Whoever commits house-trespass shall be punished...",
    "penalty": "Imprisonment up to 1 year, or fine up to Rs. 1000, or both",
    "keywords": ["house trespass punishment", "illegal entry penalty"]
  },
  "IPC 463": {
    "section": "IPC 463",
    "title": "Forgery",
    "description": "Whoever makes false documents or records to cause damage...",
    "penalty": "Imprisonment up to 2 years, or fine, or both",
    "keywords": ["forgery", "forged document", "fake document", "false record", "counterfeit", "fraudulent document"]
  },
  "IPC 465": {
    "section": "IPC 465",
    "title": "Punishment for forgery",
    "description": "Whoever commits forgery shall be punished...",
    "penalty": "Imprisonment up to 2 years, or fine, or both",
    "keywords": ["forgery punishment", "fake document penalty"]
  },
  "IPC 120A": {
    "section": "IPC 120A",
    "title": "Definition of criminal conspiracy",
    "description": "When two or more persons agree to do an illegal act...",
    "penalty": "Same as for the offence conspired to be committed",
    "keywords": ["criminal conspiracy", "planned crime", "collusion", "plot", "agreement to commit crime"]
  },
  "IPC 120B": {
    "section": "IPC 120B",
    "title": "Punishment of criminal conspiracy",
    "description": "Whoever is party to a conspiracy shall be punished...",
    "penalty": "Same as for the offence conspired to be committed",
    "keywords": ["conspiracy punishment", "criminal plot penalty", "collusion punishment"]
  },
  "IPC 34": {
    "section": "IPC 34",
    "title": "Acts done by several persons in furtherance of common intention",
    "description": "When a criminal act is done by several persons in furtherance of the common intention of all, each of such persons is liable for that act in the same manner as if it were done by him alone.",
    "penalty": "Same as for the principal offence committed.",
    "keywords": ["common intention", "vicarious liability", "group crime", "joint liability", "in furtherance of"]
  },
  "IPC 109": {
    "section": "IPC 109",
    "title": "Punishment of abetment",
    "description": "Whoever abets any offence shall, if the act abetted is committed in consequence of the abetment, and no express provision is made for its punishment, be punished with the punishment provided for the offence.",
    "penalty": "Same as for the offence abetted.",
    "keywords": ["abetment", "instigation", "conspiracy", "aiding", "helping commit crime", "accessory"]
  },
  "IPC 124A": {
    "section": "IPC 124A",
    "title": "Sedition",
    "description": "Whoever, by words, either spoken or written, or by signs, or by visible representation, or otherwise, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards the Government.",
    "penalty": "Imprisonment for life and fine, or Imprisonment up to 3 years and fine, or fine.",
    "keywords": ["sedition", "anti-national", "disaffection", "hatred against government", "contempt of government"]
  },
  "IPC 141": {
    "section": "IPC 141",
    "title": "Unlawful assembly",
    "description": "An assembly of five or more persons is designated an 'unlawful assembly', if the common object of the persons composing that assembly is to commit any of various specified illegal acts.",
    "penalty": "Punishable under IPC 143.",
    "keywords": ["unlawful assembly", "five or more persons", "common object", "rioting", "mob"]
  },
  "IPC 147": {
    "section": "IPC 147",
    "title": "Punishment for rioting",
    "description": "Whoever is guilty of rioting, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
    "penalty": "Imprisonment up to 2 years, or fine, or both.",
    "keywords": ["rioting", "riot", "mob violence", "public tranquility", "punishment for riot"]
  },
  "IPC 188": {
    "section": "IPC 188",
    "title": "Disobedience to order duly promulgated by public servant",
    "description": "Whoever, knowing that an order is promulgated by a public servant, disobeys such order, shall be punished if such disobedience causes obstruction, annoyance or injury.",
    "penalty": "Simple imprisonment up to 1 month or fine up to Rs. 200, or (if it causes danger to human life) Imprisonment up to 6 months, or fine up to Rs. 1000, or both.",
    "keywords": ["disobedience", "public order", "violation", "curfew violation", "section 144 violation", "lockdown violation"]
  },
  "IPC 191": {
    "section": "IPC 191",
    "title": "Giving false evidence",
    "description": "Whoever, being legally bound by an oath or by an express provision of law to state the truth, makes any statement which is false, and which he either knows or believes to be false or does not believe to be true, is said to give false evidence.",
    "penalty": "Punishable under IPC 193.",
    "keywords": ["false evidence", "perjury", "lying in court", "false statement", "lying under oath", "false testimony"]
  },
  "IPC 193": {
    "section": "IPC 193",
    "title": "Punishment for false evidence",
    "description": "Whoever intentionally gives false evidence in any stage of a judicial proceeding, or fabricates false evidence for that purpose, shall be punished with imprisonment up to 7 years, and fine.",
    "penalty": "Imprisonment up to 7 years, and fine.",
    "keywords": ["perjury punishment", "false evidence punishment", "lying in court penalty"]
  },
  "IPC 201": {
    "section": "IPC 201",
    "title": "Causing disappearance of evidence of offence",
    "description": "Whoever, knowing or having reason to believe that an offence has been committed, causes any evidence of the commission of that offence to disappear, with the intention of screening the offender from legal punishment.",
    "penalty": "Varies based on the offence. Up to 7 years if the offence is capital; up to 3 years if punishable with 10+ years; up to 1/4 part of the term for other offences.",
    "keywords": ["destroying evidence", "hiding evidence", "screening offender", "disappearance of evidence", "tampering with evidence"]
  },
  "IPC 279": {
    "section": "IPC 279",
    "title": "Rash driving or riding on a public way",
    "description": "Whoever drives any vehicle, or rides, on any public way in a manner so rash or negligent as to endanger human life, or to be likely to cause hurt or injury to any other person.",
    "penalty": "Imprisonment up to 6 months, or fine up to Rs. 1000, or both.",
    "keywords": ["rash driving", "negligent driving", "speeding", "dangerous driving", "road accident", "hit and run"]
  },
  "IPC 295A": {
    "section": "IPC 295A",
    "title": "Deliberate and malicious acts intended to outrage religious feelings",
    "description": "Whoever, with deliberate and malicious intention of outraging the religious feelings of any class of citizens, by words, signs or visible representations, insults or attempts to insult the religion or religious beliefs of that class.",
    "penalty": "Imprisonment up to 3 years, or fine, or both.",
    "keywords": ["blasphemy", "religious insult", "outraging religious feelings", "hate speech", "hurting sentiments"]
  },
  "IPC 304A": {
    "section": "IPC 304A",
    "title": "Causing death by negligence",
    "description": "Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide.",
    "penalty": "Imprisonment up to 2 years, or fine, or both.",
    "keywords": ["death by negligence", "negligent act", "rash act causing death", "accidental death", "medical negligence", "fatal accident"]
  },
  "IPC 304B": {
    "section": "IPC 304B",
    "title": "Dowry death",
    "description": "Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative for, or in connection with, any demand for dowry.",
    "penalty": "Imprisonment not less than 7 years, may extend to imprisonment for life.",
    "keywords": ["dowry death", "dowry harassment", "cruelty by husband", "bride burning", "within 7 years"]
  },
  "IPC 306": {
    "section": "IPC 306",
    "title": "Abetment of suicide",
    "description": "If any person commits suicide, whoever abets the commission of such suicide, shall be punished.",
    "penalty": "Imprisonment up to 10 years, and fine.",
    "keywords": ["abetment of suicide", "driving to suicide", "suicide", "instigated suicide", "harassment leading to suicide"]
  },
  "IPC 307": {
    "section": "IPC 307",
    "title": "Attempt to murder",
    "description": "Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder.",
    "penalty": "Imprisonment up to 10 years, and fine. If hurt is caused, may extend to Imprisonment for life.",
    "keywords": ["attempt to murder", "attempted murder", "tried to kill", "attacked with intent to kill", "half murder"]
  },
  "IPC 354": {
    "section": "IPC 354",
    "title": "Assault or criminal force to woman with intent to outrage her modesty",
    "description": "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty.",
    "penalty": "Imprisonment not less than 1 year, may extend to 5 years, and fine.",
    "keywords": ["outraging modesty", "molestation", "sexual harassment", "assault on woman", "groping", "inappropriate touch"]
  },
  "IPC 354D": {
    "section": "IPC 354D",
    "title": "Stalking",
    "description": "Any man who follows a woman or contacts, or attempts to contact such woman to foster personal interaction repeatedly despite a clear indication of disinterest by such woman; or monitors the use by a woman of the internet, email or any other form of electronic communication.",
    "penalty": "First conviction: Imprisonment up to 3 years, and fine. Second conviction: Imprisonment up to 5 years, and fine.",
    "keywords": ["stalking", "cyberstalking", "following", "harassing", "unwanted contact", "monitoring online"]
  },
  "IPC 425": {
    "section": "IPC 425",
    "title": "Mischief",
    "description": "Whoever with intent to cause, or knowing that he is likely to cause, wrongful loss or damage to the public or to any person, causes the destruction of any property, or any such change in any property... is said to commit 'mischief'.",
    "penalty": "Punishable under IPC 426: Imprisonment up to 3 months, or fine, or both.",
    "keywords": ["mischief", "vandalism", "property damage", "destroyed property", "breaking things"]
  },
  "IPC 498A": {
    "section": "IPC 498A",
    "title": "Husband or relative of husband of a woman subjecting her to cruelty",
    "description": "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty (mental or physical harassment, dowry demands).",
    "penalty": "Imprisonment up to 3 years, and fine.",
    "keywords": ["dowry", "cruelty", "husband cruelty", "in-law harassment", "domestic violence", "mental torture", "dowry demand"]
  },
  "IPC 511": {
    "section": "IPC 511",
    "title": "Punishment for attempting to commit offences",
    "description": "Whoever attempts to commit an offence punishable with imprisonment for life or other imprisonment and in such attempt does any act towards the commission of the offence.",
    "penalty": "Imprisonment for life or imprisonment for a term up to one-half of the longest term provided for that offence, or with such fine as is provided, or both.",
    "keywords": ["attempt", "attempted crime", "failed attempt", "towards commission of", "catch-all attempt"]
  },
  "IPC 100": {
    "section": "IPC 100",
    "title": "When the right of private defence of the body extends to causing death",
    "description": "The right of private defence of the body extends to the voluntary causing of death if the offence which occasions the exercise of the right be an assault causing reasonable apprehension of death or grievous hurt; assault to commit rape; assault to gratify unnatural lust; assault to kidnap or abduct; or assault to wrongfully confine.",
    "penalty": "Justifiable homicide (No punishment).",
    "keywords": ["private defence", "self-defense", "justifiable homicide", "causing death", "rape attempt", "kidnapping attempt", "assault"]
  },
  "IPC 121": {
    "section": "IPC 121",
    "title": "Waging, or attempting to wage war, or abetting waging of war, against the Government of India",
    "description": "Whoever wages war against the Government of India, or attempts to wage such war, or abets the waging of such war, shall be punished.",
    "penalty": "Death, or imprisonment for life, and fine.",
    "keywords": ["waging war", "treason", "rebellion", "insurrection", "sedition", "against government"]
  },
  "IPC 143": {
    "section": "IPC 143",
    "title": "Punishment for unlawful assembly",
    "description": "Whoever is a member of an unlawful assembly, shall be punished with imprisonment of either description for a term which may extend to six months, or with fine, or with both.",
    "penalty": "Imprisonment up to 6 months, or fine, or both.",
    "keywords": ["unlawful assembly", "punishment", "member of mob", "group crime penalty"]
  },
  "IPC 149": {
    "section": "IPC 149",
    "title": "Every member of unlawful assembly guilty of offence committed in prosecution of common object",
    "description": "If an offence is committed by any member of an unlawful assembly in prosecution of the common object of that assembly, every person who, at the time of the committing of that offence, is a member of the same assembly, is guilty of that offence.",
    "penalty": "Same as for the principal offence committed.",
    "keywords": ["common object", "vicarious liability", "joint liability", "group crime", "unlawful assembly member"]
  },
  "IPC 153A": {
    "section": "IPC 153A",
    "title": "Promoting enmity between different groups on grounds of religion, race, place of birth, etc.",
    "description": "Whoever, by words, either spoken or written, or by signs or by visible representations or otherwise, promotes or attempts to promote enmity between different groups on grounds of religion, race, place of birth, residence, language, etc., and doing acts prejudicial to maintenance of harmony.",
    "penalty": "Imprisonment up to 3 years, or fine, or both.",
    "keywords": ["hate speech", "promoting enmity", "communal disharmony", "religious hatred", "race", "prejudicial act"]
  },
  "IPC 160": {
    "section": "IPC 160",
    "title": "Punishment for committing affray",
    "description": "Whoever commits affray (defined as two or more persons fighting in a public place and disturbing the public peace) shall be punished.",
    "penalty": "Simple imprisonment up to 1 month, or fine up to Rs. 100, or both.",
    "keywords": ["affray", "public fighting", "disturbing the peace", "brawl", "public nuisance"]
  },
  "IPC 186": {
    "section": "IPC 186",
    "title": "Obstructing public servant in discharge of public functions",
    "description": "Whoever voluntarily obstructs any public servant in the discharge of his public functions, shall be punished.",
    "penalty": "Imprisonment up to 3 months, or fine up to Rs. 500, or both.",
    "keywords": ["obstructing", "public servant", "interfering with police", "stopping official duty", "preventing duty"]
  },
  "IPC 212": {
    "section": "IPC 212",
    "title": "Harbouring offender",
    "description": "Whenever an offence has been committed, whoever harbours or conceals a person whom he knows or has reason to believe to be the offender, with the intention of screening him from legal punishment.",
    "penalty": "Varies. If capital offence: Imprisonment up to 5 years and fine. If offence is punishable with imprisonment for life or up to 10 years: Imprisonment up to 3 years, with or without fine.",
    "keywords": ["harbouring", "hiding criminal", "screening offender", "aiding fugitive", "concealing offender"]
  },
  "IPC 269": {
    "section": "IPC 269",
    "title": "Negligent act likely to spread infection of disease dangerous to life",
    "description": "Whoever unlawfully or negligently does any act which is, and which he knows or has reason to believe to be, likely to spread the infection of any disease dangerous to life.",
    "penalty": "Imprisonment up to 6 months, or fine, or both.",
    "keywords": ["negligent act", "spread disease", "infection", "contagious", "epidemic", "quarantine violation"]
  },
  "IPC 272": {
    "section": "IPC 272",
    "title": "Adulteration of food or drink intended for sale",
    "description": "Whoever adulterates any article of food or drink, so as to make such article noxious as food or drink, intending to sell such article... or knowing it to be likely that the same will be sold.",
    "penalty": "Imprisonment up to 6 months, or fine up to Rs. 1000, or both.",
    "keywords": ["food adulteration", "adulterated food", "noxious food", "unsafe food", "mixing food"]
  },
  "IPC 295": {
    "section": "IPC 295",
    "title": "Injuring or defiling place of worship with intent to insult the religion of any class",
    "description": "Whoever destroys, damages or defiles any place of worship, or any object held sacred by any class of persons with the intention of thereby insulting the religion of any class... or with the knowledge that any class of persons is likely to consider such destruction, damage or defilement as an insult to their religion.",
    "penalty": "Imprisonment up to 2 years, or fine, or both.",
    "keywords": ["sacrilege", "defiling temple", "damaging mosque", "insulting worship", "destroying church", "place of worship"]
  },
  "IPC 323": {
    "section": "IPC 323",
    "title": "Punishment for voluntarily causing hurt",
    "description": "Whoever, except in the case provided for by section 334 (grave provocation), voluntarily causes hurt (defined in IPC 319), shall be punished.",
    "penalty": "Imprisonment up to 1 year, or fine up to Rs. 1000, or both.",
    "keywords": ["punishment for hurt", "simple hurt", "simple assault", "beating", "slapped", "hit penalty"]
  },
  "IPC 325": {
    "section": "IPC 325",
    "title": "Punishment for voluntarily causing grievous hurt",
    "description": "Whoever, except in the case provided for by section 335 (grave provocation), voluntarily causes grievous hurt (defined in IPC 320), shall be punished.",
    "penalty": "Imprisonment up to 7 years, and fine.",
    "keywords": ["grievous hurt punishment", "serious injury", "caused fracture", "broken bone penalty", "maimed"]
  },
  "IPC 326A": {
    "section": "IPC 326A",
    "title": "Voluntarily causing grievous hurt by use of acid, etc.",
    "description": "Whoever causes permanent or partial damage or deformity to, or burns or maims or disfigures or disables, any part of the body by throwing acid or administering acid to that person, or by using any other means with the intention of causing or knowing that he is likely to cause such injury or hurt.",
    "penalty": "Rigorous imprisonment not less than 10 years, may extend to life imprisonment, and fine (which shall be just and reasonable to meet the medical expenses of the victim).",
    "keywords": ["acid attack", "throwing acid", "corrosive substance", "disfigurement", "permanent damage", "acid burn"]
  },
  "IPC 341": {
    "section": "IPC 341",
    "title": "Punishment for wrongful restraint",
    "description": "Whoever wrongfully restrains any person shall be punished.",
    "penalty": "Simple imprisonment up to 1 month, or fine up to Rs. 500, or both.",
    "keywords": ["wrongful restraint", "blocking path", "obstructing", "preventing movement", "stopped someone"]
  },
  "IPC 342": {
    "section": "IPC 342",
    "title": "Punishment for wrongful confinement",
    "description": "Whoever wrongfully confines any person shall be punished.",
    "penalty": "Imprisonment up to 1 year, or fine up to Rs. 1000, or both.",
    "keywords": ["wrongful confinement", "locking up", "detained", "held against will", "locked in room"]
  },
  "IPC 354A": {
    "section": "IPC 354A",
    "title": "Sexual harassment and punishment for sexual harassment",
    "description": "A man committing any of the following acts: (i) physical contact and advances involving unwelcome and explicit sexual overtures; or (ii) a demand or request for sexual favours; or (iii) showing pornography against the will of a woman; or (iv) making sexually coloured remarks.",
    "penalty": "For (i), (ii), (iii): Rigorous imprisonment up to 3 years, or fine, or both. For (iv): Imprisonment up to 1 year, or fine, or both.",
    "keywords": ["sexual harassment", "unwelcome advances", "sexual remarks", "showing porn", "demand for sexual favours", "lewd comments"]
  },
  "IPC 354C": {
    "section": "IPC 354C",
    "title": "Voyeurism",
    "description": "Any man who watches, or captures the image of a woman engaging in a private act in circumstances where she would usually have the expectation of not being observed either by the perpetrator or by any other person.",
    "penalty": "First conviction: Imprisonment (1-3 years) and fine. Second conviction: Imprisonment (3-7 years) and fine.",
    "keywords": ["voyeurism", "peeping tom", "hidden camera", "watching private act", "capturing image", "violating privacy"]
  },
  "IPC 411": {
    "section": "IPC 411",
    "title": "Dishonestly receiving stolen property",
    "description": "Whoever dishonestly receives or retains any stolen property, knowing or having reason to believe the same to be stolen property, shall be punished.",
    "penalty": "Imprisonment up to 3 years, or fine, or both.",
    "keywords": ["stolen property", "receiving stolen goods", "handling stolen goods", "dishonestly receives", "chor ka maal"]
  },
  "IPC 494": {
    "section": "IPC 494",
    "title": "Marrying again during lifetime of husband or wife (Bigamy)",
    "description": "Whoever, having a husband or wife living, marries in any case in which such marriage is void by reason of its taking place during the life of such husband or wife.",
    "penalty": "Imprisonment up to 7 years, and fine.",
    "keywords": ["bigamy", "second marriage", "marrying again", "polygamy", "void marriage", "two wives"]
  }
}

// BNS Concordance Database - Mapping old IPC to new BNS sections
const BNS_CONCORDANCE = {
  "IPC 302": {
    "oldSection": "IPC 302",
    "oldTitle": "Punishment for murder",
    "oldDescription": "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    "newSection": "BNS 103",
    "newTitle": "Murder",
    "newDescription": "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    "changes": "No significant changes in definition. Enhanced provisions for mob lynching added in separate sections.",
    "keywords": ["murder", "punishment", "death penalty", "life imprisonment"]
  },
  "IPC 420": {
    "oldSection": "IPC 420",
    "oldTitle": "Cheating and dishonestly inducing delivery of property",
    "oldDescription": "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished.",
    "newSection": "BNS 318",
    "newTitle": "Cheating",
    "newDescription": "Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, or intentionally induces the person so deceived to do or omit to do anything which he would not do or omit if he were not so deceived, and which act or omission causes or is likely to cause damage or harm to that person in body, mind, reputation or property, is said to 'cheat'.",
    "changes": "Expanded definition to include mental and reputational harm. Enhanced penalties for cyber fraud.",
    "keywords": ["cheating", "fraud", "deception", "property", "cyber fraud"]
  },
  "IPC 375": {
    "oldSection": "IPC 375",
    "oldTitle": "Rape",
    "oldDescription": "A man is said to commit 'rape' if he penetrates his penis, to any extent, into the vagina, mouth, urethra or anus of a woman or makes her to do so with him or any other person.",
    "newSection": "BNS 69",
    "newTitle": "Rape",
    "newDescription": "A man is said to commit rape if he penetrates his penis, to any extent, into the vagina, mouth, urethra or anus of a woman or makes her to do so with him or any other person, or applies his mouth to the vagina, anus, urethra of a woman or makes her to do so with him or any other person.",
    "changes": "Expanded definition to include oral sex. Enhanced protection for transgender persons. Stricter penalties for repeat offenders.",
    "keywords": ["rape", "sexual assault", "penetration", "transgender", "oral sex"]
  },
  "IPC 498A": {
    "oldSection": "IPC 498A",
    "oldTitle": "Husband or relative of husband of a woman subjecting her to cruelty",
    "oldDescription": "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished.",
    "newSection": "BNS 85",
    "newTitle": "Cruelty by husband or relative of husband",
    "newDescription": "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
    "changes": "No significant changes in definition. Enhanced provisions for protection of women from domestic violence.",
    "keywords": ["cruelty", "domestic violence", "husband", "relative", "dowry"]
  },
  "IPC 304B": {
    "oldSection": "IPC 304B",
    "oldTitle": "Dowry death",
    "oldDescription": "Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry.",
    "newSection": "BNS 80",
    "newTitle": "Dowry death",
    "newDescription": "Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry.",
    "changes": "No significant changes. Enhanced investigation procedures and stricter penalties.",
    "keywords": ["dowry death", "bride burning", "harassment", "seven years", "marriage"]
  },
  "IPC 354": {
    "oldSection": "IPC 354",
    "oldTitle": "Assault or criminal force to woman with intent to outrage her modesty",
    "oldDescription": "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished.",
    "newSection": "BNS 74",
    "newTitle": "Assault or use of criminal force to woman with intent to outrage her modesty",
    "newDescription": "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which shall not be less than one year, but which may extend to five years, and shall also be liable to fine.",
    "changes": "Enhanced penalties with minimum imprisonment of one year. Better protection for women.",
    "keywords": ["outraging modesty", "assault", "criminal force", "woman", "modesty"]
  },
  "IPC 354A": {
    "oldSection": "IPC 354A",
    "oldTitle": "Sexual harassment and punishment for sexual harassment",
    "oldDescription": "A man committing any of the following acts: (i) physical contact and advances involving unwelcome and explicit sexual overtures; or (ii) a demand or request for sexual favours; or (iii) showing pornography against the will of a woman; or (iv) making sexually coloured remarks.",
    "newSection": "BNS 75",
    "newTitle": "Sexual harassment",
    "newDescription": "A man committing any of the following acts: (i) physical contact and advances involving unwelcome and explicit sexual overtures; or (ii) a demand or request for sexual favours; or (iii) showing pornography against the will of a woman; or (iv) making sexually coloured remarks.",
    "changes": "Enhanced penalties and better workplace protection. Stricter enforcement mechanisms.",
    "keywords": ["sexual harassment", "unwelcome advances", "sexual remarks", "workplace", "pornography"]
  },
  "IPC 354D": {
    "oldSection": "IPC 354D",
    "oldTitle": "Stalking",
    "oldDescription": "Any man who follows a woman or contacts, or attempts to contact such woman to foster personal interaction repeatedly despite a clear indication of disinterest by such woman; or monitors the use by a woman of the internet, email or any other form of electronic communication.",
    "newSection": "BNS 77",
    "newTitle": "Stalking",
    "newDescription": "Any man who follows a woman or contacts, or attempts to contact such woman to foster personal interaction repeatedly despite a clear indication of disinterest by such woman; or monitors the use by a woman of the internet, email or any other form of electronic communication.",
    "changes": "Enhanced cyber stalking provisions. Better protection against digital harassment.",
    "keywords": ["stalking", "cyberstalking", "following", "harassment", "digital"]
  },
  "IPC 354C": {
    "oldSection": "IPC 354C",
    "oldTitle": "Voyeurism",
    "oldDescription": "Any man who watches, or captures the image of a woman engaging in a private act in circumstances where she would usually have the expectation of not being observed either by the perpetrator or by any other person.",
    "newSection": "BNS 76",
    "newTitle": "Voyeurism",
    "newDescription": "Any man who watches, or captures the image of a woman engaging in a private act in circumstances where she would usually have the expectation of not being observed either by the perpetrator or by any other person.",
    "changes": "Enhanced penalties for voyeurism. Better protection against hidden cameras and digital voyeurism.",
    "keywords": ["voyeurism", "peeping tom", "hidden camera", "privacy", "digital"]
  },
  "IPC 326A": {
    "oldSection": "IPC 326A",
    "oldTitle": "Voluntarily causing grievous hurt by use of acid, etc.",
    "oldDescription": "Whoever causes permanent or partial damage or deformity to, or burns or maims or disfigures or disables, any part of the body by throwing acid or administering acid to that person, or by using any other means with the intention of causing or knowing that he is likely to cause such injury or hurt.",
    "newSection": "BNS 110",
    "newTitle": "Voluntarily causing grievous hurt by use of acid, etc.",
    "newDescription": "Whoever causes permanent or partial damage or deformity to, or burns or maims or disfigures or disables, any part of the body by throwing acid or administering acid to that person, or by using any other means with the intention of causing or knowing that he is likely to cause such injury or hurt.",
    "changes": "Enhanced penalties and better victim compensation. Stricter regulation of acid sales.",
    "keywords": ["acid attack", "acid burn", "disfigurement", "permanent damage", "victim compensation"]
  },
  "IPC 299": {
    "oldSection": "IPC 299",
    "oldTitle": "Culpable homicide",
    "oldDescription": "Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death, or with the knowledge that he is likely by such act to cause death, commits the offence of culpable homicide.",
    "newSection": "BNS 102",
    "newTitle": "Culpable homicide not amounting to murder",
    "newDescription": "Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death, or with the knowledge that he is likely by such act to cause death, commits the offence of culpable homicide.",
    "changes": "No significant changes in definition. Enhanced investigation procedures.",
    "keywords": ["culpable homicide", "caused death", "manslaughter", "unintentional killing", "negligent killing"]
  },
  "IPC 300": {
    "oldSection": "IPC 300",
    "oldTitle": "Murder",
    "oldDescription": "Culpable homicide is murder, if the act is done with intention of causing death, or with intention of causing such bodily injury as the offender knows to be likely to cause the death of the person to whom the harm is caused.",
    "newSection": "BNS 103",
    "newTitle": "Murder",
    "newDescription": "Culpable homicide is murder, if the act is done with intention of causing death, or with intention of causing such bodily injury as the offender knows to be likely to cause the death of the person to whom the harm is caused.",
    "changes": "No significant changes in definition. Enhanced provisions for mob lynching added in separate sections.",
    "keywords": ["murder", "murdered", "killed", "killing", "slay", "slain", "homicide", "took his life", "stabbed to death", "shot dead", "beaten to death"]
  },
  "IPC 304A": {
    "oldSection": "IPC 304A",
    "oldTitle": "Causing death by negligence",
    "oldDescription": "Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide.",
    "newSection": "BNS 106",
    "newTitle": "Causing death by rash or negligent act",
    "newDescription": "Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide.",
    "changes": "BNS 106(1) is the direct equivalent. BNS 106(2) introduces higher penalties for hit-and-run cases.",
    "keywords": ["death by negligence", "negligent act", "rash act causing death", "accidental death", "medical negligence", "fatal accident", "hit and run"]
  },
  "IPC 306": {
    "oldSection": "IPC 306",
    "oldTitle": "Abetment of suicide",
    "oldDescription": "If any person commits suicide, whoever abets the commission of such suicide, shall be punished.",
    "newSection": "BNS 108",
    "newTitle": "Abetment of suicide",
    "newDescription": "If any person commits suicide, whoever abets the commission of such suicide, shall be punished.",
    "changes": "No significant changes in definition. Enhanced penalties and better victim support.",
    "keywords": ["abetment of suicide", "driving to suicide", "suicide", "instigated suicide", "harassment leading to suicide"]
  },
  "IPC 307": {
    "oldSection": "IPC 307",
    "oldTitle": "Attempt to murder",
    "oldDescription": "Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder.",
    "newSection": "BNS 109",
    "newTitle": "Attempt to murder",
    "newDescription": "Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder.",
    "changes": "No significant changes in definition. Enhanced penalties for repeat offenders.",
    "keywords": ["attempt to murder", "attempted murder", "tried to kill", "attacked with intent to kill", "half murder"]
  },
  "IPC 319": {
    "oldSection": "IPC 319",
    "oldTitle": "Hurt",
    "oldDescription": "Whoever causes bodily pain, disease or infirmity to any person is said to cause hurt.",
    "newSection": "BNS 113",
    "newTitle": "Definition of Hurt",
    "newDescription": "Whoever causes bodily pain, disease or infirmity to any person is said to cause hurt.",
    "changes": "No significant changes in definition. Enhanced medical evidence requirements.",
    "keywords": ["hurt", "injury", "injured", "bodily pain", "disease", "infirmity", "beaten", "assaulted", "slapped", "hit", "attacked"]
  },
  "IPC 323": {
    "oldSection": "IPC 323",
    "oldTitle": "Punishment for voluntarily causing hurt",
    "oldDescription": "Whoever, except in the case provided for by section 334 (grave provocation), voluntarily causes hurt (defined in IPC 319), shall be punished.",
    "newSection": "BNS 115(1)",
    "newTitle": "Punishment for voluntarily causing hurt",
    "newDescription": "Whoever, except in the case provided for by section 334 (grave provocation), voluntarily causes hurt (defined in BNS 113), shall be punished.",
    "changes": "No significant changes in punishment. Enhanced victim compensation provisions.",
    "keywords": ["punishment for hurt", "simple hurt", "simple assault", "beating", "slapped", "hit penalty"]
  },
  "IPC 320": {
    "oldSection": "IPC 320",
    "oldTitle": "Grievous hurt",
    "oldDescription": "The following kinds of hurt only are designated as 'grievous'...",
    "newSection": "BNS 114",
    "newTitle": "Definition of Grievous Hurt",
    "newDescription": "The following kinds of hurt only are designated as 'grievous'...",
    "changes": "No significant changes in definition. Enhanced medical evidence requirements.",
    "keywords": ["grievous hurt", "serious injury", "fracture", "dislocation", "disfiguration", "broken bone", "permanent damage", "serious harm", "maimed"]
  },
  "IPC 325": {
    "oldSection": "IPC 325",
    "oldTitle": "Punishment for voluntarily causing grievous hurt",
    "oldDescription": "Whoever, except in the case provided for by section 335 (grave provocation), voluntarily causes grievous hurt (defined in IPC 320), shall be punished.",
    "newSection": "BNS 115(2)",
    "newTitle": "Punishment for voluntarily causing grievous hurt",
    "newDescription": "Whoever, except in the case provided for by section 335 (grave provocation), voluntarily causes grievous hurt (defined in BNS 114), shall be punished.",
    "changes": "No significant changes in punishment. Enhanced victim compensation provisions.",
    "keywords": ["grievous hurt punishment", "serious injury", "caused fracture", "broken bone penalty", "maimed"]
  },
  "IPC 324": {
    "oldSection": "IPC 324",
    "oldTitle": "Voluntarily causing hurt by dangerous weapons or means",
    "oldDescription": "Whoever... causes hurt by weapons, fire, poison, explosives...",
    "newSection": "BNS 116",
    "newTitle": "Voluntarily causing hurt by dangerous weapons or means",
    "newDescription": "Whoever... causes hurt by weapons, fire, poison, explosives...",
    "changes": "No significant changes in definition. Enhanced penalties for repeat offenders.",
    "keywords": ["weapon attack", "knife stab", "gunshot", "acid attack", "fire injury", "poisoned", "explosion injury", "dangerous weapon"]
  },
  "IPC 376": {
    "oldSection": "IPC 376",
    "oldTitle": "Punishment for rape",
    "oldDescription": "Whoever commits rape shall be punished...",
    "newSection": "BNS 64",
    "newTitle": "Punishment for rape",
    "newDescription": "Whoever commits rape shall be punished...",
    "changes": "No significant changes in punishment. Enhanced victim support and rehabilitation.",
    "keywords": ["rape punishment", "rigorous imprisonment", "life imprisonment", "sexual assault punishment"]
  },
  "IPC 378": {
    "oldSection": "IPC 378",
    "oldTitle": "Theft",
    "oldDescription": "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
    "newSection": "BNS 303",
    "newTitle": "Theft",
    "newDescription": "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
    "changes": "Single section contains both definition and punishment. Enhanced penalties for repeat offenders.",
    "keywords": ["theft", "steal", "steals", "stole", "stolen", "dishonestly", "without consent", "moveable property", "pickpocket", "pickpocketing", "robbed", "robbery", "burglary", "shoplifting", "snatching", "snatched", "took away", "grabbed"]
  },
  "IPC 379": {
    "oldSection": "IPC 379",
    "oldTitle": "Punishment for theft",
    "oldDescription": "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
    "newSection": "BNS 303",
    "newTitle": "Theft (includes punishment)",
    "newDescription": "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
    "changes": "Merged with definition in single section. Enhanced penalties for repeat offenders.",
    "keywords": ["theft", "steal", "stole", "stolen", "stealing", "punishment", "robbery", "caught stealing"]
  },
  "IPC 380": {
    "oldSection": "IPC 380",
    "oldTitle": "Theft in dwelling house, etc.",
    "oldDescription": "Whoever commits theft in any building, tent or vessel, which building, tent or vessel is used as a human dwelling, or used for the custody of property, shall be punished.",
    "newSection": "BNS 304",
    "newTitle": "Theft in dwelling house, etc.",
    "newDescription": "Whoever commits theft in any building, tent or vessel, which building, tent or vessel is used as a human dwelling, or used for the custody of property, shall be punished.",
    "changes": "No significant changes in definition. Enhanced penalties for repeat offenders.",
    "keywords": ["theft", "house theft", "home burglary", "dwelling house", "building theft", "tent theft", "stole from home", "custody theft", "house break-in", "broke into"]
  },
  "IPC 390": {
    "oldSection": "IPC 390",
    "oldTitle": "Robbery",
    "oldDescription": "In all robbery there is either theft or extortion...",
    "newSection": "BNS 307",
    "newTitle": "Robbery",
    "newDescription": "In all robbery there is either theft or extortion...",
    "changes": "Single section contains both definition and punishment. Enhanced penalties for armed robbery.",
    "keywords": ["robbery", "robbed", "robbing", "snatching", "extortion", "threatened and stole", "hold up", "mugging", "armed robbery", "loot", "looted", "took by force"]
  },
  "IPC 392": {
    "oldSection": "IPC 392",
    "oldTitle": "Punishment for robbery",
    "oldDescription": "Whoever commits robbery shall be punished...",
    "newSection": "BNS 307",
    "newTitle": "Robbery (includes punishment)",
    "newDescription": "Whoever commits robbery shall be punished...",
    "changes": "Merged with definition in single section. Enhanced penalties for armed robbery.",
    "keywords": ["robbery", "punishment", "rigorous imprisonment", "armed robbery", "mugged"]
  },
  "IPC 395": {
    "oldSection": "IPC 395",
    "oldTitle": "Dacoity",
    "oldDescription": "When five or more persons conjointly commit robbery...",
    "newSection": "BNS 308",
    "newTitle": "Dacoity",
    "newDescription": "When five or more persons conjointly commit robbery...",
    "changes": "Single section contains both definition and punishment. Enhanced penalties for organized crime.",
    "keywords": ["dacoity", "gang robbery", "five persons robbery", "group robbery", "conjoint robbery", "bandits", "looting gang"]
  },
  "IPC 405": {
    "oldSection": "IPC 405",
    "oldTitle": "Criminal breach of trust",
    "oldDescription": "Whoever, entrusted with property, dishonestly misappropriates...",
    "newSection": "BNS 314",
    "newTitle": "Criminal breach of trust",
    "newDescription": "Whoever, entrusted with property, dishonestly misappropriates...",
    "changes": "Single section contains both definition and punishment. Enhanced penalties for financial crimes.",
    "keywords": ["criminal breach of trust", "embezzlement", "misappropriation", "property misuse", "betrayal of trust"]
  },
  "IPC 415": {
    "oldSection": "IPC 415",
    "oldTitle": "Cheating",
    "oldDescription": "Whoever, by deceiving any person, fraudulently induces...",
    "newSection": "BNS 316",
    "newTitle": "Cheating",
    "newDescription": "Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, or intentionally induces the person so deceived to do or omit to do anything which he would not do or omit if he were not so deceived, and which act or omission causes or is likely to cause damage or harm to that person in body, mind, reputation or property, is said to 'cheat'.",
    "changes": "Single section contains both definition and punishment. Expanded definition to include mental and reputational harm. Enhanced penalties for cyber fraud.",
    "keywords": ["cheating", "deceived", "fraud", "dishonest", "scam", "trick", "misled", "conned", "swindled"]
  }
}

// Legal Document Templates Database
const LEGAL_TEMPLATES = {
  // Bail Applications (Post-Arrest)
  "Bail_Application_Magistrate_Court_Sec_437_CrPC": {
    "filename": "Bail_Application_Magistrate_Court_Sec_437_CrPC_Template.doc",
    "category": "Bail Applications (Post-Arrest)",
    "description": "Standard first bail application for most offenses, filed before the Magistrate",
    "legal_provision": "Section 437 CrPC",
    "jurisdiction": "Magistrate Court",
    "keywords": ["bail", "magistrate", "post arrest", "first bail", "section 437", "crpc"]
  },
  "Bail_Application_Sessions_Court_Sec_439_CrPC": {
    "filename": "Bail_Application_Sessions_Court_Sec_439_CrPC_Template.doc",
    "category": "Bail Applications (Post-Arrest)",
    "description": "Filed in Sessions Court after Magistrate denies bail, or for serious offenses",
    "legal_provision": "Section 439 CrPC",
    "jurisdiction": "Sessions Court",
    "keywords": ["bail", "sessions court", "section 439", "crpc", "serious offenses"]
  },
  "Bail_Application_High_Court_Sec_439_CrPC": {
    "filename": "Bail_Application_High_Court_Sec_439_CrPC_Template.doc",
    "category": "Bail Applications (Post-Arrest)",
    "description": "Filed in High Court after Sessions Court denies bail",
    "legal_provision": "Section 439 CrPC",
    "jurisdiction": "High Court",
    "keywords": ["bail", "high court", "section 439", "crpc", "appeal"]
  },
  "Interim_Bail_Application": {
    "filename": "Interim_Bail_Application_Template.doc",
    "category": "Bail Applications (Post-Arrest)",
    "description": "Urgent temporary application for medical emergency or death in family",
    "legal_provision": "Section 437/439 CrPC",
    "jurisdiction": "All Courts",
    "keywords": ["interim bail", "urgent", "medical emergency", "temporary", "emergency"]
  },

  // Anticipatory Bail Applications (Pre-Arrest)
  "Anticipatory_Bail_Sessions_Court_Sec_438_CrPC": {
    "filename": "Anticipatory_Bail_Application_Sessions_Court_Sec_438_CrPC_Template.doc",
    "category": "Anticipatory Bail Applications (Pre-Arrest)",
    "description": "First application for pre-arrest bail, filed at Sessions Court",
    "legal_provision": "Section 438 CrPC",
    "jurisdiction": "Sessions Court",
    "keywords": ["anticipatory bail", "pre arrest", "section 438", "crpc", "sessions court"]
  },
  "Anticipatory_Bail_High_Court_Sec_438_CrPC": {
    "filename": "Anticipatory_Bail_Application_High_Court_Sec_438_CrPC_Template.doc",
    "category": "Anticipatory Bail Applications (Pre-Arrest)",
    "description": "Filed in High Court after Sessions Court rejects application",
    "legal_provision": "Section 438 CrPC",
    "jurisdiction": "High Court",
    "keywords": ["anticipatory bail", "pre arrest", "section 438", "crpc", "high court"]
  },

  // Legal Notices
  "Legal_Notice_Cheque_Bounce_Sec_138_NI_Act": {
    "filename": "Legal_Notice_Cheque_Bounce_Sec_138_NI_Act_Template.doc",
    "category": "Legal Notices",
    "description": "Mandatory 15-day notice to drawer after cheque bounces",
    "legal_provision": "Section 138 Negotiable Instruments Act",
    "jurisdiction": "All Courts",
    "keywords": ["cheque bounce", "section 138", "ni act", "negotiable instruments", "bounced cheque"]
  },
  "Legal_Notice_Recovery_of_Money": {
    "filename": "Legal_Notice_Recovery_of_Money_Template.doc",
    "category": "Legal Notices",
    "description": "General notice to debtor, supplier, or client for pending dues",
    "legal_provision": "General Law",
    "jurisdiction": "All Courts",
    "keywords": ["recovery", "money", "debt", "dues", "unpaid", "salary"]
  },
  "Legal_Notice_Defamation_Cease_and_Desist": {
    "filename": "Legal_Notice_Defamation_Cease_and_Desist_Template.doc",
    "category": "Legal Notices",
    "description": "Notice demanding stop to defamatory statements and apology/damages",
    "legal_provision": "Section 499/500 IPC",
    "jurisdiction": "All Courts",
    "keywords": ["defamation", "cease and desist", "libel", "slander", "reputation"]
  },
  "Legal_Notice_Breach_of_Contract": {
    "filename": "Legal_Notice_Breach_of_Contract_Template.doc",
    "category": "Legal Notices",
    "description": "Notice to party who violated contract, demanding remedy",
    "legal_provision": "Indian Contract Act 1872",
    "jurisdiction": "All Courts",
    "keywords": ["breach of contract", "contract violation", "specific performance", "damages"]
  },
  "Legal_Notice_Eviction_of_Tenant": {
    "filename": "Legal_Notice_Eviction_of_Tenant_Template.doc",
    "category": "Legal Notices",
    "description": "Formal notice from landlord to tenant to vacate property",
    "legal_provision": "Rent Control Acts",
    "jurisdiction": "All Courts",
    "keywords": ["eviction", "tenant", "landlord", "vacate", "rent", "lease"]
  },
  "Legal_Notice_Faulty_Goods_Consumer": {
    "filename": "Legal_Notice_Faulty_Goods_Consumer_Template.doc",
    "category": "Legal Notices",
    "description": "Notice regarding defective product or deficient service",
    "legal_provision": "Consumer Protection Act 2019",
    "jurisdiction": "Consumer Forums",
    "keywords": ["consumer", "faulty goods", "defective product", "deficient service"]
  },

  // Petitions (Writs, SLPs & Criminal Petitions)
  "Petition_Writ_Habeas_Corpus_Art_226": {
    "filename": "Petition_Writ_Habeas_Corpus_Art_226_Template.doc",
    "category": "Petitions (Writs, SLPs & Criminal Petitions)",
    "description": "Challenge illegal detention and command police to produce detained person",
    "legal_provision": "Article 226 Constitution",
    "jurisdiction": "High Court",
    "keywords": ["habeas corpus", "illegal detention", "article 226", "writ", "detention"]
  },
  "Petition_Writ_Mandamus_Art_226": {
    "filename": "Petition_Writ_Mandamus_Art_226_Template.doc",
    "category": "Petitions (Writs, SLPs & Criminal Petitions)",
    "description": "Command public authority to perform official duty",
    "legal_provision": "Article 226 Constitution",
    "jurisdiction": "High Court",
    "keywords": ["mandamus", "public authority", "official duty", "article 226", "writ"]
  },
  "Petition_Writ_Certiorari_Art_226": {
    "filename": "Petition_Writ_Certiorari_Art_226_Template.doc",
    "category": "Petitions (Writs, SLPs & Criminal Petitions)",
    "description": "Quash illegal or procedurally flawed order from lower court",
    "legal_provision": "Article 226 Constitution",
    "jurisdiction": "High Court",
    "keywords": ["certiorari", "quash order", "procedural flaw", "article 226", "writ"]
  },
  "Petition_Public_Interest_Litigation_PIL_Art_226": {
    "filename": "Petition_Public_Interest_Litigation_PIL_Art_226_Template.doc",
    "category": "Petitions (Writs, SLPs & Criminal Petitions)",
    "description": "Writ petition for public interest to address collective grievance",
    "legal_provision": "Article 226 Constitution",
    "jurisdiction": "High Court",
    "keywords": ["pil", "public interest litigation", "collective grievance", "article 226"]
  },
  "Petition_Quashing_of_FIR_Sec_482_CrPC": {
    "filename": "Petition_Quashing_of_FIR_Sec_482_CrPC_Template.doc",
    "category": "Petitions (Writs, SLPs & Criminal Petitions)",
    "description": "Critical petition to cancel false or legally baseless FIR",
    "legal_provision": "Section 482 CrPC",
    "jurisdiction": "High Court",
    "keywords": ["quashing fir", "section 482", "crpc", "false fir", "baseless fir"]
  },
  "Petition_SLP_Criminal_Supreme_Court_Art_136": {
    "filename": "Petition_SLP_Criminal_Supreme_Court_Art_136_Template.doc",
    "category": "Petitions (Writs, SLPs & Criminal Petitions)",
    "description": "Special Leave Petition (Criminal) against High Court judgment",
    "legal_provision": "Article 136 Constitution",
    "jurisdiction": "Supreme Court",
    "keywords": ["slp", "special leave petition", "criminal", "supreme court", "article 136"]
  },
  "Petition_SLP_Civil_Supreme_Court_Art_136": {
    "filename": "Petition_SLP_Civil_Supreme_Court_Art_136_Template.doc",
    "category": "Petitions (Writs, SLPs & Criminal Petitions)",
    "description": "Special Leave Petition (Civil) for non-criminal matters",
    "legal_provision": "Article 136 Constitution",
    "jurisdiction": "Supreme Court",
    "keywords": ["slp", "special leave petition", "civil", "supreme court", "article 136"]
  },

  // Affidavits
  "Affidavit_General_Supporting_Petition": {
    "filename": "Affidavit_General_Supporting_Petition_Template.doc",
    "category": "Affidavits",
    "description": "Generic supporting affidavit for applications and petitions",
    "legal_provision": "General Law",
    "jurisdiction": "All Courts",
    "keywords": ["affidavit", "supporting", "general", "petition", "sworn statement"]
  },
  "Affidavit_Evidence_in_Chief": {
    "filename": "Affidavit_Evidence_in_Chief_Template.doc",
    "category": "Affidavits",
    "description": "Witness testimony submitted as sworn affidavit in civil trials",
    "legal_provision": "Civil Procedure Code",
    "jurisdiction": "Civil Courts",
    "keywords": ["affidavit", "evidence in chief", "witness testimony", "civil trial"]
  },
  "Affidavit_Change_of_Name": {
    "filename": "Affidavit_Change_of_Name_Template.doc",
    "category": "Affidavits",
    "description": "Standard affidavit for legal change of name",
    "legal_provision": "General Law",
    "jurisdiction": "All Courts",
    "keywords": ["affidavit", "change of name", "name change", "passport", "gazette"]
  },
  "Affidavit_Proof_of_Income": {
    "filename": "Affidavit_Proof_of_Income_Template.doc",
    "category": "Affidavits",
    "description": "Income affidavit for maintenance and divorce cases",
    "legal_provision": "Family Law",
    "jurisdiction": "Family Courts",
    "keywords": ["affidavit", "proof of income", "maintenance", "divorce", "alimony"]
  },
  "Affidavit_Lost_Document": {
    "filename": "Affidavit_Lost_Document_Template.doc",
    "category": "Affidavits",
    "description": "Sworn statement explaining circumstances of lost document",
    "legal_provision": "General Law",
    "jurisdiction": "All Courts",
    "keywords": ["affidavit", "lost document", "property deed", "share certificate", "marksheet"]
  },

  // Core Civil Drafting
  "Plaint_Suit_for_Recovery_of_Money": {
    "filename": "Plaint_Suit_for_Recovery_of_Money_Template.doc",
    "category": "Core Civil Drafting",
    "description": "Document that starts civil lawsuit for money recovery",
    "legal_provision": "Civil Procedure Code",
    "jurisdiction": "Civil Courts",
    "keywords": ["plaint", "suit", "recovery of money", "civil lawsuit", "money suit"]
  },
  "Written_Statement_Reply_to_Plaint": {
    "filename": "Written_Statement_Reply_to_Plaint_Template.doc",
    "category": "Core Civil Drafting",
    "description": "Defendant's formal para-by-para reply to Plaint",
    "legal_provision": "Civil Procedure Code",
    "jurisdiction": "Civil Courts",
    "keywords": ["written statement", "reply to plaint", "defendant", "civil procedure"]
  },
  "Vakalatnama": {
    "filename": "Vakalatnama_Template.doc",
    "category": "Core Civil Drafting",
    "description": "Power of Attorney allowing lawyer to represent client in court",
    "legal_provision": "General Law",
    "jurisdiction": "All Courts",
    "keywords": ["vakalatnama", "power of attorney", "lawyer representation", "court appearance"]
  }
}

export default function SimpleLoginPage() {
  const { login } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleRoleLogin = async (role: 'JUDGE' | 'LAWYER' | 'CLIENT') => {
    try {
      // Use predefined credentials for each role
      const credentials = {
        JUDGE: { email: 'judge@nyaysphere.com', password: 'password123' },
        LAWYER: { email: 'lawyer@nyaysphere.com', password: 'password123' },
        CLIENT: { email: 'client@nyaysphere.com', password: 'password123' }
      }

      const { email, password } = credentials[role]
      await login(email, password)
      
      toast.success(`Welcome, ${role}!`)
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
    }
  }

  const unifiedSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const searchLower = query.toLowerCase()
    const results: any[] = []

    // Search IPC Database
    Object.values(IPC_DATABASE).forEach(section => {
      if (
        section.title.toLowerCase().includes(searchLower) ||
        section.description.toLowerCase().includes(searchLower) ||
        section.section.toLowerCase().includes(searchLower) ||
        section.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
      ) {
        // Check if this IPC section has a BNS equivalent
        const bnsEquivalent = BNS_CONCORDANCE[section.section]
        
        results.push({
          type: 'ipc',
          section: section.section,
          title: section.title,
          description: section.description,
          penalty: section.penalty,
          keywords: section.keywords,
          bnsEquivalent: bnsEquivalent || null
        })
      }
    })

    // Search BNS Concordance Database
    Object.values(BNS_CONCORDANCE).forEach(section => {
      if (
        section.oldSection.toLowerCase().includes(searchLower) ||
        section.newSection.toLowerCase().includes(searchLower) ||
        section.oldTitle.toLowerCase().includes(searchLower) ||
        section.newTitle.toLowerCase().includes(searchLower) ||
        section.oldDescription.toLowerCase().includes(searchLower) ||
        section.newDescription.toLowerCase().includes(searchLower) ||
        section.changes.toLowerCase().includes(searchLower) ||
        section.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
      ) {
        // Check if we already added this (to avoid duplicates)
        const alreadyExists = results.some(r => 
          (r.type === 'ipc' && r.section === section.oldSection) ||
          (r.type === 'bns' && r.oldSection === section.oldSection)
        )
        
        if (!alreadyExists) {
          results.push({
            type: 'bns',
            oldSection: section.oldSection,
            oldTitle: section.oldTitle,
            oldDescription: section.oldDescription,
            newSection: section.newSection,
            newTitle: section.newTitle,
            newDescription: section.newDescription,
            changes: section.changes,
            keywords: section.keywords
          })
        }
      }
    })

    // Search Legal Templates Database
    Object.values(LEGAL_TEMPLATES).forEach(template => {
      if (
        template.filename.toLowerCase().includes(searchLower) ||
        template.category.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.legal_provision.toLowerCase().includes(searchLower) ||
        template.jurisdiction.toLowerCase().includes(searchLower) ||
        template.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
      ) {
        results.push({
          type: 'template',
          filename: template.filename,
          category: template.category,
          description: template.description,
          legal_provision: template.legal_provision,
          jurisdiction: template.jurisdiction,
          keywords: template.keywords
        })
      }
    })

    setSearchResults(results)
    setShowSearchResults(true)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    unifiedSearch(value)
  }

  const roles = [
    {
      id: 'JUDGE',
      title: 'Judge',
      description: 'Access case management, hearings, and judicial decisions',
      icon: Scale,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    },
    {
      id: 'LAWYER',
      title: 'Lawyer',
      description: 'Manage cases, clients, and legal documentation',
      icon: Gavel,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      id: 'CLIENT',
      title: 'Client',
      description: 'View case status, upload documents, and communicate',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Header - Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          NY.AI
        </h1>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-7xl w-full">
          {/* Spacer to push content down */}
          <div className="h-20"></div>

          {/* Unified Legal Code Search Tool */}
          <div className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl mr-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Nyayasetu</h2>
                  <p className="text-slate-300 text-sm">Search IPC, BNS, legal templates, and transition mappings in one place</p>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search anything (e.g., 'murder', 'IPC 302', 'BNS 103', 'bail application', 'legal notice', 'vakalatnama')..."
                  className="w-full px-6 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
              </div>

              {/* Search Results */}
              {showSearchResults && (
                <div className="mt-6 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="space-y-6">
                      {searchResults.slice(0, 5).map((result, index) => (
                        <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 hover:bg-slate-700/70 transition-colors">
                          {result.type === 'ipc' ? (
                            // IPC Result with BNS equivalent
                            <div>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg mr-3">
                                    <BookOpen className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-white">{result.section}</h3>
                                    <p className="text-lg font-semibold text-blue-300">{result.title}</p>
                                  </div>
                                </div>
                                <div className="bg-slate-600 px-3 py-1 rounded-lg">
                                  <span className="text-sm text-slate-300">IPC</span>
                                </div>
                              </div>
                              <p className="text-slate-300 mb-3 leading-relaxed">{result.description}</p>
                              <div className="flex items-center mb-4">
                                <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
                                <span className="text-yellow-300 font-medium">{result.penalty}</span>
                              </div>
                              
                              {/* BNS Equivalent */}
                              {result.bnsEquivalent && (
                                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
                                  <div className="flex items-center mb-2">
                                    <ArrowLeftRight className="h-4 w-4 text-green-400 mr-2" />
                                    <h5 className="text-md font-semibold text-green-300">New BNS Equivalent</h5>
                                  </div>
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-slate-300"><span className="font-semibold text-white">Old:</span> {result.bnsEquivalent.oldSection}</p>
                                      <p className="text-sm text-slate-300">{result.bnsEquivalent.oldTitle}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-300"><span className="font-semibold text-white">New:</span> {result.bnsEquivalent.newSection}</p>
                                      <p className="text-sm text-slate-300">{result.bnsEquivalent.newTitle}</p>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <p className="text-xs text-blue-300"><span className="font-semibold">Changes:</span> {result.bnsEquivalent.changes}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : result.type === 'template' ? (
                            // Legal Template Result
                            <div>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg mr-3">
                                    <FileText className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-white">{result.filename}</h3>
                                    <p className="text-sm text-indigo-300">{result.category}</p>
                                  </div>
                                </div>
                                <div className="bg-slate-600 px-3 py-1 rounded-lg">
                                  <span className="text-sm text-slate-300">Template</span>
                                </div>
                              </div>
                              <p className="text-slate-300 mb-3 leading-relaxed">{result.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div className="flex items-center">
                                  <Shield className="h-4 w-4 text-blue-400 mr-2" />
                                  <span className="text-sm text-slate-300"><span className="font-semibold text-white">Legal Provision:</span> {result.legal_provision}</span>
                                </div>
                                <div className="flex items-center">
                                  <Scale className="h-4 w-4 text-green-400 mr-2" />
                                  <span className="text-sm text-slate-300"><span className="font-semibold text-white">Jurisdiction:</span> {result.jurisdiction}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {result.keywords.slice(0, 5).map((keyword, idx) => (
                                  <span key={idx} className="bg-slate-600 px-2 py-1 rounded text-xs text-slate-300">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            // BNS Concordance Result
                            <div>
                              <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                                  <ArrowLeftRight className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">IPC → BNS Transition</h3>
                              </div>
                              
                              {/* Two Column Layout */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                {/* Old IPC Section */}
                                <div className="bg-slate-600/50 rounded-xl p-4">
                                  <div className="flex items-center mb-2">
                                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-1 rounded-lg mr-2">
                                      <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="text-md font-bold text-white">{result.oldSection}</h4>
                                      <p className="text-xs text-red-300">Old IPC</p>
                                    </div>
                                  </div>
                                  <h5 className="text-sm font-semibold text-white mb-1">{result.oldTitle}</h5>
                                  <p className="text-slate-300 text-xs leading-relaxed">{result.oldDescription}</p>
                                </div>

                                {/* New BNS Section */}
                                <div className="bg-slate-600/50 rounded-xl p-4">
                                  <div className="flex items-center mb-2">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1 rounded-lg mr-2">
                                      <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="text-md font-bold text-white">{result.newSection}</h4>
                                      <p className="text-xs text-green-300">New BNS</p>
                                    </div>
                                  </div>
                                  <h5 className="text-sm font-semibold text-white mb-1">{result.newTitle}</h5>
                                  <p className="text-slate-300 text-xs leading-relaxed">{result.newDescription}</p>
                                </div>
                              </div>

                              {/* Changes Section */}
                              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-3">
                                <div className="flex items-center mb-1">
                                  <AlertCircle className="h-4 w-4 text-blue-400 mr-2" />
                                  <h5 className="text-sm font-semibold text-blue-300">Key Changes</h5>
                                </div>
                                <p className="text-slate-300 text-xs">{result.changes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                        <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-300">No legal codes found matching your search</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Access Buttons */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Quick Search - Legal Codes:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <button
                    onClick={() => {
                      setSearchQuery('murder')
                      unifiedSearch('murder')
                    }}
                    className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Murder
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('theft')
                      unifiedSearch('theft')
                    }}
                    className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Theft
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('rape')
                      unifiedSearch('rape')
                    }}
                    className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Rape
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('cheating')
                      unifiedSearch('cheating')
                    }}
                    className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Cheating
                  </button>
                </div>
                
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Quick Search - Legal Templates:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('bail application')
                      unifiedSearch('bail application')
                    }}
                    className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Bail Application
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('legal notice')
                      unifiedSearch('legal notice')
                    }}
                    className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Legal Notice
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('vakalatnama')
                      unifiedSearch('vakalatnama')
                    }}
                    className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Vakalatnama
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('affidavit')
                      unifiedSearch('affidavit')
                    }}
                    className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Affidavit
                  </button>
                </div>
              </div>
            </div>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {roles.map((role) => {
            const IconComponent = role.icon
            return (
              <button
                key={role.id}
                onClick={() => handleRoleLogin(role.id as 'JUDGE' | 'LAWYER' | 'CLIENT')}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-left hover:border-slate-600"
              >
                <div className="flex items-center mb-6">
                    <div className={`${role.color} p-4 rounded-xl mr-4 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{role.title}</h3>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                  {role.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                    Click to enter
                  </span>
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-slate-600 transition-colors duration-200">
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>


                </div>
      </div>
    </div>
  )
}
