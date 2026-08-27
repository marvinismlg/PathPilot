export type MajorCategoryId =
  | "business"
  | "tech"
  | "engineering"
  | "sciences"
  | "humanities";

export interface MajorOption {
  id: string;
  label: string;
}

export interface MajorCategory {
  id: MajorCategoryId;
  label: string;
  majors: readonly MajorOption[];
}

export const MAJOR_CATEGORIES: readonly MajorCategory[] = [
  {
    id: "business",
    label: "Business",
    majors: [
      {
        id: "accounting",
        label: "Accounting",
      },
      {
        id: "business_economics",
        label: "Business Economics",
      },
      {
        id: "advertising",
        label: "Advertising",
      },
      {
        id: "financial_risk_management",
        label: "Financial Risk Management",
      },
      {
        id: "forensic_accounting",
        label: "Forensic Accounting",
      },
      {
        id: "international_business",
        label: "International Business",
      },
      {
        id: "management_consulting",
        label: "Management Consulting",
      },
      {
        id: "marketing",
        label: "Marketing",
      },
      {
        id: "real_estate",
        label: "Real Estate",
      },
      {
        id: "finance",
        label: "Finance",
      },
      {
        id: "supply_chain_management",
        label: "Supply Chain Management",
      },
      {
        id: "sustainability_management",
        label: "Sustainability Management",
      },
      {
        id: "economics",
        label: "Economics",
      },
      {
        id: "business_administration_general_business",
        label: "Business Administration (General Business)",
      },
    ],
  },

  {
    id: "tech",
    label: "Tech",
    majors: [
      {
        id: "info_systems_data_analytics",
        label: "Info Systems & Data Analytics",
      },
      {
        id: "data_science",
        label: "Data Science",
      },
      {
        id: "computer_science",
        label: "Computer Science",
      },
    ],
  },

  {
    id: "engineering",
    label: "Engineering",
    majors: [
      {
        id: "mathematics",
        label: "Mathematics",
      },
      {
        id: "physics",
        label: "Physics",
      },
      {
        id: "computer_engineering",
        label: "Computer Engineering",
      },
      {
        id: "mechanical_engineering",
        label: "Mechanical Engineering",
      },
      {
        id: "electrical_engineering",
        label: "Electrical Engineering",
      },
      {
        id: "materials_engineering",
        label: "Materials Engineering",
      },
    ],
  },

  {
    id: "sciences",
    label: "Sciences",
    majors: [
      {
        id: "biochemistry",
        label: "Biochemistry",
      },
      {
        id: "nursing",
        label: "Nursing",
      },
      {
        id: "biohealth",
        label: "Biohealth",
      },
      {
        id: "biology",
        label: "Biology",
      },
      {
        id: "chemistry",
        label: "Chemistry",
      },
      {
        id: "forensics",
        label: "Forensic Science",
      },
      {
        id: "environmental_science",
        label: "Environmental Science",
      },
      {
        id: "speech_language_hearing_sciences",
        label: "Speech-Language-Hearing Sciences",
      },
    ],
  },

  {
    id: "humanities",
    label: "Humanities",
    majors: [
      {
        id: "education",
        label: "Education",
      },
      {
        id: "elementary_education",
        label: "Elementary Education",
      },
      {
        id: "environmental_studies",
        label: "Environmental Studies",
      },
      {
        id: "french",
        label: "French",
      },
      {
        id: "global_studies",
        label: "Global Studies",
      },
      {
        id: "history",
        label: "History",
      },
      {
        id: "journalism",
        label: "Journalism",
      },
      {
        id: "music",
        label: "Music",
      },
      {
        id: "performing_arts",
        label: "Performing Arts",
      },
      {
        id: "philosophy",
        label: "Philosophy",
      },
      {
        id: "photography",
        label: "Photography",
      },
      {
        id: "political_science",
        label: "Political Science",
      },
      {
        id: "psychology",
        label: "Psychology",
      },
      {
        id: "sociology",
        label: "Sociology",
      },
      {
        id: "spanish",
        label: "Spanish",
      },
      {
        id: "studio_art",
        label: "Studio Art",
      },
      {
        id: "theater",
        label: "Theater",
      },
      {
        id: "special_education",
        label: "Special Education",
      },
      {
        id: "theology",
        label: "Theology",
      },
      {
        id: "visual_arts",
        label: "Visual Arts",
      },
      {
        id: "writing",
        label: "Writing",
      },
      {
        id: "english",
        label: "English",
      },
    ],
  },
] as const;

export interface GeneralTalentOption {
  id: string;
  label: string;
  value: string;
}

export const GENERAL_TALENTS: readonly GeneralTalentOption[] = [
  {
    id: "problem_solving",
    label: "Problem Solving",
    value: "Problem Solving",
  },
  {
    id: "leadership",
    label: "Leadership",
    value: "Leadership & Decision Making",
  },
  {
    id: "teaching_mentoring",
    label: "Teaching & Mentoring",
    value: "Teaching & Mentoring",
  },
  {
    id: "relationship_building",
    label: "Relationship Building",
    value: "Interpersonal & Relationship Building",
  },
  {
    id: "hands_on_ability",
    label: "Hands-On Ability",
    value: "Hands-On / Mechanical Ability",
  },
  {
    id: "systems_thinking",
    label: "Systems Thinking",
    value: "Technology & Systems Thinking",
  },
  {
    id: "creativity",
    label: "Creativity",
    value: "Creativity & Ideation",
  },
  {
    id: "attention_to_detail",
    label: "Attention to Detail",
    value: "Attention to Detail",
  },
  {
    id: "adaptability",
    label: "Adaptability",
    value: "Adaptability & Learning Quickly",
  },
  {
    id: "memory_recall",
    label: "Memory & Recall",
    value: "Memory & Knowledge Retention",
  },
  {
    id: "pattern_recognition",
    label: "Pattern Recognition",
    value: "Observation & Pattern Recognition",
  },
  {
    id: "understanding_people",
    label: "Understanding People",
    value: "Empathy & Understanding People",
  },
  {
    id: "math_numbers",
    label: "Math & Numbers",
    value: "Math & numbers",
  },
  {
    id: "art_design",
    label: "Art & Design",
    value: "Designing & Art",
  },
  {
    id: "writing_communication",
    label: "Writing & Communication",
    value: "Writing & communication",
  },
  {
    id: "public_speaking",
    label: "Speaking & Persuasion",
    value: "Public speaking & persuasion",
  },
  {
    id: "analysis_research",
    label: "Analysis & Research",
    value: "Analysis & research",
  },
  {
    id: "organization_planning",
    label: "Organization & Planning",
    value: "Organization & planning",
  },
] as const;

export interface SoloOrPeopleOption {
  id: string;
  label: string;
  value: string;
}

export const SOLO_OR_PEOPLE: readonly SoloOrPeopleOption[] = [
  {
    id: "solo",
    label: "Solo",
    value: "Solo",
  },
  {
    id: "people",
    label: "People",
    value: "People",
  },
] as const;

export interface EmployeeTypeOption {
  id: string;
}

export const EMPLOYEE_TYPE: readonly EmployeeTypeOption[] = [
  {
    id: "Structured / Process-Driven"
  },
  {
    id: "Creative / Idea-Driven"
  },
  {
    id: "Analytical / Detail-Oriented"
  },
  {
    id: "Leader / Manager"
  },
  {
    id: "Flexible / Adaptable"
  },
  {
    id: "Independent / Self-Directed"
  },
  {
    id: "Collaborative / Team-Oriented"
  },
  {
    id: "People-Focused / Relationship-Driven"
  },
  {
    id: "Hands-On / Practical"
  },
  {
    id: "Strategic / Big-Picture"
  }
] as const;

export interface gradOption {
  id: string;
  label: string;
}

export const GRAD_OR_NO: readonly gradOption[] = [
  {
    id: "yes_grad",
    label: "Higher education"
  },
  {
    id: "no_grad",
    label: "No higher education"
  },
  {
    id: "dont_know_yet",
    label: "Not sure yet"
  }
] as const;

export interface educationOption {
  id: string;
  label: string;
}

export const EDUCATION: readonly educationOption[] = [
  {
    id: "bachelors",
    label: "Bachelor's Degree"
  },
  {
    id: "masters",
    label: "Master's"
  },
  {
    id: "phd",
    label: "PHD"
  },
  {
    id: "special_religious_schooling",
    label: "Religious Schooling"
  }
] as const;

export interface DesiredFieldOption {
  id: string;
  label: string;
}

export interface DesiredFieldCategory {
  category: string;
  fields: readonly DesiredFieldOption[];
}

export const DESIRED_FIELDS: readonly DesiredFieldCategory[] = [
  {
    category: "Technology & Data",
    fields: [
      {
        id: "Something in Technology",
        label: "Something in Technology",
      },
      {
        id: "Statistician",
        label: "Statistician",
      },
      {
        id: "Data Analytics",
        label: "Data Analytics",
      },
      {
        id: "Software Engineering",
        label: "Software Engineering",
      },
      {
        id: "Artificial Intelligence & Machine Learning",
        label: "Artificial Intelligence & Machine Learning",
      },
      {
        id: "Cybersecurity",
        label: "Cybersecurity",
      },
      {
        id: "Information Technology (IT)",
        label: "Information Technology (IT)",
      },
    ],
  },

  {
    category: "Business & Finance",
    fields: [
      {
        id: "Something in Business",
        label: "Something in Business",
      },
      {
        id: "Business Intelligence",
        label: "Business Intelligence",
      },
      {
        id: "Business Management",
        label: "Business Management",
      },
      {
        id: "Marketing & Advertising",
        label: "Marketing & Advertising",
      },
      {
        id: "Finance",
        label: "Finance",
      },
      {
        id: "Accounting & Auditing",
        label: "Accounting & Auditing",
      },
      {
        id: "Economics & Public Policy",
        label: "Economics & Public Policy",
      },
      {
        id: "International Business",
        label: "International Business",
      },
      {
        id: "Consulting",
        label: "Consulting",
      },
    ],
  },

  {
    category: "Health & Sciences",
    fields: [
      {
        id: "Something in Health or Science",
        label: "Something in Health or Science",
      },
      {
        id: "Biostatistics",
        label: "Biostatistics",
      },
      {
        id: "Science & Research",
        label: "Science & Research",
      },
      {
        id: "Clinical Healthcare",
        label: "Clinical Healthcare",
      },
      {
        id: "Public Health",
        label: "Public Health",
      },
      {
        id: "Healthcare Administration",
        label: "Healthcare Administration",
      },
      {
        id: "Medical Research & Biotechnology",
        label: "Medical Research & Biotechnology",
      },
      {
        id: "Environmental Science & Sustainability",
        label: "Environmental Science & Sustainability",
      },
    ],
  },

  {
    category: "Engineering",
    fields: [
      {
        id: "Something in Engineering",
        label: "Something in Engineering",
      },
      {
        id: "Electrical Engineering",
        label: "Electrical Engineering",
      },
      {
        id: "Mechanical & Industrial Engineering",
        label: "Mechanical & Industrial Engineering",
      },
      {
        id: "Civil Engineering",
        label: "Civil Engineering",
      },
      {
        id: "Biomechanical Engineering",
        label: "Biomechanical Engineering",
      },
    ],
  },

  {
    category: "Humanities & Social Sciences",
    fields: [
      {
        id: "Something in within Humanities & Culture",
        label: "Something within Humanities & Culture",
      },
      {
        id: "Teaching, Learning & Student Development",
        label: "Teaching, Learning & Student Development",
      },
      {
        id: "Writing, Editing & Publishing",
        label: "Writing, Editing & Publishing",
      },
      {
        id: "Government, Policy & Civic Leadership",
        label: "Government, Policy & Civic Leadership",
      },
      {
        id: "Law, Rights & Justice",
        label: "Law, Rights & Justice",
      },
      {
        id: "Global Cultures & Diplomacy",
        label: "Global Cultures & Diplomacy",
      },
      {
        id: "Historical Research & Preservation",
        label: "Historical Research & Preservation",
      },
      {
        id: "Media Strategy & Public Communication",
        label: "Media Strategy & Public Communication",
      },
      {
        id: "Creative Arts & Design",
        label: "Creative Arts & Design",
      },
      {
        id: "Human Behavior & Community Studies",
        label: "Human Behavior & Community Studies",
      },
      {
        id: "Faith, Ethics & Service",
        label: "Faith, Ethics & Service",
      },
    ],
  },
] as const;

export interface HardSkillOption {
  id: string;
  label: string;
}

export interface HardSkillCategory {
  category: string;
  skills: readonly HardSkillOption[];
}

export const HARD_SKILLS: readonly HardSkillCategory[] = [
  {
    category: "Technical",
    skills: [
      {
        id: "Programming",
        label: "Programming",
      },
      {
        id: "Software Development",
        label: "Software Development",
      },
      {
        id: "Database Management",
        label: "Database Management",
      },
      {
        id: "Cloud Infrastructure",
        label: "Cloud Infrastructure",
      },
      {
        id: "Network Administration",
        label: "Network Administration",
      },
      {
        id: "Cyber Defense",
        label: "Cyber Defense",
      },
      {
        id: "Systems Administration",
        label: "Systems Administration",
      },
      {
        id: "Automation & Scripting",
        label: "Automation & Scripting",
      },
    ],
  },

  {
    category: "Analytical",
    skills: [
      {
        id: "Data Analysis",
        label: "Data Analysis",
      },
      {
        id: "Statistical Modeling",
        label: "Statistical Modeling",
      },
      {
        id: "Data Visualization",
        label: "Data Visualization",
      },
      {
        id: "Forecasting",
        label: "Forecasting",
      },
      {
        id: "Financial Modeling",
        label: "Financial Modeling",
      },
      {
        id: "Economic Modeling",
        label: "Economic Modeling",
      },
      {
        id: "Optimization",
        label: "Optimization",
      },
      {
        id: "Quantitative Research",
        label: "Quantitative Research",
      },
      {
        id: "Excel",
        label: "Excel",
      },
      {
        id: "Powerbi",
        label: "Powerbi",
      },
      {
        id: "Tableau",
        label: "Tableau",
      },
    ],
  },

  {
    category: "Scientific / Engineering",
    skills: [
      {
        id: "CAD & Design",
        label: "CAD & Design",
      },
      {
        id: "Circuit Design",
        label: "Circuit Design",
      },
      {
        id: "Manufacturing Systems",
        label: "Manufacturing Systems",
      },
      {
        id: "Structural Design",
        label: "Structural Design",
      },
      {
        id: "Materials Testing",
        label: "Materials Testing",
      },
      {
        id: "Laboratory Methods",
        label: "Laboratory Methods",
      },
      {
        id: "Instrumentation",
        label: "Instrumentation",
      },
      {
        id: "Simulation & Modeling",
        label: "Simulation & Modeling",
      },
      {
        id: "Robotics & Controls",
        label: "Robotics & Controls",
      },
      {
        id: "Environmental Measurement",
        label: "Environmental Measurement",
      },
    ],
  },

  {
    category: "Business",
    skills: [
      {
        id: "Financial Reporting",
        label: "Financial Reporting",
      },
      {
        id: "Investment Analysis",
        label: "Investment Analysis",
      },
      {
        id: "Market Research",
        label: "Market Research",
      },
      {
        id: "Digital Advertising",
        label: "Digital Advertising",
      },
      {
        id: "Customer Relationship Management",
        label: "Customer Relationship Management",
      },
      {
        id: "Project Coordination",
        label: "Project Coordination",
      },
      {
        id: "Process Improvement",
        label: "Process Improvement",
      },
      {
        id: "Supply Chain Planning",
        label: "Supply Chain Planning",
      },
      {
        id: "Sales Strategy",
        label: "Sales Strategy",
      },
      {
        id: "Business Strategy",
        label: "Business Strategy",
      },
      {
        id: "Auditing",
        label: "Auditing",
      },
      {
        id: "GAAP",
        label: "GAAP",
      },
      {
        id: "Internal Controls",
        label: "Internal Controls",
      },
      {
        id: "Account Reconciliation",
        label: "Account Reconciliation",
      },
      {
        id: "General Ledger",
        label: "General Ledger",
      },
      {
        id: "Tax Preparation",
        label: "Tax Preparation",
      },
      {
        id: "Risk Assessment",
        label: "Risk Assessment",
      },
      {
        id: "Regulatory Compliance",
        label: "Regulatory Compliance",
      },
      {
        id: "Salesforce",
        label: "Salesforce",
      },
      {
        id: "CRM Tools",
        label: "CRM Tools",
      },
      {
        id: "Hubspot",
        label: "Hubspot",
      },
    ],
  },

  {
    category: "Creative",
    skills: [
      {
        id: "Graphic Design",
        label: "Graphic Design",
      },
      {
        id: "UI/UX Design",
        label: "UI/UX Design",
      },
      {
        id: "Video Editing",
        label: "Video Editing",
      },
      {
        id: "Motion Graphics",
        label: "Motion Graphics",
      },
      {
        id: "Content Production",
        label: "Content Production",
      },
      {
        id: "Photography",
        label: "Photography",
      },
      {
        id: "Branding",
        label: "Branding",
      },
      {
        id: "Visual Storytelling",
        label: "Visual Storytelling",
      },
    ],
  },

  {
    category: "Communication",
    skills: [
      {
        id: "Public Speaking",
        label: "Public Speaking",
      },
      {
        id: "Professional Writing",
        label: "Professional Writing",
      },
      {
        id: "Persuasive Communication",
        label: "Persuasive Communication",
      },
      {
        id: "Presentation Design",
        label: "Presentation Design",
      },
      {
        id: "Interviewing",
        label: "Interviewing",
      },
      {
        id: "Negotiation",
        label: "Negotiation",
      },
      {
        id: "Technical Communication",
        label: "Technical Communication",
      },
      {
        id: "Media Communication",
        label: "Media Communication",
      },
      {
        id: "Learning Program Design",
        label: "Learning Program Design",
      },
      {
        id: "General Education",
        label: "General Education",
      },
    ],
  },

  {
    category: "Scientific",
    skills: [
      {
        id: "Experimental Design",
        label: "Experimental Design",
      },
      {
        id: "Laboratory Techniques",
        label: "Laboratory Techniques",
      },
      {
        id: "Scientific Computing",
        label: "Scientific Computing",
      },
      {
        id: "Field Research",
        label: "Field Research",
      },
      {
        id: "Data Collection",
        label: "Data Collection",
      },
      {
        id: "Measurement & Testing",
        label: "Measurement & Testing",
      },
      {
        id: "Research Methods",
        label: "Research Methods",
      },
      {
        id: "Scientific Writing",
        label: "Scientific Writing",
      },
    ],
  },

  {
    category: "Language & Culture",
    skills: [
      {
        id: "Writing",
        label: "Writing",
      },
      {
        id: "Literature",
        label: "Literature",
      },
      {
        id: "Foreign Languages",
        label: "Foreign Languages",
      },
      {
        id: "Translation",
        label: "Translation",
      },
      {
        id: "Geographical Knowledge",
        label: "Geographical Knowledge",
      },
      {
        id: "Historical Research",
        label: "Historical Research",
      },
      {
        id: "Philosophy",
        label: "Philosophy",
      },
      {
        id: "Theology",
        label: "Theology",
      },
      {
        id: "Cultural Analysis",
        label: "Cultural Analysis",
      },
      {
        id: "Classical Studies",
        label: "Classical Studies",
      },
    ],
  },
] as const;

export interface SoftSkillOption {
  id: string;
  label: string;
}

export interface SoftSkillCategory {
  category: string;
  skills: readonly SoftSkillOption[];
}

export const SOFT_SKILLS: readonly SoftSkillCategory[] = [
  {
    category: "Technical",
    skills: [
      {
        id: "Problem Solving",
        label: "Problem Solving",
      },
      {
        id: "Attention to Detail",
        label: "Attention to Detail",
      },
      {
        id: "Persistence",
        label: "Persistence",
      },
      {
        id: "Adaptability",
        label: "Adaptability",
      },
      {
        id: "Logical Thinking",
        label: "Logical Thinking",
      },
    ],
  },

  {
    category: "Analytical",
    skills: [
      {
        id: "Critical Thinking",
        label: "Critical Thinking",
      },
      {
        id: "Attention to Detail",
        label: "Attention to Detail",
      },
      {
        id: "Curiosity",
        label: "Curiosity",
      },
      {
        id: "Pattern Recognition",
        label: "Pattern Recognition",
      },
      {
        id: "Decision Making",
        label: "Decision Making",
      },
    ],
  },

  {
    category: "Scientific / Engineering",
    skills: [
      {
        id: "Precision",
        label: "Precision",
      },
      {
        id: "Problem Solving",
        label: "Problem Solving",
      },
      {
        id: "Attention to Detail",
        label: "Attention to Detail",
      },
      {
        id: "Persistence",
        label: "Persistence",
      },
      {
        id: "Safety Awareness",
        label: "Safety Awareness",
      },
    ],
  },

  {
    category: "Business",
    skills: [
      {
        id: "Communication",
        label: "Communication",
      },
      {
        id: "Decision Making",
        label: "Decision Making",
      },
      {
        id: "Organization",
        label: "Organization",
      },
      {
        id: "Leadership",
        label: "Leadership",
      },
      {
        id: "Negotiation",
        label: "Negotiation",
      },
    ],
  },

  {
    category: "Creative",
    skills: [
      {
        id: "Creativity",
        label: "Creativity",
      },
      {
        id: "Visual Thinking",
        label: "Visual Thinking",
      },
      {
        id: "Adaptability",
        label: "Adaptability",
      },
      {
        id: "Attention to Detail",
        label: "Attention to Detail",
      },
      {
        id: "Openness to Feedback",
        label: "Openness to Feedback",
      },
    ],
  },

  {
    category: "Communication",
    skills: [
      {
        id: "Public Speaking",
        label: "Public Speaking",
      },
      {
        id: "Active Listening",
        label: "Active Listening",
      },
      {
        id: "Persuasion",
        label: "Persuasion",
      },
      {
        id: "Empathy",
        label: "Empathy",
      },
      {
        id: "Confidence",
        label: "Confidence",
      },
    ],
  },

  {
    category: "Scientific",
    skills: [
      {
        id: "Curiosity",
        label: "Curiosity",
      },
      {
        id: "Precision",
        label: "Precision",
      },
      {
        id: "Critical Thinking",
        label: "Critical Thinking",
      },
      {
        id: "Patience",
        label: "Patience",
      },
      {
        id: "Research Discipline",
        label: "Research Discipline",
      },
    ],
  },

  {
    category: "Language & Culture",
    skills: [
      {
        id: "Cultural Awareness",
        label: "Cultural Awareness",
      },
      {
        id: "Interpretation",
        label: "Interpretation",
      },
      {
        id: "Writing",
        label: "Writing",
      },
      {
        id: "Empathy",
        label: "Empathy",
      },
      {
        id: "Critical Thinking",
        label: "Critical Thinking",
      },
    ],
  },
] as const;

export interface WorkLocationOption {
  id: string;
  label: string;
}

export const WORK_LOCATION: readonly WorkLocationOption[] = [
  {
    id: "East Coast",
    label: "East Coast",
  },
  {
    id: "West Coast",
    label: "West Coast",
  },
  {
    id: "Midwest",
    label: "Midwest",
  },
  {
    id: "South",
    label: "South",
  },
  {
    id: "Northeast",
    label: "Northeast",
  },
  {
    id: "Major City / Urban",
    label: "Major City / Urban",
  },
  {
    id: "Suburban",
    label: "Suburban",
  },
  {
    id: "Rural",
    label: "Rural",
  },
  {
    id: "Remote",
    label: "Remote",
  },
  {
    id: "Hybrid",
    label: "Hybrid",
  },
  {
    id: "International",
    label: "International",
  },
  {
    id: "Flexible / Anywhere",
    label: "Flexible / Anywhere",
  },
] as const;

export interface WorkEnvironmentOption {
  id: string;
  label: string;
}

export const WORK_ENVIRONMENT: readonly WorkEnvironmentOption[] = [
  {
    id: "Office / Corporate Setting",
    label: "Office / Corporate Setting",
  },
  {
    id: "Remote / Work From Home",
    label: "Remote / Work From Home",
  },
  {
    id: "Fast-Paced / High-Pressure",
    label: "Fast-Paced / High-Pressure",
  },
  {
    id: "Structured / Predictable",
    label: "Structured / Predictable",
  },
  {
    id: "Flexible / Unstructured",
    label: "Flexible / Unstructured",
  },
  {
    id: "Team-Based / Collaborative",
    label: "Team-Based / Collaborative",
  },
  {
    id: "Independent / Solo Work",
    label: "Independent / Solo Work",
  },
  {
    id: "Client-Facing / Social",
    label: "Client-Facing / Social",
  },
  {
    id: "Quiet / Low Interaction",
    label: "Quiet / Low Interaction",
  },
  {
    id: "Field-Based / On-Site",
    label: "Field-Based / On-Site",
  },
  {
    id: "Laboratory / Research Setting",
    label: "Laboratory / Research Setting",
  },
  {
    id: "Industrial / Manufacturing Setting",
    label: "Industrial / Manufacturing Setting",
  },
  {
    id: "Healthcare / Clinical Setting",
    label: "Healthcare / Clinical Setting",
  },
  {
    id: "Academic / Educational Setting",
    label: "Academic / Educational Setting",
  },
  {
    id: "Government / Public Sector",
    label: "Government / Public Sector",
  },
  {
    id: "Startup / Entrepreneurial Setting",
    label: "Startup / Entrepreneurial Setting",
  },
  {
    id: "Travel-Heavy / Mobile",
    label: "Travel-Heavy / Mobile",
  },
  {
    id: "Outdoor / Environmental Setting",
    label: "Outdoor / Environmental Setting",
  },
  {
    id: "Cultural / Arts-Oriented Setting",
    label: "Cultural / Arts-Oriented Setting",
  },
  {
    id: "Writing / Communication Setting",
    label: "Writing / Communication Setting",
  },
  {
    id: "Community / Public-Facing Setting",
    label: "Community / Public-Facing Setting",
  },
  {
    id: "Research / Idea-Driven Setting",
    label: "Research / Idea-Driven Setting",
  },
] as const;

export interface WorkIntensityOption {
  id: string;
  label: string;
}

export const WORK_INTENSITY: readonly WorkIntensityOption[] = [
  {
    id: "Light / Low Demand — usually under ~40 hours, low pressure",
    label: "Light / Low Demand — usually under ~40 hours, low pressure",
  },
  {
    id: "Standard / Moderate — around 40 hours, manageable challenge",
    label: "Standard / Moderate — around 40 hours, manageable challenge",
  },
  {
    id: "Moderately Demanding — ~40–50 hours, mentally demanding",
    label: "Moderately Demanding — ~40–50 hours, mentally demanding",
  },
  {
    id: "High Intensity — ~50–60 hours, high workload and pressure",
    label: "High Intensity — ~50–60 hours, high workload and pressure",
  },
  {
    id: "Very High Intensity — ~60+ hours, consistently demanding",
    label: "Very High Intensity — ~60+ hours, consistently demanding",
  },
  {
    id: "Seasonal / Periodic Intensity — normal most of the year, but major crunch periods",
    label: "Seasonal / Periodic Intensity — normal most of the year, but major crunch periods",
  },
  {
    id: "Variable / Unpredictable Intensity — workload and hours can swing heavily",
    label: "Variable / Unpredictable Intensity — workload and hours can swing heavily",
  },
  {
    id: "Extreme / Competitive Intensity — very long hours, high pressure, difficult work, strong performance expectations",
    label: "Extreme / Competitive Intensity — very long hours, high pressure, difficult work, strong performance expectations",
  },
] as const;

export type SalaryBandValue =
  | "medium"
  | "medium high"
  | "high";

export interface SalaryOption {
  id: string;
  label: string;
  value: SalaryBandValue;
}

export const SALARY_OPTIONS: readonly SalaryOption[] = [
  {
    id: "65k",
    label: "$65K",
    value: "medium",
  },
  {
    id: "90k",
    label: "$90K",
    value: "medium",
  },
  {
    id: "120k",
    label: "$120K",
    value: "medium high",
  },
  {
    id: "175k",
    label: "$150K",
    value: "high",
  },
  {
    id: "200k_plus",
    label: "$215K+",
    value: "high",
  },
] as const;

export interface DesiredOutcomeOption {
  id: string;
  label: string;
}

export const DESIRED_OUTCOMES: readonly DesiredOutcomeOption[] = [
  {
    id: "Quick Income / Short-Term Stability",
    label: "Quick Income / Short-Term Stability",
  },
  {
    id: "Explore Different Paths / Stay Flexible",
    label: "Explore Different Paths / Stay Flexible",
  },
  {
    id: "Build Transferable Skills / Future Opportunities",
    label: "Build Transferable Skills / Future Opportunities",
  },
  {
    id: "Career Growth / Advancement",
    label: "Career Growth / Advancement",
  },
  {
    id: "Long-Term Stable Career",
    label: "Long-Term Stable Career",
  },
  {
    id: "High Income / Wealth Building",
    label: "High Income / Wealth Building",
  },
  {
    id: "Entrepreneurship / Start a Business",
    label: "Entrepreneurship / Start a Business",
  },
  {
    id: "Leadership / Executive Path",
    label: "Leadership / Executive Path",
  },
  {
    id: "Large Exit / Financial Independence",
    label: "Large Exit / Financial Independence",
  },
  {
    id: "Impact-Driven / Meaningful Work",
    label: "Impact-Driven / Meaningful Work",
  },
  {
    id: "Work-Life Balance / Flexibility",
    label: "Work-Life Balance / Flexibility",
  },
  {
    id: "Prestige / Competitive Career",
    label: "Prestige / Competitive Career",
  },
  {
    id: "Job Security / Low Career Risk",
    label: "Job Security / Low Career Risk",
  },
  {
    id: "Creative Freedom / Autonomy",
    label: "Creative Freedom / Autonomy",
  },
  {
    id: "Specialized Expertise / Become an Expert",
    label: "Specialized Expertise / Become an Expert",
  },
  {
    id: "Intellectual Exploration / Lifelong Learning",
    label: "Intellectual Exploration / Lifelong Learning",
  },
  {
    id: "Cultural / Social Impact",
    label: "Cultural / Social Impact",
  },
  {
    id: "Creative Expression / Communication",
    label: "Creative Expression / Communication",
  },
  {
    id: "Education / People-Oriented Development",
    label: "Education / People-Oriented Development",
  },
] as const;