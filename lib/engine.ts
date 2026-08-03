import { Database } from './databasetypes';
import { jobs, type Job, type Profile } from './jobs';
import { jobProfiles, type JobProfile } from './jobProfiles';

const weights = {
  major: 0.08,
  grad_school_interest: 0.04,
  creative_or_analytical: 0.09,
  general_talents: 0.11,
  soft_or_hard_skills: 0.05,
  soft_skills: 0.08,
  hard_skills: 0.09,
  employee_type: 0.07,
  target_salary: 0.06,
  desired_field: 0.10,
  desired_outcome: 0.07,
  desired_industry: 0.08,
  tech_or_no: 0.07,
  work_environment: 0.08,
  grad_school_career: 0.06,
  willingness_to_overwork: 0.04,
  people_or_task: 0.10,
  desired_location: 0.04,
  workplace_values: 0.07,
} as const;

type WeightField = keyof typeof weights;
type ScalarValue = string | boolean;
type UserFieldValue = ScalarValue | string[] | undefined | null;
type GeneratedMatchType = 'High Match' | 'Medium Match' | 'Reach Match' | 'No Match';

const penaltyFields = new Set<WeightField>([
  'creative_or_analytical',
  'soft_or_hard_skills',
  'people_or_task',
  'desired_location',
  'tech_or_no',
  'grad_school_career',
]);

const mixOfBothFields = new Set<WeightField>([
  'creative_or_analytical',
  'soft_or_hard_skills',
  'people_or_task',
]);

type ProfileRecommendationsTable = {
  Row: {
    id: string;
    user_id: string;
    career_recommendation: string;
    match_score: number;
    match_type: string;
    reasons: string[];
    key_strengths: string[];
  };
  Insert: {
    id?: string;
    user_id: string;
    career_recommendation: string;
    match_score: number;
    match_type: string;
    reasons: string[];
    key_strengths: string[];
  };
  Update: {
    id?: string;
    user_id?: string;
    career_recommendation?: string;
    match_score?: number;
    match_type?: string;
    reasons?: string[];
    key_strengths?: string[];
  };
};

type EngineDatabase = Database & {
  public: {
    Tables: Database['public']['Tables'] & {
      profile_recommendations: ProfileRecommendationsTable;
    };
  };
};

export type UserProfile = Profile;
export type ProfileRecommendation =
  EngineDatabase['public']['Tables']['profile_recommendations']['Row'];

function getUserFieldValue(userProfile: UserProfile, field: WeightField): UserFieldValue {
  const lookup = userProfile as unknown as Record<WeightField, UserFieldValue>;
  return lookup[field];
}

function isNA(value: UserFieldValue): boolean {
  if (value === 'N/A') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.includes('N/A');
  }

  return false;
}

function toStringSelections(value: UserFieldValue): string[] {
  if (value === undefined || value === null || typeof value === 'boolean') {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function hasAnyValue(value: UserFieldValue): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

function computeArrayContribution(userValue: UserFieldValue, jobValue: string[], weight: number): number {
  const userSelections = toStringSelections(userValue);

  if (userSelections.length === 0) {
    return 0;
  }

  const splitWeight = weight / userSelections.length;

  return userSelections.reduce((total, selection) => {
    if (jobValue.includes(selection)) {
      return total + splitWeight;
    }

    return total;
  }, 0);
}

function computeScalarContribution(field: WeightField, userValue: UserFieldValue, jobValue: ScalarValue, weight: number): number {
  if (typeof jobValue === 'boolean') {
    if (typeof userValue !== 'boolean') {
      return 0;
    }

    if (userValue === jobValue) {
      return weight;
    }

    return penaltyFields.has(field) ? -(weight * 0.5) : 0;
  }

  const userSelections = toStringSelections(userValue);

  if (userSelections.length === 0) {
    return 0;
  }

  if (mixOfBothFields.has(field) && userSelections.includes('mix of both')) {
    return weight * 0.5;
  }

  const splitWeight = weight / userSelections.length;
  const matchedSelections = userSelections.filter((selection) => selection === jobValue);

  if (matchedSelections.length > 0) {
    return matchedSelections.length * splitWeight;
  }

  return penaltyFields.has(field) ? -(weight * 0.5) : 0;
}

export function computeMatchScore(userProfile: UserProfile, jobProfile?: JobProfile): number {
  if (!jobProfile) {
    return 0;
  }

  const profile = jobProfile as Partial<Record<WeightField, string[] | ScalarValue>>;

  let earnedScore = 0;
  let availableWeight = 0;

  for (const field of Object.keys(weights) as WeightField[]) {
    const userValue = getUserFieldValue(userProfile, field);
    const jobValue = profile[field];

    if (!hasAnyValue(userValue) || jobValue === undefined || isNA(userValue)) {
      continue;
    }

    availableWeight += weights[field];

    if (Array.isArray(jobValue)) {
      earnedScore += computeArrayContribution(userValue, jobValue, weights[field]);
      continue;
    }

    earnedScore += computeScalarContribution(field, userValue, jobValue, weights[field]);
  }

  if (availableWeight === 0) {
    return 0;
  }

  const normalizedScore = (earnedScore / availableWeight) * 100;

  return Math.max(0, Math.min(100, Math.round(normalizedScore)));
}

export function getMatchType(score: number): GeneratedMatchType {
  if (score >= 85) return 'High Match';
  if (score >= 60) return 'Medium Match';
  if (score >= 50) return 'Reach Match';
  return 'No Match';
}

export type GeneratedMatch = Omit<
  Job,
  'reasons' | 'key_strengths' | 'skill_gaps' | 'match_score' | 'match_type'
> &
  Pick<
    ProfileRecommendation,
    'career_recommendation' | 'match_score' | 'match_type' | 'reasons' | 'key_strengths'
  > & {
    skill_gaps: string[];
  };

export function generateMatches(userProfile: UserProfile): GeneratedMatch[] {
  return jobs.flatMap((job) => {
    const jobProfile = jobProfiles.find(
      (jp) => jp.career_recommendation === job.career_recommendation,
    );

    if (!jobProfile) {
      console.warn(`missing job profile for career recommendation: ${job.career_recommendation}`);
      return [];
    }

    const score = computeMatchScore(userProfile, jobProfile);
    const matchType = getMatchType(score);

    return [{
      ...job,
      match_score: score,
      match_type: matchType,
      reasons: job.reasons(userProfile),
      key_strengths: job.key_strengths(userProfile),
      skill_gaps: job.skill_gaps(userProfile),
    }];
  });
}
