// testEngine.ts
import { generateMatches } from './lib/engine';

const mockProfile = {
  major: ['data science'],
  general_talents: ['analysis & research', 'math & numbers'],
  soft_skills: ['communication'],
  hard_skills: ['data analysis', 'programming'],
  desired_field: ['tech'],
  creative_or_analytical: 'data-driven work',
  soft_or_hard_skills: 'hard',
  employee_type: 'analytical / detail-oriented',
  people_or_task: 'task oriented',
  work_environment: 'structured / predictable',
  desired_location: 'anywhere in the u.s.',
  tech_or_no: true,
  grad_school_career: true,
  desired_outcome: 'build skills for future opportunities',
};

console.log("mockProfile:", mockProfile);

const results = generateMatches(mockProfile as any);

console.log(results);