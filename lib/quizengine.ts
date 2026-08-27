import { quizProfiles, type QuizProfile } from './quizprofiles';
import {
  getQuizJobProfile,
  isQuizCategoryId,
  quizCategoryIds,
  quizCourseProfiles,
  quizJobProfiles,
  quizSkillLibrary,
  type QuizCategoryId,
  type QuizCourseProfile,
  type QuizJobEntry,
  type QuizProfileCategoryId,
} from './quizjobs';
const quizQuestionWeights = {
  major_interest: 1.1,
  natural_work_type: 1.1,
  career_motivation: 1.0,
  work_environment: 0.9,
  people_or_tasks: 1.0,
  grad_school: 0.75,
  curious_career_field: 1.1,
  creative_or_analytical: 1.0,
  skill_gaps: 0,

  career_clarity: 0.7,
  career_planning_difficulty: 0.65,
  biggest_worry: 0.65,
  internship_readiness: 0.7,
  current_need: 0.75,

  career_resources_usage: 0.0,
  loyola_motivation: 0.0,
  loyola_graduation_goal: 0.4,
  desired_outcome: 0.9,
  career_planning_wish: 0.0,
} as const;

export const majorClusterIds = [
  'Tech',
  'Sciences',
  'Engineering',
  'Business',
  'Humanities',
] as const;

export const careerFieldClusterIds = [
  'Technology & Data',
  'Business & Finance',
  'Economics & Public Impact',
  'Health & Sciences',
  'Engineering',
  'Humanities & Social Sciences'
] as const;

export const workTypeCluster = [
  'Data & Research',
  'Business & Finance',
  'Technology & Engineering',
  'Marketing & Communication',
  'Management & Operations',
  'Health, Science & Environment'
] as const;

export const skillsCluster = [
  'Technical',
  'Business',
  'Financial',
  'Analytical',
  'Creative',
  'Communication',
  'Scientific',
  'Educational',
  'Political & Legal',
  'Human Behavior & Belief',
  'Language & Culture',
]
export type MajorClusterId = (typeof majorClusterIds)[number];
export type CareerFieldClusterId = (typeof careerFieldClusterIds)[number];
export type WorkTypeClusterId = (typeof workTypeCluster)[number];
export type SkillsClusterId = (typeof skillsCluster)[number];

export type QuizAggregateField =
  | 'majorInterest'
  | 'careerClarity'
  | 'internshipReadiness'
  | 'biggestWorry'
  | 'careerPlanningDifficulty'
  | 'loyolaMotivation'
  | 'loyolaGraduationGoal'
  | 'desiredOutcome'
  | 'careerPlanningWish'
  | 'careerResourcesUsage';

export interface QuizAnswerCategoryMapping {
  categoryId: QuizCategoryId;
  weight?: number;
}

export interface QuizAnswerJobMapping {
  jobId: string;
  weight: number;
}

export interface QuizAnswerCourseMapping {
  courseId: string;
  courseLabel: string;
  courseMappings?: QuizAnswerCategoryMapping[];
  weight: number;
}

export interface JobInternshipType {
  internshipId: string;
  internshipTitle: string;
  reasons: string[];
  suggestedSearchTerms?: string[];
}

export interface QuizAnswerOption {
  id: string;
  label: string;
  categoryMappings: QuizAnswerCategoryMapping[];
  aggregateValue?: string;
  majorCluster?: MajorClusterId;
  workTypeCluster?: WorkTypeClusterId;
  careerCluster?: CareerFieldClusterId;
  skillsCluster?: SkillsClusterId;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  weight: number;
  answerOptions: QuizAnswerOption[];
  aggregateField?: QuizAggregateField;
}

export interface QuizAggregateInsights {
  majorInterest: string | null;
  careerClarity: string | null;
  internshipReadiness: string | null;
  biggestWorry: string | null;
  careerPlanningDifficulty: string | null;
  loyolaMotivation: string | null;
  loyolaGraduationGoal: string | null;
  desiredOutcome: string | null;
  careerPlanningWish: string | null;
  careerResourcesUsage: string | null;
}

export interface RankedQuizCategory {
  categoryId: QuizCategoryId;
  displayName: string;
  score: number;
  courses: string[];
  shortDescription: string;
  jobs: QuizJobEntry[];
  skills: string[];
}

export interface MiniQuizResult {
  topCategories: RankedQuizCategory[];
  matchingJobs: QuizJobEntry[];
  insight: string;
  callToAction: string;
  aggregateInsights: QuizAggregateInsights;
  answeredQuestions: number;
  previewMode: boolean;
}

export interface PathPilotResult {
  profileSummary: ProfileSummary;
  categoryRecommendations: CategoryRecommendation[];
  jobRecommendations: ScoredJobRecommendation[];
  courseRecommendations: ScoredCourseRecommendation[];
  timeline: CareerTimeline;
  nextSteps: NextStep[];
}

export interface ProfileSummary {
  majors: string[];
  strongestTalents: string[];
  strongestSkills: string[];
  workStyle: string;
  desiredFields: string[];
  desiredOutcomes: string[];
  careerClarity?: string;
  internshipReadiness?: string;
}

export interface CategoryRecommendation {
  categoryId: QuizCategoryId;
  categoryName: string;
  score: number;
  rank: number;
  reasons: string[];
  topJobs: string[];
}

export interface ScoredJobRecommendation {
  jobId: string;
  jobTitle: string;
  categoryId: QuizProfileCategoryId;
  score: number;
  rank: number;
  reasons: string[];
  keyStrengths: string[];
  skillGaps: string[];
  recommendedCourseIds: string[];
  recommendedInternships: Record<string, JobInternshipType>;
  scoreBasis: 'direct-match' | 'category-fallback';
  isPlaceholder: boolean;
}

export interface ScoredCourseRecommendation {
  courseId: string;
  courseCode: string;
  courseName: string;
  score: number;
  rank: number;
  priority: 'Required' | 'High Priority' | 'Helpful' | 'Optional';
  relatedJobIds: string[];
  relatedCategoryIds: QuizProfileCategoryId[];
  reasons: string[];
  prerequisites: string[];
  completed: boolean;
  isPlaceholder: boolean;
}

export interface CareerTimeline {
  currentStage: string;
  stages: TimelineStage[];
  milestones: CareerMilestone[];
}

export interface TimelineStage {
  stageId: string;
  title: string;
  courses: string[];
  internshipActions: string[];
  projects: string[];
  skills: string[];
  networkingActions: string[];
}

export interface CareerMilestone {
  milestoneId: string;
  title: string;
  description: string;
  targetStage: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface NextStep {
  stepId: string;
  title: string;
  description: string;
  order: number;
  category: 'Course' | 'Internship' | 'Skill' | 'Project' | 'Networking' | 'Career Center';
  completed: boolean;
}

export type QuizSelections = Partial<Record<string, string>>;

interface ResolvedQuizSelection {
  question: QuizQuestion;
  answerOption: QuizAnswerOption;
}

type QuizMappingTargetType = 'job' | 'course';

interface ParsedQuizMappingRow {
  questionId: string;
  answerId: string;
  targetType: QuizMappingTargetType;
  targetId: string;
  weight: number;
}

interface QuizMappingsLookup {
  answerJobMappings: Map<string, QuizAnswerJobMapping[]>;
  answerCourseMappings: Map<string, QuizAnswerCourseMapping[]>;
  jobQuestionMaximumWeights: Map<string, Map<string, number>>;
  courseQuestionMaximumWeights: Map<string, Map<string, number>>;
}

const quizCategoryCourses: Record<QuizCategoryId, readonly string[]> = {
  "Marketing & Advertising": [
    "Market Research Methods",
    "Advertising Management",
    "Integrated Marketing Communication",
  ],

  Healthcare: [
    "Human Anatomy and Physiology",
    "Nursing Care for Adults",
    "Writing About Health",
  ],

  "Analytics & Data": [
    "Python for Data Work",
    "Statistics for Decision Making",
    "Data Visualization",
  ],

  "Business Intelligence": [
    "Business Intelligence Foundations",
    "Business Intelligence and Data Mining",
    "Enterprise Systems",
  ],

  "Business & Management": [
    "Strategic Management",
    "Operations Management",
    "Organizational Behavior",
  ],

  Cybersecurity: [
    "Cybersecurity",
    "Cybersecurity Digital Forensics",
    "Computer Networking",
  ],

  "Information Technology (IT)": [
    "System Design and Analysis",
    "Database Management Systems",
    "Introduction to Linux",
  ],

  Finance: [
    "Survey of Finance",
    "Financial Modeling",
    "Financial Management",
  ],

  "Science & Research": [
    "Experimental Methods",
    "Quantitative Chemical Analysis",
    "Writing About Science",
  ],

  "Electrical Engineering": [
    "Linear Circuits Analysis",
    "Signals and Systems",
    "Electronics",
  ],

  "Mechanical & Industrial Engineering": [
    "Statics",
    "Solid Mechanics",
    "Thermodynamics",
  ],

  "Civil Engineering": [
    "Statics",
    "Fluid Mechanics",
    "Engineering Design Project I",
  ],

  "Biomechanical Engineering": [
    "Biomechanics of Sports and Exercise",
    "Physics of Medicine and the Human Body",
    "Human Anatomy and Physiology",
  ],

  "Computer Science & Software Development": [
    "Object-Oriented Software Design",
    "Software Engineering",
    "Algorithm Analysis",
  ],

  "Computer Engineering": [
    "Digital Logic",
    "Computer Architecture",
    "Embedded Systems",
  ],

  Economics: [
    "Microeconomics",
    "Econometrics",
    "Mathematical Economics",
  ],

  "Environmental Work & Sustainability": [
    "Environmental Science and Sustainability",
    "Environmental Law and Policy",
    "Global Environment",
  ],

  Accounting: [
    "Financial Accounting",
    "Auditing",
    "Accounting Information Systems",
  ],

  "Mathematics & Statistics": [
    "Calculus I",
    "Probability and Statistics",
    "Linear Algebra",
  ],

  "Materials Engineering": [
    "Introduction to Engineering Materials",
    "Materials Science Lab",
    "Materials",
  ],

  Education: [
    "Introduction to Education",
    "Educational Psychology",
    "Comprehensive Classroom Management",
  ],

  "Writing & Journalism": [
    "News Reporting and Writing",
    "Professional Writing",
    "Writing and Editing for Publication",
  ],

  "Politics & Public Policy": [
    "Introduction to Public Policy",
    "American Politics",
    "Comparative Politics",
  ],

  "Legal Services": [
    "Analytical and Legal Reasoning",
    "Constitutional Law: Individual Liberties",
    "International Business Law",
  ],

  "Languages & International Affairs": [
    "Spanish 104",
    "French 104",
    "Upper-Level Language",
  ],

  "History & Cultural Heritage": [
    "The Historian's Craft",
    "Encountering the Past",
    "Introduction to Public History",
  ],

  "Media, Communications & Public Relations": [
    "Fundamentals of Advertising and Public Relations",
    "Writing for Public Relations",
    "Media Relations",
  ],

  "Arts & Creative Industries": [
    "Introduction to Theater Design",
    "Animation and Motion Graphics",
    "Music Fundamentals",
  ],

  "Social & Behavioral Sciences": [
    "Introduction to Psychology",
    "Social Psychology",
    "Introduction to Sociology",
  ],

  "Religion, Ministry & Spiritual Life": [
    "Christian Theology and World Religions",
    "Ethics: Immigration and Catholic Social Teaching",
    "Law and Religion",
  ],
};

const QUIZ_MAPPINGS_CSV_FALLBACK = String.raw`question_id,answer_id,target_type,target_id,weight
major_interest,accounting,job,accountant_and_auditor,1
major_interest,accounting,job,financial_analyst,0.65
major_interest,accounting,job,financial_and_investment_analyst,0.45
major_interest,accounting,course,financial_accounting,1
major_interest,accounting,course,auditing,0.9
major_interest,finance,job,financial_analyst,1
major_interest,finance,job,financial_and_investment_analyst,0.9
major_interest,finance,job,financial_manager,0.7
major_interest,finance,job,personal_financial_advisor,0.55
major_interest,finance,course,financial_modeling,1
major_interest,finance,course,financial_accounting,0.7
major_interest,info_systems_data_analytics,job,business_intelligence_analyst,1
major_interest,info_systems_data_analytics,job,data_scientist,0.8
major_interest,info_systems_data_analytics,course,business_intelligence_foundations,1
major_interest,info_systems_data_analytics,course,data_visualization,0.8
major_interest,data_science,job,data_scientist,1
major_interest,data_science,job,business_intelligence_analyst,0.75
major_interest,data_science,course,statistics_for_decision_making,0.9
major_interest,data_science,course,python_for_data_work,1
major_interest,mathematics,job,actuary,0.95
major_interest,mathematics,job,statistician,0.9
major_interest,mathematics,job,mathematician,0.9
major_interest,mathematics,course,statistics_for_decision_making,0.85
major_interest,business_economics,job,economist,0.85
major_interest,business_economics,job,financial_analyst,0.65
major_interest,business_economics,job,market_research_analyst,0.55
major_interest,business_economics,course,financial_modeling,0.5
major_interest,marketing,job,market_research_analyst,0.9
major_interest,marketing,job,search_marketing_strategist,1
major_interest,marketing,job,advertising_and_promotions_manager,0.75
major_interest,marketing,course,market_research_methods,1
major_interest,marketing,course,data_visualization,0.45
major_interest,management_consulting,job,management_analyst,1
major_interest,management_consulting,job,project_management_specialist,0.75
major_interest,management_consulting,job,business_operations_specialist,0.65
major_interest,management_consulting,course,project_management_fundamentals,0.7
major_interest,supply_chain_management,job,industrial_production_manager,0.95
major_interest,supply_chain_management,job,business_operations_specialist,0.8
major_interest,supply_chain_management,job,operations_research_analyst,0.55
major_interest,supply_chain_management,course,operations_management,1
major_interest,supply_chain_management,course,project_management_fundamentals,0.5
major_interest,sustainability_management,job,environmental_economist,0.8
major_interest,sustainability_management,job,operations_research_analyst,0.4
major_interest,sustainability_management,course,operations_management,0.4
major_interest,economics,job,economist,1
major_interest,economics,job,environmental_economist,0.7
major_interest,economics,job,financial_analyst,0.6
major_interest,economics,course,statistics_for_decision_making,0.5
natural_work_type,tracking_costs_records,job,accountant_and_auditor,1
natural_work_type,tracking_costs_records,job,financial_analyst,0.55
natural_work_type,tracking_costs_records,course,auditing,1
natural_work_type,tracking_costs_records,course,financial_accounting,0.95
natural_work_type,managing_money_risk,job,financial_analyst,1
natural_work_type,managing_money_risk,job,financial_and_investment_analyst,0.9
natural_work_type,managing_money_risk,job,actuary,0.7
natural_work_type,managing_money_risk,job,personal_financial_advisor,0.7
natural_work_type,managing_money_risk,course,financial_modeling,1
natural_work_type,finding_patterns_in_data,job,business_intelligence_analyst,0.95
natural_work_type,finding_patterns_in_data,job,data_scientist,0.85
natural_work_type,finding_patterns_in_data,job,statistician,0.8
natural_work_type,finding_patterns_in_data,course,data_visualization,0.85
natural_work_type,finding_patterns_in_data,course,statistics_for_decision_making,0.85
natural_work_type,finding_patterns_in_data,course,python_for_data_work,0.6
natural_work_type,researching_and_testing_ideas,job,data_scientist,0.75
natural_work_type,researching_and_testing_ideas,job,operations_research_analyst,0.8
natural_work_type,researching_and_testing_ideas,job,biostatistician,0.7
natural_work_type,researching_and_testing_ideas,job,economist,0.55
natural_work_type,researching_and_testing_ideas,course,statistics_for_decision_making,0.8
natural_work_type,persuading_and_promoting,job,advertising_sales_agent,0.9
natural_work_type,persuading_and_promoting,job,public_relations_specialist,0.8
natural_work_type,persuading_and_promoting,job,marketing_manager,0.7
natural_work_type,persuading_and_promoting,course,market_research_methods,0.45
natural_work_type,planning_campaigns_content,job,search_marketing_strategist,1
natural_work_type,planning_campaigns_content,job,market_research_analyst,0.65
natural_work_type,planning_campaigns_content,job,public_relations_specialist,0.6
natural_work_type,planning_campaigns_content,course,market_research_methods,0.6
natural_work_type,planning_campaigns_content,course,data_visualization,0.4
natural_work_type,organizing_people_projects,job,project_management_specialist,1
natural_work_type,organizing_people_projects,job,business_operations_specialist,0.75
natural_work_type,organizing_people_projects,job,facilities_manager,0.55
natural_work_type,organizing_people_projects,course,project_management_fundamentals,1
natural_work_type,organizing_people_projects,course,operations_management,0.5
natural_work_type,improving_processes_operations,job,industrial_production_manager,1
natural_work_type,improving_processes_operations,job,quality_control_systems_manager,0.9
natural_work_type,improving_processes_operations,job,business_operations_specialist,0.75
natural_work_type,improving_processes_operations,course,operations_management,1
natural_work_type,improving_processes_operations,course,project_management_fundamentals,0.45
natural_work_type,turning_tech_into_business_value,job,business_intelligence_analyst,0.9
natural_work_type,turning_tech_into_business_value,job,management_analyst,0.7
natural_work_type,turning_tech_into_business_value,job,sales_engineer,0.65
natural_work_type,turning_tech_into_business_value,course,business_intelligence_foundations,0.9
natural_work_type,turning_tech_into_business_value,course,data_visualization,0.6
people_or_tasks,tasks,job,accountant_and_auditor,0.45
people_or_tasks,tasks,job,business_intelligence_analyst,0.45
people_or_tasks,tasks,job,data_scientist,0.35
people_or_tasks,tasks,course,auditing,0.35
people_or_tasks,tasks,course,statistics_for_decision_making,0.35
people_or_tasks,people,job,public_relations_specialist,0.55
people_or_tasks,people,job,human_resources_specialist,0.65
people_or_tasks,people,job,human_resources_manager,0.45
people_or_tasks,people,job,training_and_development_specialist,0.55
people_or_tasks,people,course,project_management_fundamentals,0.35
grad_school,yes_grad_school,job,data_scientist,0.35
grad_school,yes_grad_school,job,biostatistician,0.45
grad_school,yes_grad_school,job,economist,0.35
grad_school,yes_grad_school,job,actuary,0.25
grad_school,yes_grad_school,course,statistics_for_decision_making,0.45`;

let cachedMappingsCsvText: string | null = null;
let cachedQuizMappingsLookup: QuizMappingsLookup | null = null;

export const quizAggregateFieldLabels: Record<QuizAggregateField, string> = {
  majorInterest: 'Major interest',
  careerClarity: 'Career clarity',
  internshipReadiness: 'Internship readiness',
  biggestWorry: 'Biggest worry',
  careerPlanningDifficulty: 'Career planning difficulty',
  loyolaMotivation: 'Loyola motivation',
  loyolaGraduationGoal: 'Loyola graduation goal',
  desiredOutcome: 'Desired outcome',
  careerPlanningWish: 'Career planning wish',
  careerResourcesUsage: 'Career resources usage',
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'major_interest',
    questionText: 'What are you currently studying or leaning toward?',
    weight: quizQuestionWeights.major_interest,
    answerOptions: [
      {
        id: 'info_systems_data_analytics',
        label: 'Info Systems & Data Analytics',
        majorCluster: 'Tech',
        categoryMappings: [
          { categoryId: 'Analytics & Data', weight: 1 },
          { categoryId: 'Business Intelligence', weight: 1 },
          { categoryId: 'Computer Science & Software Development', weight: 0.5 },
        ],
        aggregateValue: 'Info Systems & Data Analytics',
      },
      {
        id: 'accounting',
        label: 'Accounting',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Finance', weight: 0.6 },
          { categoryId: 'Business & Management', weight: 0.5 },
          { categoryId: 'Accounting', weight: 1 },
        ],
        aggregateValue: 'Accounting',
      },
      {
        id: 'business_economics',
        label: 'Business Economics',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Business & Management', weight: 1 },
          { categoryId: 'Finance', weight: 0.75 },
          { categoryId: 'Economics', weight: 1 },
        ],
        aggregateValue: 'Business Economics',
      },
      {
        id: 'advertising',
        label: 'Advertising',
        majorCluster: 'Business',
        categoryMappings: [
          {categoryId: 'Marketing & Advertising', weight: 0.98},
          {categoryId: 'Business & Management', weight: 0.78},
        ],
        aggregateValue: 'Advertising'
      },
      {
        id: 'financial_risk_management',
        label: 'Financial Risk Management',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Finance', weight: 1 },
          { categoryId: 'Economics', weight: 0.75 },
          { categoryId: 'Business & Management', weight: 0.5 },
        ],
        aggregateValue: 'Financial Risk Management',
      },
      {
        id: 'forensic_accounting',
        label: 'Forensic Accounting',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Finance', weight: 0.75 },
          { categoryId: 'Business & Management', weight: 0.5 },
          { categoryId: 'Accounting', weight: 1 },
        ],
        aggregateValue: 'Forensic Accounting',
      },
      {
        id: 'international_business',
        label: 'International Business',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Business & Management', weight: 1 },
          { categoryId: 'Economics', weight: 0.75 },
        ],
        aggregateValue: 'International Business',
      },
      {
        id: 'management_consulting',
        label: 'Management Consulting',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Business & Management', weight: 1 },
          { categoryId: 'Finance', weight: 0.5 },
        ],
        aggregateValue: 'Management Consulting',
      },
      {
        id: 'marketing',
        label: 'Marketing',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Marketing & Advertising', weight: 1 },
          { categoryId: 'Business & Management', weight: 0.75 },
        ],
        aggregateValue: 'Marketing',
      },
      {
        id: 'real_estate',
        label: 'Real Estate',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Business & Management', weight: 1 },
          { categoryId: 'Finance', weight: 1 },
          { categoryId: 'Economics', weight: 0.5 },
        ],
        aggregateValue: 'Real Estate',
      },
      {
        id: 'finance',
        label: 'Finance',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Finance', weight: 1 },
          { categoryId: 'Business & Management', weight: 0.5 },
          { categoryId: 'Economics', weight: 0.5 },
        ],
        aggregateValue: 'Finance',
      },
      {
        id: 'supply_chain_management',
        label: 'Supply Chain Management',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Business & Management', weight: 1 },
          { categoryId: 'Analytics & Data', weight: 0.5 },
          { categoryId: 'Economics', weight: 0.75 },
        ],
        aggregateValue: 'Supply Chain Management',
      },
      {
        id: 'sustainability_management',
        label: 'Sustainability Management',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Environmental Work & Sustainability', weight: 1 },
          { categoryId: 'Business & Management', weight: 0.5 },
        ],
        aggregateValue: 'Sustainability Management',
      },
      {
        id: 'economics',
        label: 'Economics',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Economics', weight: 1 },
          { categoryId: 'Finance', weight: 0.75 },
          { categoryId: 'Business & Management', weight: 0.5 },
        ],
        aggregateValue: 'Economics',
      },
      {
        id: 'business_administration_general_business',
        label: 'Business Administration (General Business)',
        majorCluster: 'Business',
        categoryMappings: [
          { categoryId: 'Business & Management', weight: 1 },
          { categoryId: 'Finance', weight: 0.5 },
          { categoryId: 'Economics', weight: 0.5 },
        ],
        aggregateValue: 'Business Administration (General Business)',
      },
      {
        id: 'data_science',
        label: 'Data Science',
        majorCluster: 'Tech',
        categoryMappings: [
          { categoryId: 'Analytics & Data', weight: 1 },
          { categoryId: 'Business Intelligence', weight: 1 },
          { categoryId: 'Computer Science & Software Development', weight: 0.75 },
        ],
        aggregateValue: 'Data Science',
      },
      {
        id: 'computer_science',
        label: 'Computer Science',
        majorCluster: 'Tech',
        categoryMappings: [
          { categoryId: 'Computer Science & Software Development', weight: 0.95},
          { categoryId: 'Information Technology (IT)', weight: 0.71},
          { categoryId: 'Business Intelligence', weight: 0.59}
        ]
      },
      {
        id: 'mathematics',
        label: 'Mathematics',
        majorCluster: 'Engineering',
        categoryMappings: [
          { categoryId: 'Mathematics & Statistics', weight: 1 },
          { categoryId: 'Analytics & Data', weight: 0.75 },
        ],
        aggregateValue: 'Mathematics',
      },
      {
        id: 'physics',
        label: 'Physics',
        majorCluster: 'Engineering',
        categoryMappings: [
          { categoryId: 'Science & Research', weight: 0.9 },
          { categoryId: 'Mechanical & Industrial Engineering', weight: 0.75 },
          { categoryId: 'Electrical Engineering', weight: 0.7}
        ],
        aggregateValue: 'Mathematics',
      },
      {
        id: 'computer_engineering',
        label: 'Computer Engineering',
        majorCluster: 'Engineering',
        categoryMappings: [
          {categoryId: 'Computer Engineering', weight: 1},
          {categoryId: 'Electrical Engineering', weight: 0.8}
        ],
        aggregateValue: 'Engineering',
      },
      {
        id: 'mechanical_engineering',
        label: 'Mechanical Engineering',
        majorCluster: 'Engineering',
        categoryMappings: [
          {categoryId: 'Mechanical & Industrial Engineering', weight: 1},
          {categoryId: 'Computer Engineering', weight: 0.7}
        ],
        aggregateValue: 'Engineering',
      },
      {
        id: 'electrical_engineering',
        label: 'Electrical Engineering',
        majorCluster: 'Engineering',
        categoryMappings: [],
        aggregateValue: 'Engineering',
      },
            {
        id: 'materials_engineering',
        label: 'Materials Engineering',
        majorCluster: 'Engineering',
        categoryMappings: [],
        aggregateValue: 'Engineering',
      },
      {
        id: 'biochemistry',
        label: 'Biochemistry',
        majorCluster: 'Sciences',
        categoryMappings: [],
        aggregateValue: 'Healthcare'
      },
      {
        id: 'nursing',
        label: 'Nursing',
        majorCluster: 'Sciences',
        categoryMappings: [
          { categoryId: 'Healthcare', weight: 0.91, },
          {  categoryId: 'Science & Research', weight: 0.73 }
        ],
      },
      {
        id: 'biohealth',
        label: 'Biohealth',
        majorCluster: 'Sciences',
        categoryMappings: [],
        aggregateValue: 'Healthcare',
      },
      {
        id: 'biology',
        label: 'Biology',
        majorCluster: 'Sciences',
        categoryMappings: [],
        aggregateValue: 'Healthcare',
      },
      {
        id: 'chemistry',
        label: 'Chemistry',
        majorCluster: 'Sciences',
        categoryMappings: [
          {categoryId: 'Science & Research', weight: 0.94},
          {categoryId: 'Healthcare', weight: 0.75},
          {categoryId: 'Materials Engineering', weight: 0.67}
        ],
        aggregateValue: 'Science & Research'
      },
      {
        id: 'forensics',
        label: 'Forensic Science',
        majorCluster: 'Sciences',
        categoryMappings: [
          {categoryId: 'Science & Research', weight: 0.95},
          {categoryId: 'Mathematics & Statistics', weight: 0.63}
        ],
        aggregateValue: 'Science & Research'
      },
    {
      id: 'education',
      label: 'Education',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Education', weight: 0.93},
      ],
      aggregateValue: 'Education'
    },
    {
      id: 'elementary_education',
      label: 'Elementary Education',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Education', weight: 0.96}
      ],
      aggregateValue: 'Education'
    },
    {
      id: 'environmental_science',
      label: 'Environmental Science',
      majorCluster: 'Sciences',
      categoryMappings: [
        {categoryId: 'Environmental Work & Sustainability', weight: 0.98},
        {categoryId: 'Business & Management', weight: 0.69},
        {categoryId: 'Science & Research', weight: 0.77}
      ],
      aggregateValue: 'Environmental Science'
    },
    {
      id: 'environmental_studies',
      label: 'Environmental Studies',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Environmental Work & Sustainability', weight: 0.98},
        {categoryId: 'Education', weight: 0.63}
      ],
      aggregateValue: 'Environmental Studies'
    },
    {
      id: 'french',
      label: 'French',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Education', weight: 0.85},
        {categoryId: 'Marketing & Advertising', weight: 0.58}
      ],
      aggregateValue: 'French'
    },
    {
      id: 'global_studies',
      label: 'Global Studies',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Languages & International Affairs', weight: 0.95},
        {categoryId: 'History & Cultural Heritage', weight: 0.88},
        {categoryId: 'Politics & Public Policy', weight: 0.63}
      ],
      aggregateValue: 'Global Studies'
    },
    {
      id: 'history',
      label: 'History',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'History & Cultural Heritage', weight: 0.89},
        {categoryId: 'Legal Services', weight: 0.87}
      ],
      aggregateValue: 'History'
    },
    {
      id: 'journalism',
      label: 'Journalism',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Writing & Journalism', weight: 0.93},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.86},
        {categoryId: 'Languages & International Affairs', weight: 0.65}
      ],
      aggregateValue: 'Journalism'
    },
    {
      id: 'music',
      label: 'Music',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Arts & Creative Industries', weight: 0.96},
        {categoryId: 'Education', weight: 0.85},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.71}
      ],
      aggregateValue: 'Music'
    },
    {
      id: 'performing_arts',
      label: 'Performing Arts',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Arts & Creative Industries', weight: 0.99},
        {categoryId: 'Education', weight: 0.85},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.71}
      ],
      aggregateValue: 'Performing Arts'
    },
    {
      id: 'philosophy',
      label: 'Philosophy',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'History & Cultural Heritage', weight: 0.87},
        {categoryId: 'Education', weight: 0.85},
        {categoryId: 'Legal Services', weight: 0.88},
        {categoryId: 'Politics & Public Policy', weight: 0.83},
        {categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.58}
      ],
      aggregateValue: 'Philosophy'
    },
    {
      id: 'photography',
      label: 'Photography',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Writing & Journalism', weight: 0.85},
        {categoryId: 'Arts & Creative Industries', weight: 0.91},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.79}
      ],
      aggregateValue: 'Photography'
    },
    {
      id: 'political_science',
      label: 'Political Science',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Legal Services', weight: 0.93},
        {categoryId: 'Politics & Public Policy', weight: 0.96},
        {categoryId: 'History & Cultural Heritage', weight: 0.87},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.74},
      ]
    },
    {
      id: 'psychology',
      label: 'Psychology',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'History & Cultural Heritage', weight: 0.61},
        {categoryId: 'Social & Behavioral Sciences', weight: 0.97},
        {categoryId: 'Marketing & Advertising', weight: 0.64},
        {categoryId: 'Business & Management', weight: 0.58},
        {categoryId: 'Science & Research', weight: 0.67}
      ],
      aggregateValue: 'Psychology'
    },
    {
      id: 'sociology',
      label: 'Sociology',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Social & Behavioral Sciences', weight: 0.97},
        {categoryId: 'History & Cultural Heritage', weight: 0.85},
        {categoryId: 'Languages & International Affairs', weight: 0.75},
        {categoryId: 'Legal Services', weight: 0.7}
      ],
      aggregateValue: 'Sociology'
    },
    {
      id: 'spanish',
      label: 'Spanish',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Languages & International Affairs', weight: 0.91},
        {categoryId: 'Education', weight: 0.81},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.61}
      ],
      aggregateValue: 'Spanish'
    },
    {
      id: 'studio_art',
      label: 'Studio Art',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Arts & Creative Industries', weight: 0.91},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.85},
      ],
      aggregateValue: 'Studio Art'
    },
    {
      id: 'theater',
      label: 'Theater',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Arts & Creative Industries', weight: 0.9},
        {categoryId: 'Education', weight: 0.74},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.61}
      ],
      aggregateValue: 'Theater'
    },
    {
      id: 'special_education',
      label: 'Special Education',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Education', weight: 0.99},
        {categoryId: 'Science & Research', weight: 0.65}
      ],
      aggregateValue: 'Special Education'
    },
    {
      id: 'speech_language_hearing_sciences',
      label: 'Speech-Language-Hearing Sciences',
      majorCluster: 'Sciences',
      categoryMappings: [
        {categoryId: 'Education', weight: 0.95},
        {categoryId: 'Social & Behavioral Sciences', weight: 0.91},
        {categoryId: 'Science & Research', weight: 0.73}
      ],
      aggregateValue: 'Speech-Language-Hearing Sciences'
    },
    {
      id: 'theology',
      label: 'Theology',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Social & Behavioral Sciences', weight: 0.71},
        {categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.99},
        {categoryId: 'Education', weight: 0.67}
      ],
      aggregateValue: 'Theology'
    },
    {
      id: 'visual_arts',
      label: 'Visual Arts',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Arts & Creative Industries', weight: 0.93},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.85},
        {categoryId: 'Marketing & Advertising', weight: 0.71}
      ],
      aggregateValue: 'Visual Arts'
    },
    {
      id: 'writing',
      label: 'Writing',
      majorCluster: 'Humanities',
      categoryMappings: [
        {categoryId: 'Writing & Journalism', weight: 0.95},
        {categoryId: 'Marketing & Advertising', weight: 0.63},
        {categoryId: 'Education', weight: 0.71},
      ],
      aggregateValue: 'Writing'
    },
    {
      id: 'english',
      label: 'English',
      categoryMappings: [
        {categoryId: 'Education', weight: 0.81},
        {categoryId: 'Writing & Journalism', weight: 0.91},
        {categoryId: 'Media, Communications & Public Relations', weight: 0.84},
        {categoryId: 'Legal Services', weight: 0.89},
        {categoryId: 'Languages & International Affairs', weight: 0.85}
      ]
    }
    ],
    aggregateField: 'majorInterest',
  },
  
{
  id: 'natural_work_type',

  questionText: 'Which kind of work could you see yourself enjoying?',

  weight: quizQuestionWeights.natural_work_type,

  answerOptions: [
    {
      id: 'finding_patterns_in_data',
      label: 'Figuring out what data is telling me.',
      workTypeCluster: 'Data & Research',
      categoryMappings: [
        { categoryId: 'Analytics & Data', weight: 1 },
        { categoryId: 'Business Intelligence', weight: 0.85 },
        { categoryId: 'Mathematics & Statistics', weight: 0.75 },
      ],
    },

    {
      id: 'solving_business_problems',
      label: 'Solving business or money problems.',
      workTypeCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Business & Management', weight: 0.83 },
        { categoryId: 'Information Technology (IT)', weight: 0.73 },
        { categoryId: 'Business Intelligence', weight: 0.6 },
      ],
    },

    {
      id: 'building_software_systems',
      label: 'Building websites, apps, or software.',
      workTypeCluster: 'Technology & Engineering',
      categoryMappings: [
        {
          categoryId: 'Computer Science & Software Development',
          weight: 0.9,
        },
        { categoryId: 'Information Technology (IT)', weight: 0.85 },
        { categoryId: 'Computer Engineering', weight: 0.65 },
      ],
    },

    {
      id: 'working_with_hardware_devices',
      label: 'Building or fixing tech devices.',
      workTypeCluster: 'Technology & Engineering',
      categoryMappings: [
        { categoryId: 'Computer Engineering', weight: 1 },
        { categoryId: 'Electrical Engineering', weight: 0.9 },
        {
          categoryId: 'Mechanical & Industrial Engineering',
          weight: 0.6,
        },
      ],
    },

    {
      id: 'designing_physical_systems',
      label: 'Designing products, machines, or structures.',
      workTypeCluster: 'Technology & Engineering',
      categoryMappings: [
        {
          categoryId: 'Mechanical & Industrial Engineering',
          weight: 1,
        },
        { categoryId: 'Civil Engineering', weight: 0.75 },
        { categoryId: 'Biomechanical Engineering', weight: 0.6 },
      ],
    },

    {
      id: 'helping_people_health_science',
      label: 'Working on health or medical problems.',
      workTypeCluster: 'Health, Science & Environment',
      categoryMappings: [
        { categoryId: 'Healthcare', weight: 1 },
        { categoryId: 'Biomechanical Engineering', weight: 0.8 },
        { categoryId: 'Science & Research', weight: 0.7 },
      ],
    },

    {
      id: 'researching_and_testing_ideas',
      label: 'Digging into questions to find solid answers.',
      workTypeCluster: 'Data & Research',
      categoryMappings: [
        { categoryId: 'Science & Research', weight: 1 },
        { categoryId: 'Analytics & Data', weight: 0.75 },
        { categoryId: 'Mathematics & Statistics', weight: 0.6 },
      ],
    },

    {
      id: 'persuading_and_promoting',
      label: 'Getting people interested in an idea, product, or cause.',
      workTypeCluster: 'Marketing & Communication',
      categoryMappings: [
        { categoryId: 'Marketing & Advertising', weight: 1 },
        { categoryId: 'Business & Management', weight: 0.55 },
        { categoryId: 'Economics', weight: 0.4 },
      ],
    },

    {
      id: 'planning_campaigns_content',
      label: 'Creating content, brands, or social media campaigns.',
      workTypeCluster: 'Marketing & Communication',
      categoryMappings: [
        { categoryId: 'Marketing & Advertising', weight: 1 },
        { categoryId: 'Business Intelligence', weight: 0.45 },
      ],
    },

    {
      id: 'managing_money_risk',
      label: 'Investing or evaluating money risk.',
      workTypeCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Finance', weight: 1 },
        { categoryId: 'Accounting', weight: 0.75 },
        { categoryId: 'Economics', weight: 0.7 },
      ],
    },

    {
      id: 'tracking_costs_records',
      label: 'Keeping budgets and records organized.',
      workTypeCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Accounting', weight: 1 },
        { categoryId: 'Finance', weight: 0.5 },
        { categoryId: 'Business & Management', weight: 0.45 },
      ],
    },

    {
      id: 'understanding_markets_policy',
      label: 'Understanding why people and markets make certain choices.',
      workTypeCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Economics', weight: 1 },
        { categoryId: 'Finance', weight: 0.65 },
        { categoryId: 'Analytics & Data', weight: 0.6 },
      ],
    },

    {
      id: 'organizing_people_projects',
      label: 'Keeping teams, projects, or events on track.',
      workTypeCluster: 'Management & Operations',
      categoryMappings: [
        { categoryId: 'Business & Management', weight: 0.78 },
        { categoryId: 'Information Technology (IT)', weight: 0.67 },
        { categoryId: 'Civil Engineering', weight: 0.45 },
      ],
    },

    {
      id: 'improving_processes_operations',
      label: 'Fixing slow or messy processes.',
      workTypeCluster: 'Management & Operations',
      categoryMappings: [
        {
          categoryId: 'Mechanical & Industrial Engineering',
          weight: 1,
        },
        { categoryId: 'Business & Management', weight: 0.8 },
        { categoryId: 'Analytics & Data', weight: 0.65 },
      ],
    },

    {
      id: 'protecting_environment',
      label: 'Working on climate or environmental problems.',
      workTypeCluster: 'Health, Science & Environment',
      categoryMappings: [
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 1,
        },
        { categoryId: 'Civil Engineering', weight: 0.65 },
        { categoryId: 'Science & Research', weight: 0.65 },
      ],
    },

    {
      id: 'building_infrastructure',
      label: 'Designing buildings, roads, or cities.',
      workTypeCluster: 'Health, Science & Environment',
      categoryMappings: [
        { categoryId: 'Civil Engineering', weight: 1 },
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 0.55,
        },
        {
          categoryId: 'Mechanical & Industrial Engineering',
          weight: 0.45,
        },
      ],
    },

    {
      id: 'supporting_technology_users',
      label: 'Helping people solve tech problems.',
      workTypeCluster: 'Technology & Engineering',
      categoryMappings: [
        { categoryId: 'Information Technology (IT)', weight: 0.93 },
        {
          categoryId: 'Computer Science & Software Development',
          weight: 0.45,
        },
      ],
    },

    {
      id: 'turning_tech_into_business_value',
      label: 'Using technology to improve a business.',
      workTypeCluster: 'Technology & Engineering',
      categoryMappings: [
        { categoryId: 'Information Technology (IT)', weight: 0.91 },
        { categoryId: 'Business Intelligence', weight: 0.75 },
        { categoryId: 'Business & Management', weight: 0.6 },
      ],
    },
  ],
},
  {
    id: 'people_or_tasks',
    questionText: 'Do you prefer working in teams or alone?',
    weight: quizQuestionWeights.people_or_tasks,
    answerOptions: [
      {
        id: 'tasks',
        label: 'Solo work',
        categoryMappings: [
          { categoryId: 'Business Intelligence', weight: 0.5 },
          { categoryId: 'Accounting', weight: 0.5 },
          { categoryId: 'Computer Science & Software Development', weight: 0.5 },
        ],
      },
      {
        id: 'people',
        label: 'Team work',
        categoryMappings: [
          { categoryId: 'Marketing & Advertising', weight: 0.5 },
          { categoryId: 'Business & Management', weight: 0.5 },
          { categoryId: 'Healthcare', weight: 0.5 },
        ],
      },
    ],
  },
  {
    id: 'grad_school',
    questionText: 'Are you interested in graduate or professional school after college?',
    weight: quizQuestionWeights.grad_school,
    answerOptions: [
      {
        id: 'yes_grad_school',
        label: 'Yes',
        categoryMappings: [
          { categoryId: 'Economics', weight: 0.6 },
          { categoryId: 'Science & Research', weight: 0.7 },
          { categoryId: 'Healthcare', weight: 0.7 },
          { categoryId: 'Mathematics & Statistics', weight: 0.5 },
        ],
      },
      {
        id: 'no_grad_school',
        label: 'No',
        categoryMappings: [
          { categoryId: 'Business & Management', weight: 0.4 },
          { categoryId: 'Marketing & Advertising', weight: 0.4 },
          { categoryId: 'Information Technology (IT)', weight: 0.4 },
        ],
      },
      {
        id: 'dont_know_grad_school',
        label: "I don't know yet",
        categoryMappings: [],
      },
    ],
  },

  {
    id: 'creative_or_analytical',
    questionText: 'Are you more drawn to creative or logical work?',
    weight: quizQuestionWeights.creative_or_analytical,
    answerOptions: [
      {
        id: 'creative',
        label: 'Creative',
        categoryMappings: [
          { categoryId: 'Marketing & Advertising', weight: 0.75 },
          { categoryId: 'Business & Management', weight: 0.5 },
          { categoryId: 'Information Technology (IT)', weight: 0.5 },
        ],
      },
      {
        id: 'analytical',
        label: 'Logical',
        categoryMappings: [
          { categoryId: 'Analytics & Data', weight: 0.75 },
          { categoryId: 'Finance', weight: 0.5 },
          { categoryId: 'Economics', weight: 0.5 },
        ],
      },
      {
        id: 'both',
        label: 'Mix of Both',
        categoryMappings: []
      }
    ],
  },
  {
  id: 'curious_career_field',
  questionText: 'Which career field are you most curious about right now?',
  weight: quizQuestionWeights.curious_career_field,
  answerOptions: [
    {
      id: 'something_in_tech',
      label: 'Something in Technology',
      careerCluster: 'Technology & Data',
      categoryMappings: [
        { categoryId: 'Computer Science & Software Development', weight: 0.95 },
        { categoryId: 'Information Technology (IT)', weight: 0.82 },
        { categoryId: 'Analytics & Data', weight: 0.65 },
        { categoryId: 'Cybersecurity', weight: 0.63 },
        { categoryId: 'Business Intelligence', weight: 0.61 },
        { categoryId: 'Computer Engineering', weight: 0.55 },
      ],
    },
    {
      id: 'something_in_business',
      label: 'Something in Business',
      careerCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Business & Management', weight: 0.91 },
        { categoryId: 'Finance', weight: 0.79 },
        { categoryId: 'Marketing & Advertising', weight: 0.65 },
        { categoryId: 'Economics', weight: 0.63 },
        { categoryId: 'Business Intelligence', weight: 0.55 },
      ],
    },
    {
      id: 'something_in_health_science',
      label: 'Something in Health or Science',
      careerCluster: 'Health & Sciences',
      categoryMappings: [
        { categoryId: 'Healthcare', weight: 0.91 },
        { categoryId: 'Science & Research', weight: 0.85 },
        { categoryId: 'Environmental Work & Sustainability', weight: 0.65 },
      ],
    },
    {
      id: 'statitician',
      label: 'Statitician',
      careerCluster: 'Technology & Data',
      categoryMappings: [
        { categoryId: 'Analytics & Data', weight: 0.81},
        { categoryId: 'Mathematics & Statistics', weight: 0.88},
        { categoryId: 'Business Intelligence', weight: 0.63},
        { categoryId: 'Science & Research', weight: 0.79},,
        { categoryId: 'Healthcare', weight: 0.61}
      ]
    },
    {
      id: 'biostatistics',
      label: 'Biostatistics',
      careerCluster: 'Health & Sciences',
      categoryMappings: [
        {categoryId: 'Mathematics & Statistics', weight: 0.67},
        {categoryId: 'Science & Research', weight: 0.78},
        {categoryId: 'Healthcare', weight: 0.71}
      ]
    },
    {
      id: 'something_in_engineering',
      label: 'Something in Engineering',
      careerCluster: 'Engineering',
      categoryMappings: [
        { categoryId: 'Mechanical & Industrial Engineering', weight: 0.95 },
        { categoryId: 'Electrical Engineering', weight: 0.85 },
        { categoryId: 'Computer Engineering', weight: 0.75 },
        { categoryId: 'Civil Engineering', weight: 0.65 },
      ],
    },
    {
      id: 'analytics_data',
      label: 'Data Analytics',
      careerCluster: 'Technology & Data',
      categoryMappings: [
        { categoryId: 'Analytics & Data', weight: 0.95 },
        { categoryId: 'Business Intelligence', weight: 0.75 },
        { categoryId: 'Mathematics & Statistics', weight: 0.5 },
      ],
    },
    {
      id: 'business_intelligence',
      label: 'Business Intelligence',
      careerCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Business Intelligence', weight: 0.95 },
        { categoryId: 'Business & Management', weight: 0.85 },
        { categoryId: 'Accounting', weight: 0.63 },
      ],
    },
    {
      id: 'business_management',
      label: 'Business Management',
      careerCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Business & Management', weight: 0.95 },
        { categoryId: 'Business Intelligence', weight: 0.65 },
        { categoryId: 'Analytics & Data', weight: 0.5 },
      ],
    },
    {
      id: 'marketing_advertising',
      label: 'Marketing & Advertising',
      careerCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Marketing & Advertising', weight: 0.95 },
        { categoryId: 'Business & Management', weight: 0.75 },
        { categoryId: 'Analytics & Data', weight: 0.5 },
      ],
    },
    {
      id: 'finance',
      label: 'Finance',
      careerCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Finance', weight: 0.9 },
        { categoryId: 'Business & Management', weight: 0.65 },
      ],
    },
    {
      id: 'economics_public_policy',
      label: 'Economics & Public Policy',
      careerCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Economics', weight: 0.95 },
        { categoryId: 'Finance', weight: 0.9 },
        { categoryId: 'Environmental Work & Sustainability', weight: 0.6 },
      ],
    },
    {
      id: 'international_business',
      label: 'International Business',
      careerCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Economics', weight: 0.9 },
        { categoryId: 'Business & Management', weight: 0.8 },
      ],
    },
    {
      id: 'consulting',
      label: 'Consulting',
      careerCluster: 'Business & Finance',
      categoryMappings: [
        { categoryId: 'Business & Management', weight: 1 },
        { categoryId: 'Analytics & Data', weight: 0.75 },
      ],
    },
    {
      id: 'software_engineering',
      label: 'Software Engineering',
      careerCluster: 'Technology & Data',
      categoryMappings: [
        { categoryId: 'Computer Science & Software Development', weight: 0.95 },
        { categoryId: 'Information Technology (IT)', weight: 0.73 },
      ],
    },
    {
      id: 'artificial_intelligence_machine_learning',
      label: 'Artificial Intelligence & Machine Learning',
      careerCluster: 'Technology & Data',
      categoryMappings: [
        { categoryId: 'Computer Science & Software Development', weight: 0.9 },
        { categoryId: 'Analytics & Data', weight: 0.85 },
        { categoryId: 'Mathematics & Statistics', weight: 0.73 },
      ],
    },
    {
      id: 'cybersecurity',
      label: 'Cybersecurity',
      careerCluster: 'Technology & Data',
      categoryMappings: [
        { categoryId: 'Cybersecurity', weight: 0.95 },
        {categoryId: 'Information Technology (IT)', weight: 0.83},
        { categoryId: 'Computer Science & Software Development', weight: 0.8 },
      ],
    },
    {
      id: 'information_technology_systems',
      label: 'Information Technology (IT)',
      careerCluster: 'Technology & Data',
      categoryMappings: [
        { categoryId: 'Information Technology (IT)', weight: 0.95 },
        { categoryId: 'Business Intelligence', weight: 0.73 },
      ],
    },
    {
      id: 'science_research',
      label: 'Science & Research',
      careerCluster: 'Health & Sciences',
      categoryMappings: [
        { categoryId: 'Science & Research', weight: 0.95 },
        {categoryId: 'Healthcare', weight: 0.65}
      ],
    },
    {
      id: 'clinical_healthcare',
      label: 'Clinical Healthcare',
      careerCluster: 'Health & Sciences',
      categoryMappings: [
        { categoryId: 'Healthcare', weight: 0.9 },
        { categoryId: 'Science & Research', weight: 0.73 },
      ],
    },
    {
      id: 'public_health',
      label: 'Public Health',
      careerCluster: 'Health & Sciences',
      categoryMappings: [
        { categoryId: 'Healthcare', weight: 0.95 },
        { categoryId: 'Science & Research', weight: 0.87 },
        { categoryId: 'Analytics & Data', weight: 0.65 },
      ],
    },
    {
      id: 'healthcare_administration',
      label: 'Healthcare Administration',
      careerCluster: 'Health & Sciences',
      categoryMappings: [
        { categoryId: 'Healthcare', weight: 0 },
        { categoryId: 'Business & Management', weight: 0 },
        { categoryId: 'Business Intelligence', weight: 0 },
      ],
    },
    {
      id: 'medical_research_biotechnology',
      label: 'Medical Research & Biotechnology',
      careerCluster: 'Health & Sciences',
      categoryMappings: [
        { categoryId: 'Science & Research', weight: 0 },
        { categoryId: 'Healthcare', weight: 0 },
        { categoryId: 'Biomechanical Engineering', weight: 0 },
      ],
    },
    {
      id: 'electrical_engineering',
      label: 'Electrical Engineering',
      careerCluster: 'Engineering',
      categoryMappings: [
        { categoryId: 'Electrical Engineering', weight: 0.95 },
        { categoryId: 'Computer Engineering', weight: 0.75 },
      ],
    },
    {
      id: 'mechanical_industrial_engineering',
      label: 'Mechanical & Industrial Engineering',
      careerCluster: 'Engineering',
      categoryMappings: [
        { categoryId: 'Mechanical & Industrial Engineering', weight: 0.95 },
        { categoryId: 'Electrical Engineering', weight: 0.75 },
      ],
    },
    {
      id: 'civil_engineering',
      label: 'Civil Engineering',
      careerCluster: 'Engineering',
      categoryMappings: [
        { categoryId: 'Civil Engineering', weight: 0.97 },
        { categoryId: 'Environmental Work & Sustainability', weight: 0.7 },
      ],
    },
    {
      id: 'biomechanical_engineering',
      label: 'Biomechanical Engineering',
      careerCluster: 'Engineering',
      categoryMappings: [
        { categoryId: 'Biomechanical Engineering', weight: 0.97 },
        { categoryId: 'Healthcare', weight: 0.83 },
        { categoryId: 'Mechanical & Industrial Engineering', weight: 0.6 },
      ],
    },
    {
      id: 'environmental_science_sustainability',
      label: 'Environmental Science & Sustainability',
      careerCluster: 'Health & Sciences',
      categoryMappings: [
        { categoryId: 'Environmental Work & Sustainability', weight: 0.97 },
        { categoryId: 'Science & Research', weight: 0.89 },
        { categoryId: 'Civil Engineering', weight: 0.65 },
      ],
    },
    ],
  },
  {
    id: 'skill_gaps',
    questionText: 'Based on your desired field, what skills do you feel you need to develop?',
    weight: quizQuestionWeights.skill_gaps,
    answerOptions: [
      {
        id: 'technical_skills',
        skillsCluster: 'Technical',
        label: 'Broad Technical Skills (programming, data analysis, engineering)',
        categoryMappings: [
          { categoryId: 'Computer Science & Software Development', weight: 0.87 },
          { categoryId: 'Analytics & Data', weight: 0.77 },
          { categoryId: 'Mechanical & Industrial Engineering', weight: 0.68 },
        ],
      },
      {
        id: 'business_skills',
        skillsCluster: 'Business',
        label: 'Broad Business Skills (marketing, finance, management)',
        categoryMappings: [
          { categoryId: 'Business & Management', weight: 0.77 },
          { categoryId: 'Marketing & Advertising', weight: 0.69 },
          { categoryId: 'Finance', weight: 0.5 }
        ],
      },
      {
        id: 'operations',
        skillsCluster: 'Business',
        label: 'Supply Chain & Business Operations',
        categoryMappings: [
          { categoryId: 'Business & Management', weight: 0.77 },
          { categoryId: 'Mechanical & Industrial Engineering', weight: 0.65 },
          { categoryId: 'Analytics & Data', weight: 0.5 },
        ],
      },
      {
        id: 'software_skills',
        skillsCluster: 'Technical',
        label: 'Business Intelligence Skills (Excel, PowerBi, Salesforce)',
        categoryMappings: [
          { categoryId: 'Business Intelligence', weight: 0.91 },
          { categoryId: 'Analytics & Data', weight: 0.77 },
          { categoryId: 'Business & Management', weight: 0.66 },
        ],
      },
      {
        id: 'marketing_skills',
        skillsCluster: 'Communication',
        label: 'Marketing Skills (social media, content creation, advertising)',
        categoryMappings: [
          { categoryId: 'Marketing & Advertising', weight: 0.91 },
          { categoryId: 'Business & Management', weight: 0.77 },
        ],
      },
      {
        id: 'programming_skills',
        skillsCluster: 'Technical',
        label: 'Programming Skills (Python, Java, C++)',
        categoryMappings: [
          { categoryId: 'Computer Science & Software Development', weight: 0.91 },
          { categoryId: 'Information Technology (IT)', weight: 0.77 },
          { categoryId: 'Analytics & Data', weight: 0.63 },
        ],
      },
      {
        id: 'data_analysis_skills',
        skillsCluster: 'Analytical',
        label: 'Data Analysis Skills (statistics, data visualization, pattern recognition)',
        categoryMappings: [
          { categoryId: 'Analytics & Data', weight: 0.75 },
          { categoryId: 'Business Intelligence', weight: 0.73 },
          { categoryId: 'Mathematics & Statistics', weight: 0.5 },
        ],
      },
      {
        id: 'financial_skills',
        skillsCluster: 'Business',
        label: 'General Financial Skills (budgeting, financial modeling, risk management)',
        categoryMappings: [
          { categoryId: 'Finance', weight: 0.75 },
          { categoryId: 'Accounting', weight: 0.7 },
          { categoryId: 'Business & Management', weight: 0.5 },
        ],
      },
      {
        id: 'public_finance',
        skillsCluster: 'Business',
        label: 'Public Financial Skills (Public policy and economics)',
        categoryMappings: [
          { categoryId: 'Economics', weight: 0.75 },
          { categoryId: 'Finance', weight: 0.81 },
          { categoryId: 'Business & Management', weight: 0.5 },
        ],
      },
      {
        id: 'math_skills',
        skillsCluster: 'Analytical',
        label: 'Math Skills (calculus, linear algebra, applied statistics)',
        categoryMappings: [
          { categoryId: 'Mathematics & Statistics', weight: 0.87 },
          { categoryId: 'Analytics & Data', weight: 0.75 },
          { categoryId: 'Computer Science & Software Development', weight: 0.61 },
        ],
      },
      {
        id: 'communication_skills',
        skillsCluster: 'Communication',
        label: 'People & Sales Skills (Copywriting, public speaking, persuasion)',
        categoryMappings: [
          { categoryId: 'Marketing & Advertising', weight: 0.81 },
          { categoryId: 'Business & Management', weight: 0.67 },
        ],
      },
      {
        id: 'research_skills',
        skillsCluster: 'Analytical',
        label: 'Research Skills (data collection, writing reports, project management)',
        categoryMappings: [
          { categoryId: 'Science & Research', weight: 0.75 },
          { categoryId: 'Healthcare', weight: 0.71 },
          { categoryId: 'Analytics & Data', weight: 0.5 },
          { categoryId: 'Business & Management', weight: 0.5 },
        ],
      },
      {
        id: 'design_skills',
        skillsCluster: 'Creative',
        label: 'Design Skills (graphic design, UX/UI, product design)',
        categoryMappings: [
          { categoryId: 'Marketing & Advertising', weight: 0.75 },
          { categoryId: 'Business & Management', weight: 0.5 },
          { categoryId: 'Information Technology (IT)', weight: 0.5 },
        ],
      },
      {
        id: 'hardware_skills',
        skillsCluster: 'Technical',
        label: 'Hardware Skills (circuit design, embedded systems, computer architecture)',
        categoryMappings: [
          { categoryId: 'Computer Engineering', weight: 0.91 },
          { categoryId: 'Electrical Engineering', weight: 0.85 },
          { categoryId: 'Mechanical & Industrial Engineering', weight: 0.75 },
        ],
      },
      {
        id: 'lab_technique_skills',
        skillsCluster: 'Scientific',
        label: 'Lab Technique Skills (biology, chemistry, biochemistry)',
        categoryMappings: [
          { categoryId: 'Science & Research', weight: 0.91 },
          { categoryId: 'Healthcare', weight: 0.85 },
          { categoryId: 'Biomechanical Engineering', weight: 0.75 },
        ],
      },
      {
        id: 'microscopy_skills',
        skillsCluster: 'Scientific',
        label: 'Microscopy Skills',
        categoryMappings: [
          { categoryId: 'Science & Research', weight: 0.89 },
          { categoryId: 'Healthcare', weight: 0.81 },
          { categoryId: 'Biomechanical Engineering', weight: 0.73 },
        ],
      },
      {
        id: 'chemical_analysis_skills',
        skillsCluster: 'Scientific',
        label: 'Chemical Analysis Skills',
        categoryMappings: [
          { categoryId: 'Science & Research', weight: 0.91 },
          { categoryId: 'Healthcare', weight: 0.87 },
          { categoryId: 'Biomechanical Engineering', weight: 0.78 },
        ],
      },
      {
        id: 'forensic_testing_skills',
        skillsCluster: 'Scientific',
        label: 'Forensic Testing Skills',
        categoryMappings: [
          { categoryId: 'Science & Research', weight: 0.93 },
          { categoryId: 'Healthcare', weight: 0.878 },
          { categoryId: 'Biomechanical Engineering', weight: 0.78 },
        ],
      },
      {
        id: 'french',
        skillsCluster: 'Language & Culture',
        label: 'French',
        categoryMappings: [
          { categoryId: 'Languages & International Affairs', weight: 0.87},
          { categoryId: 'History & Cultural Heritage', weight: 0.74},
          { categoryId: 'Arts & Creative Industries', weight: 0.62},
          { categoryId: 'Education', weight: 0.83}
        ],
      },
      {
        id: 'historical_analysis',
        skillsCluster: 'Political & Legal',
        label: 'Historical Analysis',
        categoryMappings: [
          { categoryId: 'History & Cultural Heritage', weight: 0.84},
          { categoryId: 'Legal Services', weight: 0.94},
          { categoryId: 'Education', weight: 0.87},
          { categoryId: 'Writing & Journalism', weight: 0.71},
          { categoryId: 'Politics & Public Policy', weight: 0.77}
        ]
      },
      {
        id: 'legal_understanding',
        skillsCluster: 'Political & Legal',
        label: 'Legal Comprehension (Undrstanding of the Law)',
        categoryMappings: [
          { categoryId: 'Legal Services', weight: 0.99 },
          { categoryId: 'Politics & Public Policy', weight: 0.91},
          { categoryId: 'Education', weight: 0.77}
        ]
      },
        {
        id: 'english',
        skillsCluster: 'Language & Culture',
        label: 'English',
        categoryMappings: [
          { categoryId: 'Languages & International Affairs', weight: 0.89},
          { categoryId: 'Education', weight: 0.77},
          { categoryId: 'Legal Services', weight: 0.80},
          { categoryId: 'Politics & Public Policy', weight: 0.61},
          { categoryId: 'Writing & Journalism', weight: 0.87}
        ]
      },
      {
  id: 'lesson_planning',
  skillsCluster: 'Educational',
  label: 'Lesson Planning',
  categoryMappings: [
    { categoryId: 'Education', weight: 0.98 },
    { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.66 },
    { categoryId: 'Arts & Creative Industries', weight: 0.58 },
  ],
},
{
  id: 'instructional_technology',
  skillsCluster: 'Educational',
  label: 'Instructional Technology',
  categoryMappings: [
    { categoryId: 'Education', weight: 0.95 },
    { categoryId: 'Information Technology (IT)', weight: 0.8 },
    {
      categoryId: 'Computer Science & Software Development',
      weight: 0.64,
    },
    {
      categoryId: 'Media, Communications & Public Relations',
      weight: 0.6,
    },
  ],
},
{
  id: 'student_assessment',
  skillsCluster: 'Educational',
  label: 'Student Assessment',
  categoryMappings: [
    { categoryId: 'Education', weight: 0.97 },
    { categoryId: 'Analytics & Data', weight: 0.74 },
    { categoryId: 'Social & Behavioral Sciences', weight: 0.68 },
    { categoryId: 'Mathematics & Statistics', weight: 0.6 },
  ],
},
{
  id: 'classroom_management',
  skillsCluster: 'Educational',
  label: 'Classroom Management',
  categoryMappings: [
    { categoryId: 'Education', weight: 0.99 },
    { categoryId: 'Social & Behavioral Sciences', weight: 0.78 },
    { categoryId: 'Business & Management', weight: 0.62 },
    { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.58 },
  ],
},
{
  id: 'behavioral_research',
  skillsCluster: 'Human Behavior & Belief',
  label: 'Behavioral Research',
  categoryMappings: [
    { categoryId: 'Social & Behavioral Sciences', weight: 0.98 },
    { categoryId: 'Analytics & Data', weight: 0.76 },
    { categoryId: 'Marketing & Advertising', weight: 0.7 },
    { categoryId: 'Healthcare', weight: 0.64 },
  ],
},
{
  id: 'counseling_skills',
  skillsCluster: 'Human Behavior & Belief',
  label: 'Counseling Skills',
  categoryMappings: [
    { categoryId: 'Social & Behavioral Sciences', weight: 0.97 },
    { categoryId: 'Healthcare', weight: 0.88 },
    { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.84 },
    { categoryId: 'Education', weight: 0.72 },
  ],
},
{
  id: 'ethical_reasoning',
  skillsCluster: 'Human Behavior & Belief',
  label: 'Ethical Reasoning',
  categoryMappings: [
    { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.92 },
    { categoryId: 'Legal Services', weight: 0.86 },
    { categoryId: 'Healthcare', weight: 0.76 },
    { categoryId: 'Politics & Public Policy', weight: 0.72 },
  ],
},
{
  id: 'belief_system_analysis',
  skillsCluster: 'Human Behavior & Belief',
  label: 'Belief System Analysis',
  categoryMappings: [
    { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.96 },
    { categoryId: 'Social & Behavioral Sciences', weight: 0.84 },
    { categoryId: 'History & Cultural Heritage', weight: 0.78 },
    { categoryId: 'Politics & Public Policy', weight: 0.68 },
  ],
},
{
  id: 'public_policy_analysis',
  skillsCluster: 'Political & Legal',
  label: 'Public Policy Analysis',
  categoryMappings: [
    { categoryId: 'Politics & Public Policy', weight: 0.98 },
    { categoryId: 'Legal Services', weight: 0.84 },
    { categoryId: 'Economics', weight: 0.76 },
    { categoryId: 'Analytics & Data', weight: 0.68 },
  ],
},
{
  id: 'legislative_research',
  skillsCluster: 'Political & Legal',
  label: 'Legislative Research',
  categoryMappings: [
    { categoryId: 'Politics & Public Policy', weight: 0.96 },
    { categoryId: 'Legal Services', weight: 0.92 },
    { categoryId: 'Writing & Journalism', weight: 0.74 },
    { categoryId: 'History & Cultural Heritage', weight: 0.68 },
  ],
},
{
  id: 'translation',
  skillsCluster: 'Language & Culture',
  label: 'Translation',
  categoryMappings: [
    { categoryId: 'Languages & International Affairs', weight: 0.98 },
    { categoryId: 'Writing & Journalism', weight: 0.78 },
    {
      categoryId: 'Media, Communications & Public Relations',
      weight: 0.68,
    },
    { categoryId: 'Legal Services', weight: 0.60 },
  ],
},
{
  id: 'cross_cultural_communication',
  skillsCluster: 'Language & Culture',
  label: 'Cross-Cultural Communication',
  categoryMappings: [
    { categoryId: 'Languages & International Affairs', weight: 0.96 },
    {
      categoryId: 'Media, Communications & Public Relations',
      weight: 0.82,
    },
    { categoryId: 'Business & Management', weight: 0.72 },
    { categoryId: 'Education', weight: 0.70 },
  ],
},
        {
        id: 'spanish',
        skillsCluster: 'Language & Culture',
        label: 'Spanish',
        categoryMappings: [
          { categoryId: 'Languages & International Affairs', weight: 0.92},
          { categoryId: 'Education', weight: 0.87},          
        ]
      },
      {
        id: 'program_design',
        skillsCluster: 'Educational',
        label: 'Learning Program Design',
        categoryMappings: [
          { categoryId: 'Education', weight: 0.99}
        ]
      },
      {
        id: 'human_psychology',
        skillsCluster: 'Human Behavior & Belief',
        label: 'Human Psychology',
        categoryMappings: [
          {categoryId: 'Social & Behavioral Sciences', weight: 0.95},
          {categoryId: 'Marketing & Advertising', weight: 0.75},
          {categoryId: 'Media, Communications & Public Relations', weight: 0.69}
        ]
      }
    ],
  },
{
  id: 'work_environment',

  questionText: 'What kind of work environment fits you best?',

  weight: quizQuestionWeights.work_environment,

  answerOptions: [
    {
      id: 'Office Setting',
      label: 'Office Setting',
      categoryMappings: [
        { categoryId: 'Finance', weight: 0.92 },
        { categoryId: 'Accounting', weight: 0.90 },
        { categoryId: 'Business Intelligence', weight: 0.90 },
        { categoryId: 'Business & Management', weight: 0.88 },
        { categoryId: 'Analytics & Data', weight: 0.86 },
        { categoryId: 'Marketing & Advertising', weight: 0.82 },
        { categoryId: 'Economics', weight: 0.78 },
        { categoryId: 'Information Technology (IT)', weight: 0.76 },
        { categoryId: 'Legal Services', weight: 0.74 },
        {
          categoryId: 'Computer Science & Software Development',
          weight: 0.72,
        },
      ],
    },

    {
      id: 'Remote / Work From Home',
      label: 'Remote Setting',
      categoryMappings: [
        {
          categoryId: 'Computer Science & Software Development',
          weight: 0.95,
        },
        { categoryId: 'Writing & Journalism', weight: 0.71 },
        { categoryId: 'Analytics & Data', weight: 0.90 },
        { categoryId: 'Cybersecurity', weight: 0.88 },
        { categoryId: 'Information Technology (IT)', weight: 0.87 },
        { categoryId: 'Business Intelligence', weight: 0.85 },
        { categoryId: 'Marketing & Advertising', weight: 0.82 },
        {
          categoryId: 'Media, Communications & Public Relations',
          weight: 0.80,
        },
        { categoryId: 'Languages & International Affairs', weight: 0.76 },
        { categoryId: 'Mathematics & Statistics', weight: 0.74 },
      ],
    },

    {
      id: 'Fast-Paced / High-Pressure',
      label: 'High-Pressure',
      categoryMappings: [
        { categoryId: 'Healthcare', weight: 0.96 },
        { categoryId: 'Finance', weight: 0.92 },
        {
          categoryId: 'Media, Communications & Public Relations',
          weight: 0.90,
        },
        { categoryId: 'Marketing & Advertising', weight: 0.88 },
        { categoryId: 'Cybersecurity', weight: 0.87 },
        { categoryId: 'Legal Services', weight: 0.86 },
        { categoryId: 'Business & Management', weight: 0.84 },
        { categoryId: 'Writing & Journalism', weight: 0.80 },
        { categoryId: 'Information Technology (IT)', weight: 0.78 },
        { categoryId: 'Politics & Public Policy', weight: 0.76 },
      ],
    },

    {
      id: 'Flexible / Unstructured',
      label: 'Flexible / Unstructured',
      categoryMappings: [
        { categoryId: 'Arts & Creative Industries', weight: 0.96 },
        { categoryId: 'Writing & Journalism', weight: 0.92 },
        {
          categoryId: 'Media, Communications & Public Relations',
          weight: 0.88,
        },
        { categoryId: 'Marketing & Advertising', weight: 0.84 },
        {
          categoryId: 'Computer Science & Software Development',
          weight: 0.82,
        },
        { categoryId: 'Business & Management', weight: 0.78 },
        { categoryId: 'Social & Behavioral Sciences', weight: 0.76 },
        { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.74 },
        { categoryId: 'Languages & International Affairs', weight: 0.74 },
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 0.70,
        },
      ],
    },

    {
      id: 'Field-Based / On-Site',
      label: 'Field-Based / On-Site',
      categoryMappings: [
        { categoryId: 'Civil Engineering', weight: 0.97 },
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 0.96,
        },
        { categoryId: 'Science & Research', weight: 0.86 },
        { categoryId: 'Electrical Engineering', weight: 0.82 },
        {
          categoryId: 'Mechanical & Industrial Engineering',
          weight: 0.80,
        },
        { categoryId: 'History & Cultural Heritage', weight: 0.78 },
        { categoryId: 'Materials Engineering', weight: 0.76 },
        { categoryId: 'Computer Engineering', weight: 0.68 },
      ],
    },

    {
      id: 'Laboratory / Research Setting',
      label: 'Laboratory / Research Setting',
      categoryMappings: [
        { categoryId: 'Science & Research', weight: 0.99 },
        { categoryId: 'Materials Engineering', weight: 0.97 },
        { categoryId: 'Biomechanical Engineering', weight: 0.94 },
        { categoryId: 'Healthcare', weight: 0.90 },
        { categoryId: 'Electrical Engineering', weight: 0.86 },
        {
          categoryId: 'Mechanical & Industrial Engineering',
          weight: 0.84,
        },
        { categoryId: 'Computer Engineering', weight: 0.82 },
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 0.80,
        },
        { categoryId: 'Social & Behavioral Sciences', weight: 0.72 },
        { categoryId: 'Mathematics & Statistics', weight: 0.68 },
      ],
    },

    {
      id: 'Industrial / Manufacturing Setting',
      label: 'Industrial / Manufacturing Setting',
      categoryMappings: [
        {
          categoryId: 'Mechanical & Industrial Engineering',
          weight: 0.99,
        },
        { categoryId: 'Materials Engineering', weight: 0.97 },
        { categoryId: 'Electrical Engineering', weight: 0.92 },
        { categoryId: 'Computer Engineering', weight: 0.88 },
        { categoryId: 'Civil Engineering', weight: 0.82 },
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 0.76,
        },
        { categoryId: 'Biomechanical Engineering', weight: 0.74 },
        { categoryId: 'Information Technology (IT)', weight: 0.68 },
        { categoryId: 'Business & Management', weight: 0.66 },
      ],
    },

    {
      id: 'Healthcare / Clinical Setting',
      label: 'Clinical Setting',
      categoryMappings: [
        { categoryId: 'Healthcare', weight: 1.00 },
        { categoryId: 'Biomechanical Engineering', weight: 0.94 },
        { categoryId: 'Social & Behavioral Sciences', weight: 0.84 },
        { categoryId: 'Science & Research', weight: 0.82 },
        { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.78 },
        { categoryId: 'Analytics & Data', weight: 0.72 },
        { categoryId: 'Information Technology (IT)', weight: 0.68 },
        { categoryId: 'Cybersecurity', weight: 0.64 },
        { categoryId: 'Business & Management', weight: 0.62 },
      ],
    },

    {
      id: 'Academic / Educational Setting',
      label: 'Academic / Educational Setting',
      categoryMappings: [
        { categoryId: 'Education', weight: 1.00 },
        { categoryId: 'Science & Research', weight: 0.90 },
        { categoryId: 'Mathematics & Statistics', weight: 0.88 },
        { categoryId: 'History & Cultural Heritage', weight: 0.86 },
        { categoryId: 'Social & Behavioral Sciences', weight: 0.84 },
        { categoryId: 'Languages & International Affairs', weight: 0.82 },
        { categoryId: 'Writing & Journalism', weight: 0.80 },
        { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.78 },
        { categoryId: 'Economics', weight: 0.76 },
        { categoryId: 'Arts & Creative Industries', weight: 0.74 },
      ],
    },

    {
      id: 'Government / Public Sector',
      label: 'Public Sector',
      categoryMappings: [
        { categoryId: 'Politics & Public Policy', weight: 0.98 },
        { categoryId: 'Legal Services', weight: 0.92 },
        { categoryId: 'Languages & International Affairs', weight: 0.88 },
        { categoryId: 'Economics', weight: 0.86 },
        { categoryId: 'Civil Engineering', weight: 0.84 },
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 0.82,
        },
        { categoryId: 'Cybersecurity', weight: 0.80 },
        { categoryId: 'Analytics & Data', weight: 0.76 },
        { categoryId: 'Social & Behavioral Sciences', weight: 0.74 },
        { categoryId: 'Accounting', weight: 0.70 },
        { categoryId: 'History & Cultural Heritage', weight: 0.70 },
      ],
    },

    {
      id: 'Startup / Entrepreneurial Setting',
      label: 'Startup / Entrepreneurial Setting',
      categoryMappings: [
        { categoryId: 'Business & Management', weight: 0.97 },
        { categoryId: 'Marketing & Advertising', weight: 0.94 },
        {
          categoryId: 'Computer Science & Software Development',
          weight: 0.92,
        },
        { categoryId: 'Business Intelligence', weight: 0.86 },
        { categoryId: 'Analytics & Data', weight: 0.84 },
        {
          categoryId: 'Media, Communications & Public Relations',
          weight: 0.82,
        },
        { categoryId: 'Finance', weight: 0.80 },
        { categoryId: 'Computer Engineering', weight: 0.76 },
        { categoryId: 'Arts & Creative Industries', weight: 0.74 },
        { categoryId: 'Healthcare', weight: 0.68 },
      ],
    },

    {
      id: 'Travel-Heavy / Mobile',
      label: 'Travel-Heavy / Mobile',
      categoryMappings: [
        { categoryId: 'Languages & International Affairs', weight: 0.97 },
        { categoryId: 'Politics & Public Policy', weight: 0.88 },
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 0.86,
        },
        { categoryId: 'Civil Engineering', weight: 0.82 },
        { categoryId: 'Business & Management', weight: 0.80 },
        { categoryId: 'Marketing & Advertising', weight: 0.78 },
        { categoryId: 'Writing & Journalism', weight: 0.76 },
        {
          categoryId: 'Media, Communications & Public Relations',
          weight: 0.74,
        },
        { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.72 },
        { categoryId: 'Healthcare', weight: 0.68 },
      ],
    },

    {
      id: 'Outdoor / Environmental Setting',
      label: 'Outdoor / Environmental Setting',
      categoryMappings: [
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 0.99,
        },
        { categoryId: 'Civil Engineering', weight: 0.94 },
        { categoryId: 'Science & Research', weight: 0.84 },
        { categoryId: 'History & Cultural Heritage', weight: 0.76 },
        { categoryId: 'Electrical Engineering', weight: 0.74 },
        { categoryId: 'Education', weight: 0.70 },
        { categoryId: 'Politics & Public Policy', weight: 0.66 },
        { categoryId: 'Materials Engineering', weight: 0.64 },
      ],
    },

    {
      id: 'Artistic Setting',
      label: 'Artistic Setting',
      categoryMappings: [
        { categoryId: 'Arts & Creative Industries', weight: 1.00 },
        { categoryId: 'History & Cultural Heritage', weight: 0.95 },
        {
          categoryId: 'Media, Communications & Public Relations',
          weight: 0.90,
        },
        { categoryId: 'Writing & Journalism', weight: 0.86 },
        { categoryId: 'Languages & International Affairs', weight: 0.84 },
        { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.78 },
        { categoryId: 'Marketing & Advertising', weight: 0.76 },
        { categoryId: 'Education', weight: 0.74 },
        { categoryId: 'Social & Behavioral Sciences', weight: 0.70 },
      ],
    },

    {
      id: 'Public-Facing Setting',
      label: 'Public-Facing Setting',
      categoryMappings: [
        { categoryId: 'Social & Behavioral Sciences', weight: 0.97 },
        { categoryId: 'Education', weight: 0.94 },
        { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.92 },
        { categoryId: 'Healthcare', weight: 0.90 },
        { categoryId: 'Politics & Public Policy', weight: 0.88 },
        {
          categoryId: 'Media, Communications & Public Relations',
          weight: 0.84,
        },
        { categoryId: 'Legal Services', weight: 0.82 },
        { categoryId: 'Languages & International Affairs', weight: 0.80 },
        { categoryId: 'Marketing & Advertising', weight: 0.76 },
        {
          categoryId: 'Environmental Work & Sustainability',
          weight: 0.72,
        },
      ],
    },

    {
      id: 'Research / Idea-Driven Setting',
      label: 'Research / Idea-Driven Setting',
      categoryMappings: [
        { categoryId: 'Science & Research', weight: 0.99 },
        { categoryId: 'Mathematics & Statistics', weight: 0.96 },
        { categoryId: 'Analytics & Data', weight: 0.94 },
        { categoryId: 'Economics', weight: 0.92 },
        { categoryId: 'Social & Behavioral Sciences', weight: 0.89 },
        { categoryId: 'History & Cultural Heritage', weight: 0.87 },
        {
          categoryId: 'Computer Science & Software Development',
          weight: 0.86,
        },
        { categoryId: 'Materials Engineering', weight: 0.84 },
        { categoryId: 'Biomechanical Engineering', weight: 0.82 },
        { categoryId: 'Electrical Engineering', weight: 0.80 },
        { categoryId: 'Legal Services', weight: 0.76 },
        { categoryId: 'Religion, Ministry & Spiritual Life', weight: 0.74 },
      ],
    },
  ],
},
    {
    id: 'career_motivation',
    questionText: 'What matters most to you in a future career?',
    weight: quizQuestionWeights.career_motivation,
    answerOptions: [
      {
        id: 'quick_income',
        label: 'Quick income / Short-term stability',
        categoryMappings: [],
      },
      {
        id: 'undecided',
        label: 'Explore different paths / Undecided',
        categoryMappings: [],
      },
      {
        id: 'skills',
        label: 'Build skills for future opportunities',
        categoryMappings: [
          {categoryId: 'Analytics & Data', weight: 0.6},
          {categoryId: 'Mathematics & Statistics', weight: 0.63 },
          {categoryId: 'Finance', weight: 0.7},
          {categoryId: 'Economics', weight: 0.65}
        ],
      },
      {
        id: 'stability',
        label: 'Long-term stable career (10–20 years)',
        categoryMappings: [
          {categoryId: 'Finance', weight: 0.65},
          {categoryId: 'Accounting', weight: 0.71},
          {categoryId: 'Healthcare', weight: 0.68},
          {categoryId: 'Mechanical & Industrial Engineering', weight: 0.62}
        ],
      },
      {
        id: 'high_income',
        label: 'High-income / Wealth building',
        categoryMappings: [
          {categoryId: 'Mechanical & Industrial Engineering', weight: 0.6},
          {categoryId: 'Civil Engineering', weight: 0.55},
          {categoryId: 'Finance', weight: 0.5},
        ],
      },
      {
        id: 'entrepreneurship',
        label: 'Entrepreneurship / Start a business',
        categoryMappings: [
          {categoryId: 'Finance', weight: 0.93},
          {categoryId: 'Mechanical & Industrial Engineering', weight: 0.87},
          {categoryId: 'Economics', weight: 0.86},
          {categoryId: 'Computer Science & Software Development', weight: 0.81}
        ],
      },
      {
        id: 'executive',
        label: 'Leadership / Executive path',
        categoryMappings: [
          {categoryId: 'Finance', weight: 0.6},
          {categoryId: 'Business & Management', weight: 0.6}
        ],
      },
      {
        id: 'meaningful',
        label: 'Impact-driven / Meaningful work',
        categoryMappings: [
          {categoryId: 'Environmental Work & Sustainability', weight: 0.6},
          {categoryId: 'Education', weight: 0.9},
          {categoryId: 'History & Cultural Heritage', weight: 0.87},
          {categoryId: 'Languages & International Affairs', weight: 0.71}
        ],
      }
    ],
  },
  {
    id: 'internship_readiness',
    questionText: 'How ready do you feel to apply for internships or jobs?',
    weight: quizQuestionWeights.internship_readiness,
    answerOptions: [
      {
        id: 'very_ready',
        label: 'Ready',
        categoryMappings: [],
      },
      {
        id: 'somewhat_ready',
        label: 'Somewhat ready',
        categoryMappings: [],
      },
      {
        id: 'somwhat_unprepared',
        label: 'Somewhat unprepared',
        categoryMappings: []
      },
      {
        id: 'unprepared',
        label: 'Unprepared',
        categoryMappings: [],
      }
    ],
    aggregateField: 'internshipReadiness',
  },
  {
    id: 'career_clarity',
    questionText: 'How clear are you on what you want to do after college?',
    weight: quizQuestionWeights.career_clarity,
    answerOptions: [
      {
        id: 'clear',
        label: 'Clear',
        categoryMappings: [],
      },
      {
        id: 'somewhat_clear',
        label: 'Somewhat clear',
        categoryMappings: []
      },
      {
        id: 'somewhat undecided',
        label: 'Somewhat undecided',
        categoryMappings: []
      },
      {
        id: 'very_undecided',
        label: 'Undecided',
        categoryMappings: []
      }
    ],
    aggregateField: 'careerClarity',
  },
  {
    id: 'career_planning_difficulty',
    questionText: 'What feels hardest about career planning right now?',
    weight: quizQuestionWeights.career_planning_difficulty,
    answerOptions: [
  {
    id: 'dont_know_what_fits_me',
    label: 'I do not know what careers fit my interests & goals.',
    categoryMappings: [],
    aggregateValue: 'unclear_self_fit',
  },
  {
    id: 'too_many_options',
    label: 'I have too many possible paths and dont know how to narrow them down.',
    categoryMappings: [],
    aggregateValue: 'too_many_options',
  },
  {
    id: 'major_to_career_unclear',
    label: 'I do not know what careers connect to my intended major.',
    categoryMappings: [],
    aggregateValue: 'major_to_career_unclear',
  },
  {
    id: 'dont_know_daily_work',
    label: 'I do not understand what different jobs actually look like day to day.',
    categoryMappings: [],
    aggregateValue: 'low_role_visibility',
  },
  {
    id: 'lack_experience',
    label: 'I do not have enough experience to know what I would actually like.',
    categoryMappings: [],
    aggregateValue: 'needs_experiential_learning',
  },
  {
    id: 'resume_linkedin_weak',
    label: 'I do not feel confident about my resume, LinkedIn, or professional profile.',
    categoryMappings: [],
    aggregateValue: 'profile_preparation_gap',
  },
  {
    id: 'interview_networking_weak',
    label: 'I do not feel ready for interviews, networking, or talking to professionals.',
    categoryMappings: [],
    aggregateValue: 'professional_confidence_gap',
  },
  {
    id: 'dont_know_where_to_apply',
    label: 'I do not know where to find good internships.',
    categoryMappings: [],
    aggregateValue: 'opportunity_search_gap',
  },
  {
    id: 'application_process_confusing',
    label: 'The application process feels confusing.',
    categoryMappings: [],
    aggregateValue: 'application_process_unclear',
  },
  {
    id: 'worried_about_wrong_choice',
    label: 'I am worried about choosing the wrong path.',
    categoryMappings: [],
    aggregateValue: 'fear_wrong_path',
  },
  {
    id: 'time_and_motivation',
    label: 'I know I should work on career planning, but I struggle to make time for it.',
    categoryMappings: [],
    aggregateValue: 'career_planning_procrastination',
  },
  {
    id: 'dont_know_resources',
    label: 'I do not know which Loyola career resources I should use first.',
    categoryMappings: [],
    aggregateValue: 'career_resource_awareness_gap',
  },
],
    aggregateField: 'careerPlanningDifficulty',
  },
    
{
  id: 'biggest_worry',
  questionText: 'What is your biggest worry about your career path?',
  weight: quizQuestionWeights.biggest_worry,
  answerOptions: [
    {
      id: 'not_worried',
      label: 'I am not worried at all',
      categoryMappings: [],
      aggregateValue: 'not_worried'
    },
    {
      id: 'worried_wrong_path',
      label: 'I am worried I will choose the wrong career path.',
      categoryMappings: [],
      aggregateValue: 'fear_wrong_path',
    },
    {
      id: 'worried_major_not_useful',
      label: 'I am worried my major will not lead to strong career options.',
      categoryMappings: [],
      aggregateValue: 'major_outcome_uncertainty',
    },
    {
      id: 'worried_no_internship',
      label: 'I am worried I will not get a good internship or job experience.',
      categoryMappings: [],
      aggregateValue: 'internship_access_anxiety',
    },
    {
      id: 'worried_not_competitive',
      label: 'I am worried I am not competitive enough compared to other students.',
      categoryMappings: [],
      aggregateValue: 'student_competitiveness_anxiety',
    },
    {
      id: 'worried_no_clear_plan',
      label: 'I am worried because I do not have a clear plan after college.',
      categoryMappings: [],
      aggregateValue: 'post_grad_plan_uncertainty',
    },
    {
      id: 'worried_money_roi',
      label: 'I am worried college will not lead to a stable or worthwhile financial outcome.',
      categoryMappings: [],
      aggregateValue: 'college_roi_concern',
    },
    {
      id: 'worried_lack_skills',
      label: 'I am worried I do not have the right skills yet.',
      categoryMappings: [],
      aggregateValue: 'skill_readiness_gap',
    },
    {
      id: 'worried_networking',
      label: 'I am worried I do not know how to network or connect with professionals.',
      categoryMappings: [],
      aggregateValue: 'networking_confidence_gap',
    },
    {
      id: 'worried_meaningful_work',
      label: 'I am worried I will end up in work that does not feel meaningful to me.',
      categoryMappings: [],
      aggregateValue: 'meaningful_work_concern',
    },
    {
      id: 'worried_too_late',
      label: 'I am worried I am already behind and should have started earlier.',
      categoryMappings: [],
      aggregateValue: 'career_timing_anxiety',
    },
    {
      id: 'worried_no_support',
      label: 'I am worried I do not know who to ask for help.',
      categoryMappings: [],
      aggregateValue: 'support_navigation_gap',
    },
  ],
  aggregateField: 'biggestWorry',
},

{
  id: 'career_resources_usage',

  questionText: 'Have you used Loyola career resources before?',

  weight: quizQuestionWeights.career_resources_usage,

  answerOptions: [
    {
      id: 'resources_not_aware',
      label: 'I do not know what resources are available.',
      categoryMappings: [],
      aggregateValue: 'career_resources_unaware',
    },
    {
      id: 'resources_aware_not_used',
      label: 'I know about them but have not used them.',
      categoryMappings: [],
      aggregateValue: 'career_resources_aware_inactive',
    },
    {
      id: 'resources_used_briefly',
      label: 'I have used them once or twice.',
      categoryMappings: [],
      aggregateValue: 'career_resources_limited_use',
    },
    {
      id: 'resources_not_helpful',
      label: 'I tried them, but they did not help much.',
      categoryMappings: [],
      aggregateValue: 'career_resources_low_satisfaction',
    },
    {
      id: 'resources_active_user',
      label: 'I use them when I need career help.',
      categoryMappings: [],
      aggregateValue: 'career_resources_active_use',
    },
  ],

  aggregateField: 'careerResourcesUsage',
},

{
  id: 'loyola_motivation',

  questionText: 'Why did you choose Loyola?',

  weight: quizQuestionWeights.loyola_motivation,

  answerOptions: [
    {
      id: 'loyola_academics',
      label: 'I liked the academic programs.',
      categoryMappings: [],
      aggregateValue: 'academic_program_strength',
    },
    {
      id: 'loyola_career_opportunities',
      label: 'I believed Loyola would improve my career options.',
      categoryMappings: [],
      aggregateValue: 'career_opportunity_expectation',
    },
    {
      id: 'loyola_community',
      label: 'I liked the campus and community.',
      categoryMappings: [],
      aggregateValue: 'campus_community_fit',
    },
    {
      id: 'loyola_personal_attention',
      label: 'I wanted smaller classes and personal support.',
      categoryMappings: [],
      aggregateValue: 'personalized_education_preference',
    },
    {
      id: 'loyola_location',
      label: 'The location made sense for me.',
      categoryMappings: [],
      aggregateValue: 'location_convenience',
    },
    {
      id: 'loyola_affordability',
      label: 'Cost or financial aid influenced my decision.',
      categoryMappings: [],
      aggregateValue: 'affordability_influence',
    },
  ],

  aggregateField: 'loyolaMotivation',
},

{
  id: 'loyola_graduation_goal',

  questionText: 'What do you hope Loyola helps you become by graduation?',

  weight: quizQuestionWeights.loyola_graduation_goal,

  answerOptions: [
    {
      id: 'graduate_with_direction',
      label: 'Someone with a clear career direction.',
      categoryMappings: [],
      aggregateValue: 'career_direction_goal',
    },
    {
      id: 'graduate_job_ready',
      label: 'Someone ready for a strong first job.',
      categoryMappings: [],
      aggregateValue: 'job_readiness_goal',
    },
    {
      id: 'graduate_with_experience',
      label: 'Someone with useful skills and real experience.',
      categoryMappings: [],
      aggregateValue: 'skills_experience_goal',
    },
    {
      id: 'graduate_with_network',
      label: 'Someone with a strong professional network.',
      categoryMappings: [],
      aggregateValue: 'professional_network_goal',
    },
    {
      id: 'graduate_confident',
      label: 'Someone confident and independent.',
      categoryMappings: [],
      aggregateValue: 'confidence_independence_goal',
    },
    {
      id: 'graduate_with_impact',
      label: 'Someone prepared to make a meaningful impact.',
      categoryMappings: [],
      aggregateValue: 'meaningful_impact_goal',
    },
  ],
  aggregateField: 'loyolaGraduationGoal'
},

{
  id: 'desired_outcome',

  questionText:
    'What kind of financial outcome would make college feel "worth it" for you?',

  weight: quizQuestionWeights.desired_outcome,

  answerOptions: [
    {
      id: 'financial_stability',
      label: 'A stable job that comfortably covers my needs.',
      categoryMappings: [],
      aggregateValue: 'basic_financial_stability',
    },
    {
      id: 'comfortable_growth',
      label: 'A comfortable income with room to grow.',
      categoryMappings: [],
      aggregateValue: 'comfortable_income_growth',
    },
    {
      id: 'high_income',
      label: 'A high-paying career that justifies the cost.',
      categoryMappings: [],
      aggregateValue: 'high_income_college_roi',
    },
    {
      id: 'financial_flexibility',
      label: 'Enough security and flexibility to enjoy life.',
      categoryMappings: [],
      aggregateValue: 'financial_flexibility',
    },
    {
      id: 'wealth_or_ownership',
      label: 'The ability to build wealth or start something.',
      categoryMappings: [],
      aggregateValue: 'wealth_or_entrepreneurship',
    },
    {
      id: 'not_income_focused',
      label: 'Income is not how I measure college’s value.',
      categoryMappings: [],
      aggregateValue: 'nonfinancial_college_value',
    },
  ],

  aggregateField: 'desiredOutcome',
},

{
  id: 'career_planning_wish',

  questionText: 'What is one thing you wish career planning at Loyola made easier?',

  weight: quizQuestionWeights.career_planning_wish,

  answerOptions: [
    {
      id: 'wish_career_fit',
      label: 'Show me which careers fit me.',
      categoryMappings: [],
      aggregateValue: 'career_fit_clarity',
    },
    {
      id: 'wish_major_options',
      label: 'Explain what I can do with my major.',
      categoryMappings: [],
      aggregateValue: 'major_to_career_visibility',
    },
    {
      id: 'wish_clear_plan',
      label: 'Give me a clear step-by-step plan.',
      categoryMappings: [],
      aggregateValue: 'next_step_guidance',
    },
    {
      id: 'wish_internships',
      label: 'Help me find internships earlier.',
      categoryMappings: [],
      aggregateValue: 'internship_discovery_support',
    },
    {
      id: 'wish_skill_guidance',
      label: 'Show me which skills I should build.',
      categoryMappings: [],
      aggregateValue: 'skill_development_guidance',
    },
    {
      id: 'wish_personal_support',
      label: 'Make personal career guidance easier to access.',
      categoryMappings: [],
      aggregateValue: 'human_support_access',
    },
  ],
  aggregateField: 'careerPlanningWish'
},

];

function createEmptyScores(): Record<QuizCategoryId, number> {
  return quizCategoryIds.reduce((scores, categoryId) => {
    scores[categoryId] = 0;
    return scores;
  }, {} as Record<QuizCategoryId, number>);
}

function createEmptyAggregateInsights(): QuizAggregateInsights {
  return {
    majorInterest: null,
    careerClarity: null,
    internshipReadiness: null,
    biggestWorry: null,
    careerPlanningDifficulty: null,
    loyolaMotivation: null,
    loyolaGraduationGoal: null,
    desiredOutcome: null,
    careerPlanningWish: null,
    careerResourcesUsage: null,
  };
}

function roundToTwoDecimals(value: number): number {
  return Number(value.toFixed(2));
}

function clampScore(value: number): number {
  return roundToTwoDecimals(Math.min(100, Math.max(0, value)));
}

function dedupeStrings(values: Array<string | null | undefined>): string[] {
  const seenValues = new Set<string>();

  return values.reduce<string[]>((dedupedValues, value) => {
    if (!value || seenValues.has(value)) {
      return dedupedValues;
    }

    seenValues.add(value);
    dedupedValues.push(value);
    return dedupedValues;
  }, []);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getAnswerOption(question: QuizQuestion, answerId?: string): QuizAnswerOption | undefined {
  if (!answerId) {
    return undefined;
  }

  return question.answerOptions.find((option) => option.id === answerId);
}

function getProfileOrder(profile: QuizProfile): number {
  return quizProfiles.findIndex((candidate) => candidate.id === profile.id);
}

function collectResolvedSelections(selectedAnswers: QuizSelections): ResolvedQuizSelection[] {
  return quizQuestions.reduce<ResolvedQuizSelection[]>((resolvedSelections, question) => {
    const answerOption = getAnswerOption(question, selectedAnswers[question.id]);

    if (!answerOption) {
      return resolvedSelections;
    }

    resolvedSelections.push({ question, answerOption });
    return resolvedSelections;
  }, []);
}

function getSelectedAnswerLabel(selectedAnswers: QuizSelections, questionId: string): string | null {
  const question = quizQuestions.find((candidate) => candidate.id === questionId);
  const answerId = selectedAnswers[questionId];

  if (!question || !answerId) {
    return null;
  }

  return getAnswerOption(question, answerId)?.label ?? null;
}

function getMappingKey(questionId: string, answerId: string): string {
  return `${questionId}::${answerId}`;
}

function parseQuizMappingsCsv(csvText: string): ParsedQuizMappingRow[] {
  const rows = csvText
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length <= 1) {
    return [];
  }

  return rows.slice(1).reduce<ParsedQuizMappingRow[]>((parsedRows, row) => {
    const [questionId, answerId, targetType, targetId, rawWeight] = row.split(',');
    const weight = Number(rawWeight);

    if (
      !questionId ||
      !answerId ||
      !targetId ||
      (targetType !== 'job' && targetType !== 'course') ||
      Number.isNaN(weight)
    ) {
      return parsedRows;
    }

    parsedRows.push({
      questionId,
      answerId,
      targetType,
      targetId,
      weight,
    });

    return parsedRows;
  }, []);
}

function getQuizMappingsAssetUrl(): string | null {
  try {
    return new URL('../data/quiz_mappings.csv', import.meta.url).toString();
  } catch {
    return null;
  }
}

function loadQuizMappingsCsvText(): string {
  if (cachedMappingsCsvText) {
    return cachedMappingsCsvText;
  }

  if (typeof window !== 'undefined') {
    const assetUrl = getQuizMappingsAssetUrl();

    if (assetUrl) {
      try {
        const request = new XMLHttpRequest();
        request.open('GET', assetUrl, false);
        request.send(null);

        if (request.status >= 200 && request.status < 400 && request.responseText.trim().length > 0) {
          cachedMappingsCsvText = request.responseText;
          return cachedMappingsCsvText;
        }
      } catch {
        cachedMappingsCsvText = QUIZ_MAPPINGS_CSV_FALLBACK;
        return cachedMappingsCsvText;
      }
    }
  }

  cachedMappingsCsvText = QUIZ_MAPPINGS_CSV_FALLBACK;
  return cachedMappingsCsvText;
}

function setMaximumMappingWeight(
  targetMap: Map<string, Map<string, number>>,
  targetId: string,
  questionId: string,
  weight: number,
): void {
  const questionWeights = targetMap.get(targetId) ?? new Map<string, number>();
  const previousWeight = questionWeights.get(questionId) ?? 0;

  questionWeights.set(questionId, Math.max(previousWeight, weight));
  targetMap.set(targetId, questionWeights);
}

function createQuizMappingsLookup(): QuizMappingsLookup {
  const answerJobMappings = new Map<string, QuizAnswerJobMapping[]>();
  const answerCourseMappings = new Map<string, QuizAnswerCourseMapping[]>();
  const jobQuestionMaximumWeights = new Map<string, Map<string, number>>();
  const courseQuestionMaximumWeights = new Map<string, Map<string, number>>();
  const mappingRows = parseQuizMappingsCsv(loadQuizMappingsCsvText());

  for (const row of mappingRows) {
    const mappingKey = getMappingKey(row.questionId, row.answerId);

    if (row.targetType === 'job') {
      const mappings = answerJobMappings.get(mappingKey) ?? [];
      mappings.push({
        jobId: row.targetId,
        weight: row.weight,
      });
      answerJobMappings.set(mappingKey, mappings);
      setMaximumMappingWeight(jobQuestionMaximumWeights, row.targetId, row.questionId, row.weight);
      continue;
    }

    const mappings = answerCourseMappings.get(mappingKey) ?? [];
    const courseProfile = quizCourseProfiles.find((p) => p.id === row.targetId);
    mappings.push({
      courseId: row.targetId,
      courseLabel: courseProfile ? formatCourseLabel(courseProfile) : row.targetId,
      weight: row.weight,
    });
    answerCourseMappings.set(mappingKey, mappings);
    setMaximumMappingWeight(courseQuestionMaximumWeights, row.targetId, row.questionId, row.weight);
  }

  return {
    answerJobMappings,
    answerCourseMappings,
    jobQuestionMaximumWeights,
    courseQuestionMaximumWeights,
  };
}

function getQuizMappingsLookup(): QuizMappingsLookup {
  if (!cachedQuizMappingsLookup) {
    cachedQuizMappingsLookup = createQuizMappingsLookup();
  }

  return cachedQuizMappingsLookup;
}

function getNormalizedCategoryScores(
  selectedAnswers: QuizSelections,
  resolvedSelections = collectResolvedSelections(selectedAnswers),
  rawScores = calculateQuizCategoryScores(selectedAnswers),
): Record<QuizCategoryId, number> {
  return quizCategoryIds.reduce((normalizedScores, categoryId) => {
    let maximumScore = 0;

    for (const { question } of resolvedSelections) {
      const highestMatchingWeight = question.answerOptions.reduce((highestWeight, answerOption) => {
        const optionWeight = answerOption.categoryMappings.reduce((currentWeight, mapping) => {
          if (mapping.categoryId !== categoryId) {
            return currentWeight;
          }

          return Math.max(currentWeight, mapping.weight ?? 1);
        }, 0);

        return Math.max(highestWeight, optionWeight);
      }, 0);

      if (highestMatchingWeight > 0) {
        maximumScore += question.weight * highestMatchingWeight;
      }
    }

    normalizedScores[categoryId] =
      maximumScore > 0 ? clampScore((rawScores[categoryId] / maximumScore) * 100) : 0;

    return normalizedScores;
  }, createEmptyScores());
}

function buildCategoryReasons(
  categoryId: QuizCategoryId,
  resolvedSelections: ResolvedQuizSelection[],
): string[] {
  return dedupeStrings(
    resolvedSelections.flatMap(({ question, answerOption }) => {
      const hasMatch = answerOption.categoryMappings.some((mapping) => mapping.categoryId === categoryId);

      if (!hasMatch) {
        return [];
      }

      return [`"${answerOption.label}" pointed toward ${categoryId}.`];
    }),
  ).slice(0, 3);
}

function formatCourseLabel(course: Pick<QuizCourseProfile, 'courseCode' | 'courseName'>): string {
  return course.courseCode && course.courseCode !== 'TBD'
    ? `${course.courseCode} ${course.courseName}`
    : course.courseName;
}

function createEmptyTimeline(): CareerTimeline {
  return {
    currentStage: 'Now',
    stages: [],
    milestones: [],
  };
}

function createJobEntryFromRecommendation(jobRecommendation: ScoredJobRecommendation): QuizJobEntry {
  const profile = getQuizJobProfile(jobRecommendation.jobId);

  return {
    jobId: jobRecommendation.jobId,
    title: jobRecommendation.jobTitle,
    sourceCategory: profile?.sourceCategory ?? 'Business & Management',
    isPlaceholder: jobRecommendation.isPlaceholder,
  } as unknown as QuizJobEntry;
}

export function calculateQuizCategoryScores(
  selectedAnswers: QuizSelections,
): Record<QuizCategoryId, number> {
  const scores = createEmptyScores();
  const resolvedSelections = collectResolvedSelections(selectedAnswers);

  for (const { question, answerOption } of resolvedSelections) {
    for (const mapping of answerOption.categoryMappings) {
      const mappingWeight = mapping.weight ?? 1;
      scores[mapping.categoryId] += question.weight * mappingWeight;
    }
  }

  return scores;
}

export function extractAggregateInsights(selectedAnswers: QuizSelections): QuizAggregateInsights {
  const aggregateInsights = createEmptyAggregateInsights();
  const resolvedSelections = collectResolvedSelections(selectedAnswers);

  for (const { question, answerOption } of resolvedSelections) {
    if (!question.aggregateField) {
      continue;
    }

    aggregateInsights[question.aggregateField] = answerOption.aggregateValue ?? answerOption.label;
  }

  return aggregateInsights;
}

export function rankQuizCategories(
  selectedAnswers: QuizSelections,
  limit = 3,
): RankedQuizCategory[] {
  const scores = calculateQuizCategoryScores(selectedAnswers);
  const safeLimit = Math.max(1, limit);

    function getRandomSkills(skills: string[], count = 3): string[] {
  return [...skills]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

  return quizProfiles
.map((profile) => ({
  categoryId: profile.id,
  displayName: profile.displayName,
  score: roundToTwoDecimals(scores[profile.id]),
  courses: [...quizCategoryCourses[profile.id]],
  shortDescription: profile.shortDescription,
  jobs: [...profile.jobs],
  skills: getRandomSkills(quizSkillLibrary[profile.id]),
}))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const leftProfile = quizProfiles.find((profile) => profile.id === left.categoryId);
      const rightProfile = quizProfiles.find((profile) => profile.id === right.categoryId);

      if (!leftProfile || !rightProfile) {
        return 0;
      }

      return getProfileOrder(leftProfile) - getProfileOrder(rightProfile);
    })
    .slice(0, safeLimit);
}
export function buildQuizProfileSummary(
  selectedAnswers: QuizSelections,
  aggregateInsights = extractAggregateInsights(selectedAnswers),
): ProfileSummary {
  return {
    majors: dedupeStrings([aggregateInsights.majorInterest ?? getSelectedAnswerLabel(selectedAnswers, 'major_interest')]),
    strongestTalents: dedupeStrings([
      getSelectedAnswerLabel(selectedAnswers, 'natural_work_type'),
      getSelectedAnswerLabel(selectedAnswers, 'creative_or_analytical'),
    ]),
    strongestSkills: dedupeStrings([
      getSelectedAnswerLabel(selectedAnswers, 'people_or_tasks'),
      getSelectedAnswerLabel(selectedAnswers, 'skill_gaps'),
    ]),
    workStyle:
      getSelectedAnswerLabel(selectedAnswers, 'work_environment') ??
      getSelectedAnswerLabel(selectedAnswers, 'people_or_tasks') ??
      'Still exploring',
    desiredFields: dedupeStrings([getSelectedAnswerLabel(selectedAnswers, 'curious_career_field')]),
    desiredOutcomes: dedupeStrings([
      aggregateInsights.desiredOutcome ?? getSelectedAnswerLabel(selectedAnswers, 'desired_outcome'),
    ]),
    careerClarity: aggregateInsights.careerClarity ?? undefined,
    internshipReadiness: aggregateInsights.internshipReadiness ?? undefined,
  };
}

export function calculateQuizJobScores(
  selectedAnswers: QuizSelections,
  limit = 12,
): ScoredJobRecommendation[] {
  const resolvedSelections = collectResolvedSelections(selectedAnswers);

  if (
    resolvedSelections.length === 0 ||
    !Array.isArray(quizJobProfiles) ||
    quizJobProfiles.length === 0
  ) {
    return [];
  }

  const rawCategoryScores = calculateQuizCategoryScores(selectedAnswers);
  const normalizedCategoryScores = getNormalizedCategoryScores(
    selectedAnswers,
    resolvedSelections,
    rawCategoryScores,
  );
  const mappingsLookup = getQuizMappingsLookup();

  const scoredJobs = quizJobProfiles
    .map((jobProfile, originalIndex) => {
      let directScoreNumerator = 0;
      let directScoreDenominator = 0;
      const directReasons: string[] = [];

      for (const { question, answerOption } of resolvedSelections) {
        const mappingKey = getMappingKey(question.id, answerOption.id);
        const selectedMappings = (mappingsLookup.answerJobMappings.get(mappingKey) ?? []).filter(
          (mapping) => mapping.jobId === jobProfile.id,
        );
        const questionMaximumWeight =
          mappingsLookup.jobQuestionMaximumWeights.get(jobProfile.id)?.get(question.id) ?? 0;

        if (questionMaximumWeight > 0) {
          directScoreDenominator += question.weight * questionMaximumWeight;
        }

        if (selectedMappings.length === 0) {
          continue;
        }

        const selectedWeight = selectedMappings.reduce(
          (highestWeight, mapping) => Math.max(highestWeight, mapping.weight),
          0,
        );
        directScoreNumerator += question.weight * selectedWeight;
        directReasons.push(`Matched on "${answerOption.label}".`);
      }

      const hasDirectMappings = directScoreDenominator > 0;
      const normalizedDirectScore = hasDirectMappings
        ? clampScore((directScoreNumerator / directScoreDenominator) * 100)
        : 0;
      const normalizedCategoryScore = isQuizCategoryId(jobProfile.categoryId)
        ? normalizedCategoryScores[jobProfile.categoryId] ?? 0
        : 0;
      const scoreBasis: ScoredJobRecommendation['scoreBasis'] = hasDirectMappings
        ? 'direct-match'
        : 'category-fallback';
      const finalScore = hasDirectMappings
        ? clampScore(normalizedDirectScore * 0.7 + normalizedCategoryScore * 0.3)
        : clampScore(normalizedCategoryScore);
      const reasons =
        directReasons.length > 0
          ? dedupeStrings([
              ...directReasons,
              normalizedCategoryScore > 0
                ? `${jobProfile.categoryId} stayed strong in your category results.`
                : null,
            ]).slice(0, 3)
          : normalizedCategoryScore > 0
            ? [`This role inherits momentum from ${jobProfile.categoryId}.`]
            : [];

      return {
        jobId: jobProfile.id,
        jobTitle: jobProfile.title,
        categoryId: jobProfile.categoryId,
        score: finalScore,
        rank: 0,
        reasons,
        keyStrengths: [...jobProfile.keyStrengths],
        skillGaps: [...jobProfile.possibleSkillGaps],
        recommendedCourseIds: [...jobProfile.recommendedCourseIds],
        recommendedInternships: { ...jobProfile.internships },
        scoreBasis,
        isPlaceholder: jobProfile.isPlaceholder,
        originalIndex,
      };
    })
    .filter((jobRecommendation) => jobRecommendation.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.originalIndex - right.originalIndex;
    })
    .slice(0, Math.max(1, limit))
    .map(({ originalIndex: _originalIndex, ...jobRecommendation }, index) => ({
      ...jobRecommendation,
      rank: index + 1,
    }));

  return scoredJobs;
}

export function calculateQuizCourseScores(
  selectedAnswers: QuizSelections,
  jobRecommendations = calculateQuizJobScores(selectedAnswers),
  limit = 8,
): ScoredCourseRecommendation[] {
  const resolvedSelections = collectResolvedSelections(selectedAnswers);

  if (
    resolvedSelections.length === 0 ||
    !Array.isArray(quizCourseProfiles) ||
    quizCourseProfiles.length === 0
  ) {
    return [];
  }

  const normalizedCategoryScores = getNormalizedCategoryScores(selectedAnswers, resolvedSelections);
  const mappingsLookup = getQuizMappingsLookup();
  const jobScoresById = jobRecommendations.reduce((scores, recommendation) => {
    scores.set(recommendation.jobId, recommendation.score);
    return scores;
  }, new Map<string, number>());

  return quizCourseProfiles
    .map((courseProfile, originalIndex) => {
      let directScoreNumerator = 0;
      let directScoreDenominator = 0;
      const directReasons: string[] = [];

      for (const { question, answerOption } of resolvedSelections) {
        const mappingKey = getMappingKey(question.id, answerOption.id);
        const selectedMappings = (mappingsLookup.answerCourseMappings.get(mappingKey) ?? []).filter(
          (mapping) => mapping.courseId === courseProfile.id,
        );
        const questionMaximumWeight =
          mappingsLookup.courseQuestionMaximumWeights.get(courseProfile.id)?.get(question.id) ?? 0;

        if (questionMaximumWeight > 0) {
          directScoreDenominator += question.weight * questionMaximumWeight;
        }

        if (selectedMappings.length === 0) {
          continue;
        }

        const selectedWeight = selectedMappings.reduce(
          (highestWeight, mapping) => Math.max(highestWeight, mapping.weight),
          0,
        );
        directScoreNumerator += question.weight * selectedWeight;
        directReasons.push(`Matched on "${answerOption.label}".`);
      }

      const hasDirectMappings = directScoreDenominator > 0;
      const normalizedDirectScore = hasDirectMappings
        ? clampScore((directScoreNumerator / directScoreDenominator) * 100)
        : null;
      const relatedJobScores = courseProfile.relatedJobIds
        .map((jobId) => jobScoresById.get(jobId))
        .filter((score): score is number => typeof score === 'number');
      const relatedCategoryScores = courseProfile.relatedCategoryIds.map((categoryId) =>
        isQuizCategoryId(categoryId) ? normalizedCategoryScores[categoryId] ?? 0 : 0,
      );
      const hasRelatedJobScores = relatedJobScores.length > 0;
      const hasRelatedCategoryScores = courseProfile.relatedCategoryIds.length > 0;
      const weightedComponents: Array<{ score: number; weight: number }> = [];

      if (normalizedDirectScore !== null) {
        weightedComponents.push({ score: normalizedDirectScore, weight: 0.4 });
      }

      if (hasRelatedJobScores) {
        weightedComponents.push({ score: average(relatedJobScores), weight: 0.4 });
      }

      if (hasRelatedCategoryScores) {
        weightedComponents.push({ score: average(relatedCategoryScores), weight: 0.2 });
      }

      if (weightedComponents.length === 0) {
        return null;
      }

      const availableWeight = weightedComponents.reduce((sum, component) => sum + component.weight, 0);
      const weightedScore = weightedComponents.reduce(
        (sum, component) => sum + component.score * component.weight,
        0,
      );
      const finalScore = availableWeight > 0 ? clampScore(weightedScore / availableWeight) : 0;
      const priority: ScoredCourseRecommendation['priority'] =
        courseProfile.requiredForCategoryIds.length > 0 || courseProfile.requiredForJobIds.length > 0
          ? 'Required'
          : finalScore >= 75
            ? 'High Priority'
            : finalScore >= 55
              ? 'Helpful'
              : 'Optional';
      const reasons = dedupeStrings([
        ...directReasons,
        hasRelatedJobScores ? 'Connected to your stronger job matches.' : null,
        hasRelatedCategoryScores ? 'Connected to your stronger category matches.' : null,
      ]).slice(0, 3);

      return {
        courseId: courseProfile.id,
        courseCode: courseProfile.courseCode,
        courseName: courseProfile.courseName,
        score: finalScore,
        rank: 0,
        priority,
        relatedJobIds: [...courseProfile.relatedJobIds],
        relatedCategoryIds: [...courseProfile.relatedCategoryIds],
        reasons,
        prerequisites: [...courseProfile.prerequisites],
        completed: false,
        isPlaceholder: courseProfile.isPlaceholder,
        originalIndex,
      };
    })
    .filter(
      (
        courseRecommendation,
      ): courseRecommendation is ScoredCourseRecommendation & { originalIndex: number } =>
        Boolean(courseRecommendation) &&
        (courseRecommendation.score > 0 || courseRecommendation.priority === 'Required'),
    )
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.originalIndex - right.originalIndex;
    })
    .slice(0, Math.max(1, limit))
    .map(({ originalIndex: _originalIndex, ...courseRecommendation }, index) => ({
      ...courseRecommendation,
      rank: index + 1,
    }));
}

function buildCategoryRecommendations(
  selectedAnswers: QuizSelections,
  limit = 5,
): CategoryRecommendation[] {
  const resolvedSelections = collectResolvedSelections(selectedAnswers);

  if (resolvedSelections.length === 0) {
    return [];
  }


  const rankedCategories = rankQuizCategories(selectedAnswers, quizProfiles.length).filter(
    (category) => category.score > 0,
  );

  return rankedCategories.slice(0, Math.max(1, limit)).map((category, index) => ({
    categoryId: category.categoryId,
    categoryName: category.displayName,
    score: category.score,
    rank: index + 1,
    reasons: buildCategoryReasons(category.categoryId, resolvedSelections),
    topJobs: category.jobs.slice(0, 3).map((job) => job.title),
  }));
}

export function buildCareerTimeline(
  jobRecommendations: ScoredJobRecommendation[],
  courseRecommendations: ScoredCourseRecommendation[],
): CareerTimeline {
  if (jobRecommendations.length === 0 && courseRecommendations.length === 0) {
    return createEmptyTimeline();
  }

  const topCourses = courseRecommendations.slice(0, 4).map((course) => formatCourseLabel(course));
  const topJobs = jobRecommendations.slice(0, 3);
  const uniqueSkillGaps = dedupeStrings(
    topJobs.flatMap((jobRecommendation) => jobRecommendation.skillGaps),
  ).slice(0, 4);
  const internshipActions = topJobs.flatMap((jobRecommendation) => {
    const internships = Object.values(jobRecommendation.recommendedInternships);

    if (internships.length === 0) {
      return [];
    }

    return internships.slice(0, 1).map((internship) => {
      const suggestedTerms = internship.suggestedSearchTerms.slice(0, 2).join(', ');

      return suggestedTerms.length > 0
        ? `Explore ${internship.internshipTitle} searches like ${suggestedTerms}.`
        : `Explore an early internship tied to ${jobRecommendation.jobTitle}.`;
    });
  });
  const projectIdeas = topJobs.map(
    (jobRecommendation) =>
      `Build one small class, club, or personal project connected to ${jobRecommendation.jobTitle}.`,
  );
  const networkingActions = topJobs.map(
    (jobRecommendation) => `Talk with one professional, alum, or mentor in ${jobRecommendation.jobTitle}.`,
  );

  return {
    currentStage: 'Now',
    stages: [
      {
        stageId: 'now',
        title: 'Now',
        courses: topCourses.slice(0, 2),
        internshipActions: internshipActions.slice(0, 1),
        projects: projectIdeas.slice(0, 1),
        skills: uniqueSkillGaps.slice(0, 2),
        networkingActions: networkingActions.slice(0, 1),
      },
      {
        stageId: 'next_semester',
        title: 'Next semester',
        courses: topCourses.slice(0, 3),
        internshipActions: [],
        projects: projectIdeas.slice(0, 2),
        skills: uniqueSkillGaps.slice(0, 3),
        networkingActions: networkingActions.slice(0, 2),
      },
      {
        stageId: 'next_summer',
        title: 'Next summer',
        courses: [],
        internshipActions: internshipActions.slice(0, 3),
        projects: projectIdeas.slice(0, 1),
        skills: uniqueSkillGaps.slice(0, 2),
        networkingActions: networkingActions.slice(0, 2),
      },
      {
        stageId: 'before_graduation',
        title: 'Before graduation',
        courses: topCourses.slice(0, 4),
        internshipActions: internshipActions.slice(0, 2),
        projects: projectIdeas.slice(0, 3),
        skills: uniqueSkillGaps,
        networkingActions,
      },
    ],
    milestones: [
      {
        milestoneId: 'direction_checkpoint',
        title: 'Choose one or two roles to explore more deeply',
        description: 'Use your top jobs and categories to narrow the next round of exploration.',
        targetStage: 'now',
        priority: 'High',
        completed: false,
      },
      {
        milestoneId: 'course_checkpoint',
        title: 'Line up at least one supporting course',
        description: 'Choose a course that reinforces the direction the quiz is highlighting.',
        targetStage: 'next_semester',
        priority: 'High',
        completed: false,
      },
      {
        milestoneId: 'experience_checkpoint',
        title: 'Pursue one applied experience',
        description: 'Use internships, projects, or part-time work to test real fit.',
        targetStage: 'next_summer',
        priority: 'High',
        completed: false,
      },
      {
        milestoneId: 'story_checkpoint',
        title: 'Turn your strongest work into a clear story',
        description: 'Be ready to explain what you built, learned, and where you want to grow next.',
        targetStage: 'before_graduation',
        priority: 'Medium',
        completed: false,
      },
    ],
  };
}

export function buildNextSteps(
  jobRecommendations: ScoredJobRecommendation[],
  courseRecommendations: ScoredCourseRecommendation[],
): NextStep[] {
  if (jobRecommendations.length === 0 && courseRecommendations.length === 0) {
    return [];
  }

  const nextSteps: NextStep[] = [];
  let order = 1;

  const appendStep = (
    stepId: string,
    title: string,
    description: string,
    category: NextStep['category'],
  ) => {
    if (nextSteps.some((step) => step.stepId === stepId)) {
      return;
    }

    nextSteps.push({
      stepId,
      title,
      description,
      order,
      category,
      completed: false,
    });
    order += 1;
  };

  const topCourse = courseRecommendations[0];

  if (topCourse) {
    appendStep(
      `course_${topCourse.courseId}`,
      `Explore ${formatCourseLabel(topCourse)}`,
      'This course keeps showing up around your stronger current matches.',
      'Course',
    );
  }

  const topJob = jobRecommendations[0];

  if (topJob) {
    appendStep(
      `skill_${topJob.jobId}`,
      `Strengthen a key gap for ${topJob.jobTitle}`,
      topJob.skillGaps[0]
        ? `${topJob.skillGaps[0]} appears in one of your strongest roles right now.`
        : 'Use this role to identify one concrete skill to keep building.',
      'Skill',
    );

    appendStep(
      `project_${topJob.jobId}`,
      `Build one small example tied to ${topJob.jobTitle}`,
      'A class, club, or personal project can help you test fit and create proof of interest.',
      'Project',
    );

    appendStep(
      `networking_${topJob.jobId}`,
      `Talk with someone in ${topJob.jobTitle}`,
      'A short conversation can help you stress-test this path before you commit more deeply.',
      'Networking',
    );

    const topInternship = Object.values(topJob.recommendedInternships)[0];

    if (topInternship) {
      appendStep(
        `internship_${topInternship.internshipId}`,
        `Search for a ${topInternship.internshipTitle}`,
        topInternship.reasons[0] ??
          'An early internship can help you test whether this direction feels right in practice.',
        'Internship',
      );
    }
  }

  appendStep(
    'career_center_follow_up',
    'Bring these results to the career center',
    'Use your top jobs, courses, and skill gaps as a concrete starting point for advising.',
    'Career Center',
  );

  return nextSteps;
}

export function buildPathPilotResult(selectedAnswers: QuizSelections): PathPilotResult {
  const resolvedSelections = collectResolvedSelections(selectedAnswers);
  const aggregateInsights = extractAggregateInsights(selectedAnswers);
  const profileSummary = buildQuizProfileSummary(selectedAnswers, aggregateInsights);

  if (resolvedSelections.length === 0) {
    return {
      profileSummary,
      categoryRecommendations: [],
      jobRecommendations: [],
      courseRecommendations: [],
      timeline: createEmptyTimeline(),
      nextSteps: [],
    };
  }

  const categoryRecommendations = buildCategoryRecommendations(selectedAnswers);
  const jobRecommendations = calculateQuizJobScores(selectedAnswers);
  const courseRecommendations = calculateQuizCourseScores(selectedAnswers, jobRecommendations);
  const timeline = buildCareerTimeline(jobRecommendations, courseRecommendations);
  const nextSteps = buildNextSteps(jobRecommendations, courseRecommendations);

  return {
    profileSummary,
    categoryRecommendations,
    jobRecommendations,
    courseRecommendations,
    timeline,
    nextSteps,
  };
}

function buildMiniQuizInsight(result: PathPilotResult, previewMode: boolean): string {
  if (previewMode) {
    return 'Placeholder insight: results are in preview mode until more answer choices and mappings are filled in.';
  }

  
  const topCategory = result.categoryRecommendations[0];
  const topJob = result.jobRecommendations[0];

  if (topCategory && topJob) {
    return `PathPilot is currently seeing the strongest momentum around ${topCategory.categoryName}, with early job signals like ${topJob.jobTitle}.`;
  }

  if (topCategory) {
    return `PathPilot is currently seeing the strongest momentum around ${topCategory.categoryName}.`;
  }

  return 'Placeholder insight: summarize the strongest category patterns, clarity signals, and next-step themes here.';
}

export function buildMiniQuizResult(
  selectedAnswers: QuizSelections,
  limit = 3,
): MiniQuizResult {
  const topCategories = rankQuizCategories(selectedAnswers, limit);
  const aggregateInsights = extractAggregateInsights(selectedAnswers);
  const answeredQuestions = collectResolvedSelections(selectedAnswers).length;
  const previewMode = answeredQuestions === 0;
  const pathPilotResult = buildPathPilotResult(selectedAnswers);
  const seenJobIds = new Set<string>();
  const matchingJobs = [
    ...pathPilotResult.jobRecommendations.map(createJobEntryFromRecommendation),
    ...topCategories.flatMap((category) => category.jobs),
  ].filter((jobEntry) => {
    if (seenJobIds.has(jobEntry.title)) {
      return false;
    }

    seenJobIds.add(jobEntry.title);
    return true;
  });

  return {
    topCategories,
    matchingJobs: matchingJobs.slice(0, Math.max(limit * 3, 3)),
    insight: buildMiniQuizInsight(pathPilotResult, previewMode),
    callToAction:
      'Create a PathPilot account to save your quiz, unlock fuller matching, and get a personalized next-step plan.',
    aggregateInsights,
    answeredQuestions,
    previewMode,
  };
}
