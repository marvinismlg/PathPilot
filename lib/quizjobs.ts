import { Quantico } from 'next/font/google';
import quizCourseProfilesData from '../data/courseoutputs.json';
import quizJobProfilesData from '../data/joboutputs.json';


export const quizCategoryIds = [
  'Marketing & Advertising',
  'Healthcare',
  'Analytics & Data',
  'Business Intelligence',
  'Business & Management',
  'Cybersecurity',
  'Information Technology (IT)',
  'Finance',
  'Science & Research',
  'Electrical Engineering',
  'Mechanical & Industrial Engineering',
  'Civil Engineering',
  'Biomechanical Engineering',
  'Computer Science & Software Development',
  'Computer Engineering',
  'Economics',
  'Environmental Work & Sustainability',
  'Accounting',
  'Mathematics & Statistics',
  'Materials Engineering',
  'Education',
  'Writing & Journalism',
  'Politics & Public Policy',
  'Legal Services',
  'Languages & International Affairs',
  'History & Cultural Heritage',
  'Media, Communications & Public Relations',
  'Arts & Creative Industries',
  'Social & Behavioral Sciences',
  'Religion, Ministry & Spiritual Life'
] as const;
  
const extraQuizProfileCategoryIds = ['Tech in Business'] as const;

export const quizjobIds = [
  'Market Research Analyst',
  'Search Marketing Strategist',
  'Advertising and Promotions Manager',
  'Project management specialist',
  'Industrial Product Manager',
  'Business Operations Specialist',
  'Financial Analyst',
  'Human Resources Specialist',
  'Human Resources Manager',
  'Public Relations Specialist',
  'Public Relations Manager',
  'Business Intelligence Analyst',
  'Data Scientist',
  'Training and Development Specialist',
  'Business Continuity Planner',
  'Project Management Specialist',
  'Facilities Manager'
]



export type QuizCategoryId = (typeof quizCategoryIds)[number];

export type QuizProfileCategoryId =
  | QuizCategoryId
  | (typeof extraQuizProfileCategoryIds)[number];

  
export type QuizJobId = (typeof quizjobIds)[number];

export type ExistingJobSourceCategory =
  | QuizCategoryId
  | 'Marketing & Sales'
  | 'People Oriented & Org Development';

export interface QuizJobEntry {
  title: string;
  sourceCategory: ExistingJobSourceCategory;
}

export interface QuizJobProfileInternship {
  internshipId: string;
  internshipTitle: string;
  reasons: string[];
  suggestedSearchTerms?: string[];
}

export interface QuizJobProfile {
  id: string;
  title: string;
  categoryId: QuizProfileCategoryId;
  sourceCategory: ExistingJobSourceCategory;
  shortDescription: string;
  keyStrengths: string[];
  possibleSkillGaps: string[];
  recommendedCourseIds: string[];
  internships: Record<string, QuizJobProfileInternship>;
  isPlaceholder: boolean;
}

export interface QuizCourseProfile {
  id: string;
  courseCode: string;
  courseName: string;
  relatedCategoryIds: QuizProfileCategoryId[];
  relatedJobIds: string[];
  requiredForCategoryIds: QuizProfileCategoryId[];
  requiredForJobIds: string[];
  prerequisites: string[];
  isPlaceholder: boolean;
}

const quizCategoryIdSet = new Set<string>(quizCategoryIds);
const extraQuizProfileCategoryIdSet = new Set<string>(extraQuizProfileCategoryIds);
const existingJobSourceCategorySet = new Set<string>([
  'Marketing & Advertising',
  'Healthcare',
  'Analytics & Data',
  'Business Intelligence',
  'Business & Management',
  'Cybersecurity',
  'Information Technology (IT)',
  'Finance',
  'Science & Research',
  'Electrical Engineering',
  'Mechanical & Industrial Engineering',
  'Civil Engineering',
  'Biomechanical Engineering',
  'Computer Science & Software Development',
  'Computer Engineering',
  'Economics',
  'Environmental Work & Sustainability',
  'Accounting',
  'Mathematics & Statistics',
  'Materials Engineering',
  'Education',
  'Writing & Journalism',
  'Politics & Public Policy',
  'Legal Services',
  'Languages & International Affairs',
  'History & Cultural Heritage',
  'Media, Communications & Public Relations',
  'Arts & Creative Industries',
  'Social & Behavioral Sciences',
  'Religion, Ministry & Spiritual Life'
]);

export function isQuizCategoryId(value: string): value is QuizCategoryId {
  return quizCategoryIdSet.has(value);
}

function toQuizProfileCategoryId(categoryId: string): QuizProfileCategoryId | null {
  if (isQuizCategoryId(categoryId)) {
    return categoryId;
  }

  if (categoryId === 'Tech in Business') {
    return categoryId;
  }

  return null;
}

function isExistingJobSourceCategory(
  value: string,
): value is ExistingJobSourceCategory {
  return existingJobSourceCategorySet.has(value);
}

function job(title: string, sourceCategory: ExistingJobSourceCategory): QuizJobEntry {
  return {
    title,
    sourceCategory,
  };
}

export const quizSkillLibrary: Record<QuizCategoryId, string[]> = {
  'Marketing & Advertising': [
    'Market Research',
    'Google Ads',
    'Meta Ads',
    'Social Media Marketing',
    'Google Analytics',
    'SEO',
    'Salesforce',
    'HubSpot',
    'Email Marketing',
    'Market Research',
    'Content Marketing',
    'Copywriting',
    'A/B Testing',
    'Campaign Analytics',
    'CRM',
    'Excel',
    'Canva',
    'WordPress'
  ],
  'Healthcare': [
    'Vital Signs',
    'EHR',
    'Medical Coding',
    'Phlebotomy',
    'Patient Intake',
    'Basic Life Support',
    'CPR/AED',
    'HIPAA',
    'Medical Terminology'
  ],
  'Analytics & Data': [
    'Excel',
    'Power BI',
    'Python',
    'SQL',
    'Statistics',
    'Tableau',
    'Data Visualization',
    'Data Cleaning',
    'Pivot Tables',
    'Data Modeling'
  ],
  'Business Intelligence': [
    'Excel',
    'Power BI',
    'Python',
    'SQL',
    'Statistics',
    'CRM',
    'Google Aanalytics',
    'SEO',
    'Data Visualization',
    'Salesforce'
  ],
  'Business & Management': [
    'Excel',
    'Salesforce',
    'Microsoft Office',
    'Powerpoint',
    'Data Visualization',
    'Market Research',
    'Power BI',
    'Google Analytics',
    'SEO'
  ],
  'Cybersecurity': [
    'Kali Linux',
    'Wireshark',
    'Nmap',
    'Firewalls',
    'VPNs',
    'Python',
    'Javascript',
    'SQL',
    'Access Control'
  ],
  'Information Technology (IT)': [
    'Microsoft 365',
    'Windows',
    'Active Directory',
    'Azure',
    'PowerShell',
    'Networking',
    'DNS',
    'DHCP',
    'VPN',
    'Help Desk'
  ],
  'Finance': [
    'Excel',
    'Bloomberg Terminal',
    'Capital IQ',
    'Risk Assessment',
    'Morningstar',
    'QuickBooks',
    'Power BI',
    'Tableau',
    'Financial Modeling'
  ],
  'Science & Research': [
    'Microscopy',
    'PCR',
    'Gel Electrophoresis',
    'Lab Safety',
    'Pipetting',
    'Excel',
    'R',
    'Python',
    'SPSS',
    'Data Collection',
    'Research Methods',
    'Scientific Writing',
    'Research Skills'
  ],
  'Electrical Engineering': [
    'AutoCAD',
    'MATLAB',
    'LTspice',
    'Multisim',
    'Oscilloscope',
    'Soldering',
    'Circuit Design',
    'PCB Design',
    'Arduino',
    'LabVIEW'
  ],
  'Mechanical & Industrial Engineering': [
    'SolidWorks',
    'AutoCAD',
    'MATLAB',
    'ANSYS',
    'Fusion 360',
    '3D Printing',
    'CNC Machining',
    'CAD Modeling',
    'Simulation',
    'Excel'
  ],
  'Civil Engineering': [
    'AutoCAD',
    'Civil 3D',
    'ArcGIS',
    'Revit',
    'STAAD.Pro',
    'ETABS',
    'Surveying',
    'GIS Mapping',
    'Blueprint Reading',
    'Excel'
  ],
  'Biomechanical Engineering': [
    'SolidWorks',
  'AutoCAD',
  'MATLAB',
  'ANSYS',
  'LabVIEW',
  '3D Printing',
  'CAD Modeling',
  'Motion Capture',
  'Force Sensors',
  'Biomechanics Testing'
  ],
  'Computer Science & Software Development': [
  'Git',
  'GitHub',
  'VS Code',
  'Linux',
  'Docker',
  'Postman',
  'REST APIs',
  'SQL',
  'Python',
  'JavaScript'
  ],
  'Computer Engineering': [
    'Verilog',
    'VHDL',
    'FPGA',
    'Microcontrollers',
    'Arduino',
    'Raspberry Pi',
    'PCB Design',
    'LTspice',
    'Multisim',
    'Oscilloscope'
  ],
  'Economics': [
    'Excel',
    'Stata',
    'R',
    'Python',
    'SPSS',
    'EViews',
    'Tableau',
    'Power BI',
    'SQL',
    'Bloomberg Terminal'
  ],
  'Environmental Work & Sustainability': [
    'ArcGIS',
    'QGIS',
    'AutoCAD',
    'Excel',
    'Power BI',
    'Tableau',
    'GIS Mapping',
    'Carbon Accounting',
    'Life Cycle Assessment',
    'Environmental Sampling'
  ],
  'Accounting': [
    'Excel',
    'QuickBooks',
    'Xero',
    'SAP',
    'Oracle',
    'Power BI',
    'Tableau',
    'SQL',
    'Financial Statements',
    'Tax Software'
  ],
  'Mathematics & Statistics': [
    'Excel',
    'R',
    'Python',
    'MATLAB',
    'Statistical Modeling',
    'Calculus',
    'Stata',
    'Tableau',
    'Power BI',
    'LaTeX'
  ],
  'Materials Engineering': [
  'CAD Modeling',
  'Materials Testing',
  'Failure Analysis',
  'Metallography',
  'Microscopy',
  'Tensile Testing',
  'Thermal Analysis',
  'Manufacturing Processes',
  'Quality Control',
  'MATLAB'
],

'Education': [
  'Lesson Planning',
  'Curriculum Design',
  'Classroom Management',
  'Student Assessment',
  'Instructional Technology',
  'Learning Management Systems',
  'Special Education',
  'Differentiated Instruction',
  'Educational Research',
  'Data Analysis'
],

'Writing & Journalism': [
  'News Writing',
  'Copy Editing',
  'Fact Checking',
  'Interviewing',
  'Investigative Research',
  'AP Style',
  'Content Management Systems',
  'SEO Writing',
  'Multimedia Storytelling',
  'Data Journalism'
],

'Politics & Public Policy': [
  'Policy Analysis',
  'Legislative Research',
  'Statistical Analysis',
  'Survey Research',
  'Program Evaluation',
  'Regulatory Analysis',
  'Stakeholder Mapping',
  'Budget Analysis',
  'GIS Mapping',
  'Policy Writing'
],

'Legal Services': [
  'Legal Research',
  'Legal Writing',
  'Case Analysis',
  'Contract Drafting',
  'Document Review',
  'E-Discovery',
  'Westlaw',
  'LexisNexis',
  'Litigation Support',
  'Regulatory Compliance'
],

'Languages & International Affairs': [
  'Foreign Languages',
  'Translation',
  'Interpretation',
  'Cross-Cultural Communication',
  'Regional Analysis',
  'Diplomatic Writing',
  'Geopolitical Analysis',
  'International Law',
  'OSINT Research',
  'Country Risk Analysis'
],

'History & Cultural Heritage': [
  'Historical Research',
  'Archival Research',
  'Primary Source Analysis',
  'Artifact Cataloging',
  'Collections Management',
  'Museum Curation',
  'Exhibit Design',
  'Digital Humanities',
  'Oral History',
  'Historic Preservation'
],

'Media, Communications & Public Relations': [
  'Media Relations',
  'Press Release Writing',
  'Crisis Communication',
  'Social Media Management',
  'Audience Research',
  'Content Strategy',
  'Media Monitoring',
  'Brand Messaging',
  'Video Production',
  'Communication Analytics'
],

'Arts & Creative Industries': [
  'Graphic Design',
  'Illustration',
  'Photography',
  'Video Editing',
  'Audio Production',
  '3D Modeling',
  'Animation',
  'Creative Direction',
  'Portfolio Development',
  'Adobe Creative Cloud'
],

'Social & Behavioral Sciences': [
  'Survey Design',
  'Statistical Analysis',
  'Experimental Design',
  'Qualitative Research',
  'Interviewing',
  'SPSS',
  'R',
  'Behavioral Analysis',
  'Program Evaluation',
  'Data Visualization'
],

'Religion, Ministry & Spiritual Life': [
  'Theological Research',
  'Scriptural Interpretation',
  'Homiletics',
  'Pastoral Counseling',
  'Spiritual Care',
  'Worship Planning',
  'Interfaith Dialogue',
  'Community Outreach',
  'Nonprofit Management',
  'Program Development'
]
};

export const quizJobLibrary: Record<QuizCategoryId, QuizJobEntry[]> = {
  'Marketing & Advertising': [
    job('Market Research Analyst', 'Analytics & Data'),
    job('Search Marketing Strategist', 'Analytics & Data'),
    job('Advertising and Promotions Manager', 'Marketing & Sales'),
    job('Marketing Manager', 'Marketing & Sales'),
    job('Advertising Sales Agent', 'Marketing & Sales'),
    job('Public Relations Specialist', 'People Oriented & Org Development'),
    job('Public Relations Manager', 'People Oriented & Org Development'),
  ],

  'Analytics & Data': [
    job('Business Intelligence Analyst', 'Analytics & Data'),
    job('Data Scientist', 'Analytics & Data'),
    job('Market Research Analyst', 'Analytics & Data'),
    job('Search Marketing Strategist', 'Analytics & Data'),
    job('Operations Research Analyst', 'Analytics & Data'),
    job('Statistician', 'Analytics & Data'),
    job('Mathematician', 'Analytics & Data'),
    job('Economist', 'Analytics & Data'),
    job('Environmental Economist', 'Analytics & Data'),
    job('Biostatistician', 'Analytics & Data'),
  ],

  'Business & Management': [
    job('Management Analyst', 'Business & Management'),
    job('Business Operations Specialist', 'Business & Management'),
    job('General and Operations Manager', 'Business & Management'),
    job('Chief Executive', 'Business & Management'),
    job('Administrative Services Manager', 'Business & Management'),
    job('Facilities Manager', 'Business & Management'),
    job('Project Management Specialist', 'Business & Management'),
    job('Business Continuity Planner', 'Business & Management'),
    job('Quality Control Systems Manager', 'Business & Management'),
    job('Industrial Production Manager', 'Business & Management'),
  ],

  Cybersecurity: [
    job('Business Intelligence Analyst', 'Analytics & Data'),
    job('Project Management Specialist', 'Business & Management'),
    job('Business Operations Specialist', 'Business & Management'),
    job('Sales Engineer', 'Marketing & Sales'),
    job('Management Analyst', 'Business & Management'),
    job('Business Continuity Planner', 'Business & Management'),
    job('Quality Control Systems Manager', 'Business & Management'),
    job('Administrative Services Manager', 'Business & Management'),
    job('Search Marketing Strategist', 'Analytics & Data'),
  ],

  Finance: [
    job('Financial Analyst', 'Finance'),
    job('Financial and Investment Analyst', 'Finance'),
    job('Financial Manager', 'Finance'),
    job('Treasurer', 'Finance'),
    job('Investment Fund Manager', 'Finance'),
    job('Accountant / Auditor', 'Finance'),
    job('Financial Quantitative Analyst', 'Finance'),
    job('Actuary', 'Finance'),
    job('Personal Financial Advisor', 'Finance'),
  ],

  'Science & Research': [
    job('Data Scientist', 'Analytics & Data'),
    job('Operations Research Analyst', 'Analytics & Data'),
    job('Statistician', 'Analytics & Data'),
    job('Mathematician', 'Analytics & Data'),
    job('Economist', 'Analytics & Data'),
    job('Environmental Economist', 'Analytics & Data'),
    job('Biostatistician', 'Analytics & Data'),
    job('Financial Quantitative Analyst', 'Finance'),
    job('Actuary', 'Finance'),
  ],

  'Electrical Engineering': [
    job('Electrical Engineer', 'Electrical Engineering'),
    job('Electronics Engineer', 'Electrical Engineering'),
    job('Control Systems Engineer', 'Electrical Engineering'),
    job('Power Systems Engineer', 'Electrical Engineering'),
    job('Radio Frequency Engineer', 'Electrical Engineering'),
    job('Signal Processing Engineer', 'Electrical Engineering'),
    job('Telecommunications Engineer', 'Electrical Engineering'),
    job('Instrumentation Engineer', 'Electrical Engineering'),
    job('Renewable Energy Engineer', 'Electrical Engineering'),
    job('Electrical Design Engineer', 'Electrical Engineering'),
  ],


  Economics: [
    job('Economist', 'Analytics & Data'),
    job('Environmental Economist', 'Analytics & Data'),
    job('Economic Research Analyst', 'Analytics & Data'),
    job('Econometrician', 'Analytics & Data'),
    job('Policy Analyst', 'Politics & Public Policy'),
    job('Financial Analyst', 'Finance'),
    job('Financial Quantitative Analyst', 'Finance'),
    job('Market Research Analyst', 'Analytics & Data'),
    job('Operations Research Analyst', 'Analytics & Data'),
    job('Forecasting Analyst', 'Analytics & Data'),
  ],

  'Mechanical & Industrial Engineering': [
    job('Mechanical Engineer', 'Mechanical & Industrial Engineering'),
    job('Industrial Engineer', 'Mechanical & Industrial Engineering'),
    job('Manufacturing Engineer', 'Mechanical & Industrial Engineering'),
    job('Quality Engineer', 'Mechanical & Industrial Engineering'),
    job('Robotics Engineer', 'Mechanical & Industrial Engineering'),
    job('Aerospace Engineer', 'Mechanical & Industrial Engineering'),
    job('Automotive Engineer', 'Mechanical & Industrial Engineering'),
    job('Mechatronics Engineer', 'Mechanical & Industrial Engineering'),
    job('Process Engineer', 'Mechanical & Industrial Engineering'),
    job('Industrial Production Manager', 'Business & Management'),
  ],

  'Civil Engineering': [
    job('Civil Engineer', 'Civil Engineering'),
    job('Structural Engineer', 'Civil Engineering'),
    job('Geotechnical Engineer', 'Civil Engineering'),
    job('Transportation Engineer', 'Civil Engineering'),
    job('Water Resources Engineer', 'Civil Engineering'),
    job('Construction Engineer', 'Civil Engineering'),
    job('Surveyor', 'Civil Engineering'),
    job('Building Inspector', 'Civil Engineering'),
    job('Construction Manager', 'Business & Management'),
    job('Urban Planner', 'Politics & Public Policy'),
  ],

  'Biomechanical Engineering': [
    job('Biomedical Engineer', 'Biomechanical Engineering'),
    job('Biomechanical Engineer', 'Biomechanical Engineering'),
    job('Rehabilitation Engineer', 'Biomechanical Engineering'),
    job('Clinical Engineer', 'Biomechanical Engineering'),
    job('Medical Device Engineer', 'Biomechanical Engineering'),
    job('Prosthetics Engineer', 'Biomechanical Engineering'),
    job('Orthotics Engineer', 'Biomechanical Engineering'),
    job('Human Factors Engineer', 'Biomechanical Engineering'),
    job('Sports Biomechanist', 'Biomechanical Engineering'),
    job('Research and Development Engineer', 'Biomechanical Engineering'),
  ],

  'Computer Science & Software Development': [
    job('Software Developer', 'Computer Science & Software Development'),
    job('Front-End Developer', 'Computer Science & Software Development'),
    job('Back-End Developer', 'Computer Science & Software Development'),
    job('Full-Stack Developer', 'Computer Science & Software Development'),
    job('Mobile Application Developer', 'Computer Science & Software Development'),
    job('Machine Learning Engineer', 'Computer Science & Software Development'),
    job('DevOps Engineer', 'Computer Science & Software Development'),
    job('Cloud Engineer', 'Computer Science & Software Development'),
    job('Database Architect', 'Computer Science & Software Development'),
    job('Software Quality Assurance Analyst', 'Computer Science & Software Development'),
  ],

  'Computer Engineering': [
    job('Computer Hardware Engineer', 'Computer Engineering'),
    job('Embedded Systems Engineer', 'Computer Engineering'),
    job('Firmware Engineer', 'Computer Engineering'),
    job('FPGA Engineer', 'Computer Engineering'),
    job('Digital Design Engineer', 'Computer Engineering'),
    job('Semiconductor Engineer', 'Computer Engineering'),
    job('Robotics Firmware Engineer', 'Computer Engineering'),
    job('Computer Systems Engineer', 'Computer Engineering'),
    job('IoT Engineer', 'Computer Engineering'),
    job('Hardware Validation Engineer', 'Computer Engineering'),
  ],

  'Environmental Work & Sustainability': [
    job('Environmental Scientist', 'Environmental Work & Sustainability'),
    job('Sustainability Analyst', 'Environmental Work & Sustainability'),
    job('Environmental Consultant', 'Environmental Work & Sustainability'),
    job('Conservation Scientist', 'Environmental Work & Sustainability'),
    job('Climate Policy Analyst', 'Politics & Public Policy'),
    job('GIS Analyst', 'Analytics & Data'),
    job('Environmental Compliance Specialist', 'Environmental Work & Sustainability'),
    job('Corporate Sustainability Analyst', 'Environmental Work & Sustainability'),
    job('Environmental Educator', 'Education'),
    job('Life Cycle Assessment Analyst', 'Environmental Work & Sustainability'),
  ],

  'Information Technology (IT)': [
    job('Computer Systems Analyst', 'Information Technology (IT)'),
    job('Network Administrator', 'Information Technology (IT)'),
    job('Systems Administrator', 'Information Technology (IT)'),
    job('Database Administrator', 'Information Technology (IT)'),
    job('Cloud Administrator', 'Information Technology (IT)'),
    job('IT Support Specialist', 'Information Technology (IT)'),
    job('Help Desk Technician', 'Information Technology (IT)'),
    job('IT Project Manager', 'Information Technology (IT)'),
    job('Solutions Architect', 'Information Technology (IT)'),
    job('IT Auditor', 'Information Technology (IT)'),
  ],

  'Materials Engineering': [
    job('Materials Engineer', 'Materials Engineering'),
    job('Materials Scientist', 'Materials Engineering'),
    job('Metallurgical Engineer', 'Materials Engineering'),
    job('Polymer Engineer', 'Materials Engineering'),
    job('Ceramics Engineer', 'Materials Engineering'),
    job('Corrosion Engineer', 'Materials Engineering'),
    job('Semiconductor Materials Engineer', 'Materials Engineering'),
    job('Failure Analysis Engineer', 'Materials Engineering'),
    job('Materials Quality Engineer', 'Materials Engineering'),
    job('Materials Process Engineer', 'Materials Engineering'),
  ],


  'Education': [
    job('Elementary School Teacher', 'Education'),
    job('Secondary School Teacher', 'Education'),
    job('Special Education Teacher', 'Education'),
    job('Instructional Coordinator', 'Education'),
    job('Curriculum Specialist', 'Education'),
    job('School Administrator', 'Education'),
    job('Academic Advisor', 'Education'),
    job('Education Program Director', 'Education'),
    job('Corporate Trainer', 'People Oriented & Org Development'),
    job('Education Policy Analyst', 'Politics & Public Policy'),
  ],

  'Writing & Journalism': [
    job('Journalist', 'Writing & Journalism'),
    job('News Reporter', 'Writing & Journalism'),
    job('Editor', 'Writing & Journalism'),
    job('Copywriter', 'Writing & Journalism'),
    job('Technical Writer', 'Writing & Journalism'),
    job('Content Writer', 'Writing & Journalism'),
    job('Grant Writer', 'Writing & Journalism'),
    job('Science Writer', 'Writing & Journalism'),
    job('Sports Writer', 'Writing & Journalism'),
    job('Screenwriter', 'Writing & Journalism'),
  ],

  'Politics & Public Policy': [
    job('Chief Policy Analyst', 'Politics & Public Policy'),
    job('Policy Analyst', 'Politics & Public Policy'),
    job('Political Scientist', 'Politics & Public Policy'),
    job('Campaign Manager', 'Politics & Public Policy'),
    job('Political Pollster / Methodologist', 'Politics & Public Policy'),
    job('Lobbyist / Government Relations Lead', 'Politics & Public Policy'),
    job('Legislative Director', 'Politics & Public Policy'),
    job('United States Diplomat', 'Politics & Public Policy'),
    job('Urban Planning Director', 'Politics & Public Policy'),
    job('Public Affairs Director', 'Politics & Public Policy'),
  ],

  'Legal Services': [
    job('Corporate Litigator', 'Legal Services'),
    job('Constitutional Law Scholar', 'Legal Services'),
    job('Criminal Defense Attorney', 'Legal Services'),
    job('Patent Attorney', 'Legal Services'),
    job('Environmental General Counsel', 'Legal Services'),
    job('Appellate Court Judge', 'Legal Services'),
    job('International Trade Lawyer', 'Legal Services'),
    job('M&A Legal Architect', 'Legal Services'),
    job('Jury Consultant Principal', 'Legal Services'),
    job('Entertainment Counsel', 'Legal Services'),
  ],

  'Languages & International Affairs': [
    job('Foreign Service Officer', 'Languages & International Affairs'),
    job('Geopolitical Risk Principal', 'Languages & International Affairs'),
    job('Simultaneous Conference Interpreter', 'Languages & International Affairs'),
    job('International Aid Director', 'Languages & International Affairs'),
    job('Global Supply Chain Director', 'Languages & International Affairs'),
    job('Counter-Terrorism Analyst', 'Languages & International Affairs'),
    job('Localization Product Lead', 'Languages & International Affairs'),
    job('Immigration Law Attorney', 'Languages & International Affairs'),
    job('Ecotourism Infrastructure Developer', 'Languages & International Affairs'),
    job('Cross-Border Media Bureau Chief', 'Languages & International Affairs'),
  ],

  'History & Cultural Heritage': [
    job('Museum Director', 'History & Cultural Heritage'),
    job('Principal Art Conservator', 'History & Cultural Heritage'),
    job('Chief Archivist', 'History & Cultural Heritage'),
    job('Cultural Resource Lead', 'History & Cultural Heritage'),
    job('Forensic Art Historian', 'History & Cultural Heritage'),
    job('Architectural Preservationist', 'History & Cultural Heritage'),
    job('Documentary Film Director', 'History & Cultural Heritage'),
    job('Genealogy Research Director', 'History & Cultural Heritage'),
    job('Rare Book Appraiser', 'History & Cultural Heritage'),
    job('Ethnomusicologist', 'History & Cultural Heritage'),
  ],

  'Media, Communications & Public Relations': [
    job('VP of Corporate Communications', 'Media, Communications & Public Relations'),
    job('Crisis Public Relations Architect', 'Media, Communications & Public Relations'),
    job('Media Econometrician', 'Media, Communications & Public Relations'),
    job('Political Press Secretary', 'Media, Communications & Public Relations'),
    job('Algorithmic Content Producer', 'Media, Communications & Public Relations'),
    job('Executive Publicist', 'Media, Communications & Public Relations'),
    job('Internal Communications Lead', 'Media, Communications & Public Relations'),
    job('Entertainment Talent Manager', 'Media, Communications & Public Relations'),
    job('Audience Research Director', 'Media, Communications & Public Relations'),
    job('First Amendment Law Attorney', 'Media, Communications & Public Relations'),
  ],

  'Arts & Creative Industries': [
    job('Chief Creative Officer', 'Arts & Creative Industries'),
    job('User Experience Architect', 'Arts & Creative Industries'),
    job('Symphony Music Director', 'Arts & Creative Industries'),
    job('Principal Scenic Designer', 'Arts & Creative Industries'),
    job('Medical / Scientific Illustrator', 'Arts & Creative Industries'),
    job('Fine Art Appraiser', 'Arts & Creative Industries'),
    job('Creative Director (Video Games)', 'Arts & Creative Industries'),
    job('Art Therapy Director', 'Arts & Creative Industries'),
    job('Cinematographer / Director of Photography', 'Arts & Creative Industries'),
    job('Fashion Houses Director', 'Arts & Creative Industries'),
  ],

  'Social & Behavioral Sciences': [
    job('Industrial-Organizational Psychologist', 'Social & Behavioral Sciences'),
    job('Clinical Psychologist', 'Social & Behavioral Sciences'),
    job('Behavioral Economist', 'Social & Behavioral Sciences'),
    job('Demographic Modeler', 'Social & Behavioral Sciences'),
    job('User Research Principal', 'Social & Behavioral Sciences'),
    job('DEI Strategy Consultant', 'Social & Behavioral Sciences'),
    job('Public Health Epidemiologist', 'Social & Behavioral Sciences'),
    job('Trial Consultant Methodologist', 'Social & Behavioral Sciences'),
    job('Chief Human Resources Officer', 'Social & Behavioral Sciences'),
    job('Social Policy Director', 'Social & Behavioral Sciences'),
  ],

  'Religion, Ministry & Spiritual Life': [
    job('Hospital Bioethicist', 'Religion, Ministry & Spiritual Life'),
    job('Professor of Divinity / Theology', 'Religion, Ministry & Spiritual Life'),
    job('Senior Pastor / Clergy Director', 'Religion, Ministry & Spiritual Life'),
    job('Interfaith Conflict Mediator', 'Religion, Ministry & Spiritual Life'),
    job('Grief / Trauma Counselor', 'Religion, Ministry & Spiritual Life'),
    job('Religious Nonprofit Executive Director', 'Religion, Ministry & Spiritual Life'),
    job('Theological Archivist', 'Religion, Ministry & Spiritual Life'),
    job('Liturgical Music Composer', 'Religion, Ministry & Spiritual Life'),
    job('Refugee Resettlement Director', 'Religion, Ministry & Spiritual Life'),
    job('Social Justice Advocacy Lead', 'Religion, Ministry & Spiritual Life'),
  ],
  Accounting: [
  job('Auditor', 'Finance'),
  job('Accountant / Auditor', 'Finance'),
  job('Financial Analyst', 'Finance'),
  job('Financial Manager', 'Finance'),
  job('Treasurer', 'Finance'),
],

'Mathematics & Statistics': [
  job('Quantitative Trader', 'Finance'),
  job('Actuary', 'Business & Management'),
  job('Statistician', 'Analytics & Data'),
  job('Mathematician', 'Analytics & Data'),
  job('Operations Research Analyst', 'Analytics & Data'),
  job('Financial Quantitative Analyst', 'Finance'),
],

'Business Intelligence': [
  job('Business Intelligence Analyst', 'Analytics & Data'),
  job('Data Scientist', 'Analytics & Data'),
  job('Operations Research Analyst', 'Analytics & Data'),
  job('Management Analyst', 'Business & Management'),
  job('Business Operations Specialist', 'Business & Management'),
],

Healthcare: [
  job('Biostatistician', 'Analytics & Data'),
  job('Data Scientist', 'Analytics & Data'),
  job('Statistician', 'Analytics & Data'),
  job('Operations Research Analyst', 'Analytics & Data'),
  job('Business Intelligence Analyst', 'Analytics & Data'),
],
};

export const quizJobProfiles: QuizJobProfile[] = quizJobProfilesData
  .map((jobProfile) => {
    const categoryId = toQuizProfileCategoryId(jobProfile.categoryId);

    if (!categoryId || !isExistingJobSourceCategory(jobProfile.sourceCategory)) {
      return null;
    }

    return {
      id: jobProfile.id,
      title: jobProfile.title,
      categoryId,
      sourceCategory: jobProfile.sourceCategory,
      shortDescription: jobProfile.shortDescription,
      keyStrengths: [...jobProfile.keyStrengths],
      possibleSkillGaps: [...jobProfile.possibleSkillGaps],
      recommendedCourseIds: [...jobProfile.recommendedCourseIds],
      internships: jobProfile.internships,
      isPlaceholder: jobProfile.isPlaceholder,
    };
  })
  .filter((jobProfile): jobProfile is QuizJobProfile => Boolean(jobProfile));

export const quizCourseProfiles: QuizCourseProfile[] = quizCourseProfilesData.map(
  (courseProfile) => {
    const requiredForCategoryIds = courseProfile.requiredForMajorIds
      .map(toQuizProfileCategoryId)
      .filter((categoryId) => categoryId !== null)
    return {
      id: courseProfile.id,
      courseCode: courseProfile.courseCode,
      courseName: courseProfile.title,
      relatedCategoryIds: requiredForCategoryIds,
      relatedJobIds: [],
      requiredForCategoryIds,
      requiredForJobIds: 'requiredForJobIds' in courseProfile
        ? [...(courseProfile as any).requiredForJobIds]
        : [],
      prerequisites: [...courseProfile.prerequisites],
      isPlaceholder: courseProfile.isPlaceholder,
    };
  },
);

export function getQuizJobsForCategory(categoryId: QuizCategoryId): QuizJobEntry[] {
  return quizJobLibrary[categoryId];
}

export function getQuizJobProfile(jobId: string): QuizJobProfile | undefined {
  return quizJobProfiles.find((jobProfile) => jobProfile.id === jobId);
}
