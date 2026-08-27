import {
  quizCategoryIds,
  quizJobLibrary,
  type QuizCategoryId,
  type QuizJobEntry,
} from './quizjobs';

export interface QuizProfile {
  id: QuizCategoryId;
  displayName: string;
  shortDescription: string;
  jobs: QuizJobEntry[];
}

const placeholderDescriptions: Record<QuizCategoryId, string> = {
  'Marketing & Advertising':
    'Your score reflects how strongly your answers align with understanding audiences, shaping persuasive messages, and measuring campaign performance. Work in this field includes researching customers, planning advertisements, managing brands, testing content, and improving results with campaign data.',

  'Healthcare':
    'A stronger match suggests interest in improving people’s health through patient care, laboratory work, health data, or clinical operations. Healthcare careers often require accuracy, evidence-based decisions, clear communication, and the ability to work responsibly with patients or sensitive information.',

  'Analytics & Data':
    'This result measures your interest in using evidence to answer questions and improve decisions. Professionals in this field clean datasets, write queries, build statistical models, create visualizations, and explain what the findings mean for an organization.',

  'Business Intelligence':
    'Your match rises when your answers favor combining business knowledge with practical data tools. Business intelligence professionals build dashboards, track performance measures, investigate operational problems, and turn company data into recommendations managers can use.',

  'Business & Management':
    'A higher score indicates interest in coordinating people, processes, budgets, and organizational goals. The work can involve managing projects, improving operations, assigning resources, resolving workflow problems, and helping teams deliver measurable results.',

  'Cybersecurity':
    'This score reflects interest in protecting computer systems, networks, accounts, and sensitive data from misuse or attack. Cybersecurity work includes monitoring threats, testing defenses, investigating incidents, managing access, and helping organizations recover from security failures.',

  'Information Technology (IT)':
    'Your result shows how closely your answers match the practical work of keeping workplace technology reliable. IT professionals configure computers and networks, manage user access, troubleshoot technical problems, maintain cloud systems, and support the employees who depend on them.',

  'Finance':
    'A stronger finance match points toward interest in money, markets, risk, and investment decisions. Professionals analyze financial statements, forecast cash flows, value companies or assets, evaluate uncertainty, and help individuals or organizations allocate capital.',

  'Science & Research':
    'This score captures your interest in investigating questions through structured evidence rather than assumptions. Scientific and research careers involve reviewing prior findings, designing studies, collecting reliable measurements, analyzing results, and communicating conclusions that others can examine.',

  'Electrical Engineering':
    'Your match reflects interest in designing and testing systems that use electricity, electronics, signals, or power. Electrical engineers work with circuits, communication equipment, control systems, sensors, energy networks, and the measurements needed to verify that equipment works safely.',

  'Mechanical & Industrial Engineering':
    'A stronger result suggests you enjoy improving physical products, machines, manufacturing systems, or production processes. Work may include creating CAD models, testing designs, analyzing forces and motion, reducing waste, improving quality, and making operations more efficient.',

  'Civil Engineering':
    'This score indicates alignment with planning and maintaining the infrastructure communities depend on. Civil engineering work includes designing roads, bridges, buildings, water systems, and construction plans while checking costs, materials, safety standards, and environmental conditions.',

  'Biomechanical Engineering':
    'Your result measures interest in applying mechanics and engineering to the human body. Professionals use movement data, anatomy, materials, and product testing to develop medical devices, rehabilitation equipment, prosthetics, sports technology, and safer human-centered designs.',

  'Computer Science & Software Development':
    'A higher match suggests interest in building solutions through programming, algorithms, and computer systems. Software professionals design applications, organize data, test code, connect services through APIs, fix defects, and maintain products as user and business needs change.',

  'Computer Engineering':
    'This match reflects interest in the point where computer hardware and software meet. Computer engineers design processors, embedded systems, digital circuits, firmware, sensors, and connected devices, then test how those components perform together.',

  'Economics':
    'Your score shows how strongly you are drawn to explaining choices, markets, incentives, and policy outcomes with evidence. Economists analyze data, estimate relationships, forecast changes, and study how decisions affect prices, employment, businesses, governments, and households.',

  'Environmental Work & Sustainability':
    'A stronger match suggests interest in solving environmental problems through science, policy, technology, or organizational change. The work can include collecting environmental data, mapping risks, checking regulatory compliance, measuring emissions, and designing practical sustainability programs.',

  'Accounting':
    'This result reflects interest in keeping financial information accurate, organized, and accountable. Accounting professionals prepare statements, reconcile accounts, evaluate internal controls, support tax filings, examine transactions, and document whether financial records follow required standards.',

  'Mathematics & Statistics':
    'Your match rises when your answers favor structured reasoning, quantitative patterns, and evidence under uncertainty. Professionals build mathematical models, estimate probabilities, test claims, optimize decisions, and explain what numerical results can and cannot support.',

  'Materials Engineering':
    'This score reflects interest in understanding why physical materials behave differently and how they can be improved. Materials engineers test metals, polymers, ceramics, composites, and semiconductors to select suitable materials, investigate failures, and improve manufacturing performance.',

  'Education':
    'A higher education match suggests interest in helping people develop knowledge and practical ability. Education professionals plan lessons, explain difficult material, assess learning, adapt instruction, manage classrooms or programs, and use student results to improve their teaching.',

  'Writing & Journalism':
    'Your result measures interest in finding accurate information and communicating it clearly to an audience. Work in this field includes interviewing sources, researching records, verifying claims, organizing stories, editing language, and publishing through print, broadcast, or digital platforms.',

  'Politics & Public Policy':
    'This score reflects interest in how governments make decisions and how those decisions affect communities. Professionals research legislation, analyze programs and budgets, track public opinion, communicate policy choices, and work with officials, organizations, or voters.',

  'Legal Services':
    'A stronger match indicates interest in applying rules and evidence to disputes, agreements, and public decisions. Legal work involves researching laws, interpreting cases, reviewing records, drafting documents, advising clients, and constructing arguments that can withstand formal scrutiny.',

  'Languages & International Affairs':
    'Your match shows how strongly your answers favor cross-cultural communication and international problem-solving. Careers may involve translating language, interpreting cultural context, studying regions, evaluating geopolitical developments, coordinating international programs, or representing organizations abroad.',

  'History & Cultural Heritage':
    'This result reflects interest in investigating, preserving, and explaining the past through reliable evidence. Professionals examine archives and artifacts, verify sources, manage collections, document historic places, design museum exhibits, and make historical material understandable to the public.',

  'Media, Communications & Public Relations':
    'A higher match suggests interest in shaping how information reaches and influences an audience. Professionals create media content, write public statements, manage press relationships, monitor public response, prepare crisis communication, and use audience data to improve messaging.',

  'Arts & Creative Industries':
    'Your score reflects interest in turning ideas into visual, audio, written, or performance-based work. Creative professionals develop concepts, use production tools, revise work from feedback, manage portfolios, and produce experiences for audiences, clients, entertainment companies, or cultural organizations.',

  'Social & Behavioral Sciences':
    'This match measures interest in understanding how people think, behave, and interact within groups and institutions. Professionals use surveys, interviews, experiments, observations, and statistical analysis to study behavior and improve programs, workplaces, policies, or mental-health services.',

  'Religion, Ministry & Spiritual Life':
    'A stronger match suggests interest in religious traditions, ethical questions, spiritual care, or service-centered leadership. Work may include interpreting texts, leading worship, supporting people through difficult events, managing community programs, facilitating interfaith dialogue, and directing faith-based organizations.',
};

export const quizProfiles: QuizProfile[] = quizCategoryIds.map((categoryId) => ({
  id: categoryId,
  displayName: categoryId,
  shortDescription: placeholderDescriptions[categoryId],
  jobs: [...quizJobLibrary[categoryId]],
}));

export function getQuizProfile(categoryId: QuizCategoryId): QuizProfile | undefined {
  return quizProfiles.find((profile) => profile.id === categoryId);
}
